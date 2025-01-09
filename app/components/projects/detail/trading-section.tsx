"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { usePionextCredits } from "@/contexts/pionext-credits-context";
import { 
  simulatePurchase, 
  simulateSale,
  calculatePrice,
  calculateCost,
  type PurchaseResult,
  type SaleResult 
} from "@/utils/bonding-curve";
import { BondingCurveChart } from "./bonding-curve-chart";

interface TradingSectionProps {
  projectId: string;
}

export function TradingSection({ projectId }: TradingSectionProps) {
  const { credits, holding, tradeCredits } = useProjectCredits(projectId);
  const { balance: pionextBalance } = usePionextCredits();
  const [pionextAmount, setPionextAmount] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!credits) return null;

  const currentPrice = calculatePrice(credits.currentSupply, {
    currentSupply: credits.currentSupply,
    maxSupply: credits.maxSupply
  });

  // Binary search to find the amount of credits that costs close to the target PIONEXT amount
  const getCreditAmount = (pionextValue: number) => {
    if (pionextValue <= 0) return 0;
    
    let low = 0;
    let high = action === 'buy' 
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
      
      const simulation = action === 'buy'
        ? simulatePurchase(mid, credits)
        : simulateSale(mid, credits);

      if (!simulation) {
        high = mid - 1;
        continue;
      }

      const cost = action === 'buy' 
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

  // Calculate simulation results based on PIONEXT amount
  const creditAmount = getCreditAmount(Number(pionextAmount) || 0);
  const simulation = action === 'buy' 
    ? simulatePurchase(creditAmount, credits)
    : simulateSale(creditAmount, credits);

  const handleTrade = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await tradeCredits(action, creditAmount);
      setPionextAmount('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to trade credits');
    } finally {
      setIsLoading(false);
    }
  };

  const canTrade = () => {
    if (!pionextAmount || Number(pionextAmount) <= 0 || !simulation) return false;
    if (action === 'buy') {
      return pionextBalance >= Number(pionextAmount);
    } else {
      return holding ? holding.balance >= creditAmount : false;
    }
  };

  // Calculate max amounts in PIONEXT tokens
  const getMaxAmount = () => {
    if (action === 'buy') {
      const maxCredits = credits.maxSupply - credits.currentSupply;
      const simulation = simulatePurchase(maxCredits, credits);
      return simulation ? (simulation as PurchaseResult).cost.toFixed(2) : '0';
    } else {
      if (!holding?.balance) return '0';
      const simulation = simulateSale(holding.balance, credits);
      return simulation ? (simulation as SaleResult).proceeds.toFixed(2) : '0';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Credit Trading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Overview */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Credit Price</p>
              <p className="text-2xl font-bold">${currentPrice.toFixed(4)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Supply</p>
              <p className="text-lg">
                {credits.currentSupply.toLocaleString()} / {credits.maxSupply.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Bonding Curve */}
          <BondingCurveChart credit={{
            symbol: credits.symbol,
            name: credits.name,
            currentSupply: credits.currentSupply,
            maxSupply: credits.maxSupply
          }} />

          {/* Trading Interface */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant={action === 'buy' ? 'default' : 'outline'}
                onClick={() => setAction('buy')}
                className="flex-1"
              >
                Buy Credits
              </Button>
              <Button 
                variant={action === 'sell' ? 'default' : 'outline'}
                onClick={() => setAction('sell')}
                className="flex-1"
              >
                Sell Credits
              </Button>
            </div>

            {/* Balances */}
            <div className="flex justify-between text-sm text-gray-500">
              <span>PIONEXT Balance: {pionextBalance.toLocaleString()}</span>
              <span>{credits.symbol} Balance: {holding?.balance.toLocaleString() || 0}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Amount in PIONEXT (USD)</label>
                <span className="text-sm text-gray-500">
                  Max: ${getMaxAmount()}
                </span>
              </div>
              <Input
                type="number"
                placeholder="Enter amount in PIONEXT"
                value={pionextAmount}
                onChange={(e) => setPionextAmount(e.target.value)}
              />
            </div>

            {simulation && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Credits to {action}</span>
                  <span>{creditAmount.toLocaleString()} {credits.symbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Price</span>
                  <span>${isNaN(simulation.averagePrice) ? '0.0000' : simulation.averagePrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price Impact</span>
                  <span>
                    ${simulation.priceImpact.toFixed(4)} 
                    (~{((simulation.priceImpact / currentPrice) * 100).toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Total {action === 'buy' ? 'Cost' : 'Receive'}</span>
                  <span>
                    ${Number(pionextAmount).toFixed(2)} PIONEXT
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              className="w-full"
              size="lg"
              disabled={!canTrade() || isLoading}
              onClick={handleTrade}
            >
              {isLoading ? 'Processing...' : action === 'buy' ? 'Buy Credits' : 'Sell Credits'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 