"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { 
  calculatePrice, 
  simulatePurchase, 
  simulateSale,
  type PurchaseResult,
  type SaleResult 
} from "@/utils/bonding-curve";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon, LineChart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePionextCredits } from "@/contexts/pionext-credits-context";
import { BondingCurveChart } from "./bonding-curve-chart";

interface TradingWidgetProps {
  projectId: string;
  projectName: string;
}

type TradeType = "buy" | "sell";

export function TradingWidget({ projectId, projectName }: TradingWidgetProps) {
  const { user } = useAuth();
  const { credits, holding, tradeCredits } = useProjectCredits(projectId);
  const { balance: pionextBalance } = usePionextCredits();
  const currentPrice = credits ? calculatePrice(credits.currentSupply, credits) : 0;
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [pionextAmount, setPionextAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBondingCurve, setShowBondingCurve] = useState(false);

  if (!credits) return null;

  // Calculate discount percentage based on final price ($1)
  const calculateDiscount = () => {
    if (!credits || currentPrice <= 0) return 0;
    return Math.round(((1 - currentPrice) / 1) * 100);
  };

  const discountPercentage = calculateDiscount();

  // Binary search to find the amount of credits that costs close to the target PIONEXT amount
  const getCreditAmount = (pionextValue: number) => {
    if (pionextValue <= 0) return 0;
    
    let low = 0;
    let high = tradeType === 'buy' 
      ? credits.maxSupply - credits.currentSupply
      : (holding?.balance || 0);
    
    // For very small amounts, start with a smaller range
    if (pionextValue < currentPrice) {
      high = Math.min(high, Math.ceil(pionextValue / (currentPrice * 0.5)));
    }

    let bestAmount = 0;
    let bestDiff = Number.MAX_VALUE;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      const simulation = tradeType === 'buy'
        ? simulatePurchase(mid, credits)
        : simulateSale(mid, credits);

      if (!simulation) {
        high = mid - 1;
        continue;
      }

      const cost = tradeType === 'buy' 
        ? (simulation as PurchaseResult).cost 
        : (simulation as SaleResult).proceeds;
      const diff = Math.abs(cost - pionextValue);

      // Update best if this is closer to target
      if (diff < bestDiff) {
        bestDiff = diff;
        bestAmount = mid;
      }

      if (cost > pionextValue) {
        high = mid - 1;
      } else if (cost < pionextValue) {
        low = mid + 1;
      } else {
        return mid; // Exact match
      }
    }

    return bestAmount;
  };

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    const formatted = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    setPionextAmount(formatted);
  };

  const adjustAmount = (delta: number) => {
    const currentAmount = parseFloat(pionextAmount) || 0;
    const newAmount = Math.max(0, currentAmount + delta);
    setPionextAmount(newAmount.toString());
  };

  // Calculate simulation results based on input amount
  const simulation = tradeType === 'buy' 
    ? simulatePurchase(getCreditAmount(Number(pionextAmount) || 0), credits)
    : simulateSale(Number(pionextAmount) || 0, credits);

  const handleTrade = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const amount = tradeType === 'buy' 
        ? getCreditAmount(Number(pionextAmount) || 0)
        : Number(pionextAmount) || 0;
      await tradeCredits(tradeType, amount);
      setPionextAmount('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to trade credits');
    } finally {
      setIsLoading(false);
    }
  };

  const canTrade = () => {
    if (!pionextAmount || Number(pionextAmount) <= 0 || !simulation) return false;
    if (tradeType === 'buy') {
      return pionextBalance >= Number(pionextAmount);
    } else {
      return holding ? holding.balance >= Number(pionextAmount) : false;
    }
  };

  // Calculate max amounts in PIONEXT tokens
  const getMaxAmount = () => {
    if (tradeType === 'buy') {
      return pionextBalance.toFixed(2);
    } else {
      if (!holding?.balance) return '0';
      const simulation = simulateSale(holding.balance, credits);
      return simulation ? simulation.proceeds.toFixed(2) : '0';
    }
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{credits.symbol}</h2>
                {discountPercentage > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold tracking-wider">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{credits.name}</p>
                <p className="text-sm text-gray-500">Balance: {holding?.balance.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{showBondingCurve ? "Bonding Curve" : "Trade"}</span>
            <button 
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={() => setShowBondingCurve(!showBondingCurve)}
            >
              <LineChart className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {showBondingCurve ? (
            <>
              <BondingCurveChart credit={{
                symbol: credits.symbol,
                name: credits.name,
                currentSupply: credits.currentSupply,
                maxSupply: credits.maxSupply
              }} />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{credits.currentSupply.toLocaleString()} credits</span>
                <span>{credits.maxSupply.toLocaleString()} max</span>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setTradeType("buy")}
                  className={cn(
                    "py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                    tradeType === "buy"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={cn(
                    "py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                    tradeType === "sell"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  Sell
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Amount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {tradeType === "buy" 
                          ? `P$${pionextBalance.toLocaleString()}`
                          : `${holding?.balance.toLocaleString() || 0} ${credits.symbol}`
                        }
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs text-white bg-black hover:bg-gray-800"
                        onClick={() => {
                          if (tradeType === "buy") {
                            setPionextAmount(pionextBalance.toFixed(2));
                          } else if (holding) {
                            setPionextAmount(holding.balance.toString());
                          }
                        }}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustAmount(-10)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {tradeType === "buy" ? "P$" : ""}
                      </span>
                      <Input
                        type="text"
                        value={pionextAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0"
                        className={cn(
                          "text-center",
                          tradeType === "buy" ? "pl-8" : "px-4"
                        )}
                      />
                    </div>
                    <button
                      onClick={() => adjustAmount(10)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {simulation && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    {tradeType === "buy" ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Credits to buy</span>
                          <span>{getCreditAmount(Number(pionextAmount) || 0).toLocaleString()} {credits.symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Price</span>
                          <span>P${isNaN(simulation.averagePrice) ? '0.0000' : simulation.averagePrice.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Cost</span>
                          <span>P${Number(pionextAmount).toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Credits to sell</span>
                          <span>{Number(pionextAmount).toLocaleString()} {credits.symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average Price</span>
                          <span>P${isNaN(simulation.averagePrice) ? '0.0000' : simulation.averagePrice.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Receive</span>
                          <span>P${(simulation as SaleResult).proceeds.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                {user ? (
                  <Button 
                    className={cn(
                      "w-full",
                      tradeType === "buy" ? "bg-[#0000ff] hover:bg-[#0000ff]/90" : ""
                    )}
                    size="lg"
                    onClick={handleTrade}
                    disabled={!canTrade() || isLoading}
                    variant={tradeType === "buy" ? "default" : "secondary"}
                  >
                    {isLoading ? 'Processing...' : tradeType === "buy" ? "Buy" : "Sell"}
                  </Button>
                ) : (
                  <Button className="w-full" size="lg">
                    Log In to Trade
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By trading, you agree to the Terms of Use.
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 