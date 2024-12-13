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
  type PurchaseResult,
  type SaleResult 
} from "@/utils/bonding-curve";
import { BondingCurveChart } from "./bonding-curve-chart";

interface TradingSectionProps {
  projectId: string;
}

const getSimulationAmount = (simulation: PurchaseResult | SaleResult) => {
  if ('cost' in simulation) {
    return simulation.cost.toFixed(2);
  }
  return simulation.proceeds.toFixed(2);
};

export function TradingSection({ projectId }: TradingSectionProps) {
  const { credits, holding, tradeCredits } = useProjectCredits(projectId);
  const { balance: pionextBalance } = usePionextCredits();
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!credits) return null;

  const currentPrice = calculatePrice(credits.currentSupply, {
    currentSupply: credits.currentSupply,
    maxSupply: credits.maxSupply
  });

  // Calculate simulation results
  const simulation = action === 'buy' 
    ? simulatePurchase(Number(amount) || 0, credits)
    : simulateSale(Number(amount) || 0, credits);

  const handleTrade = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await tradeCredits(action, Number(amount));
      setAmount('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to trade credits');
    } finally {
      setIsLoading(false);
    }
  };

  const canTrade = () => {
    if (!amount || Number(amount) <= 0 || !simulation) return false;
    if (action === 'buy') {
      return pionextBalance >= (simulation as PurchaseResult).cost;
    } else {
      return holding ? holding.balance >= Number(amount) : false;
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
                <label className="text-sm">Amount</label>
                <span className="text-sm text-gray-500">
                  Max: {action === 'buy' 
                    ? credits.maxSupply - credits.currentSupply 
                    : holding?.balance || 0
                  }
                </span>
              </div>
              <Input
                type="number"
                placeholder="Enter amount of credits"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {simulation && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
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
                    ${simulation && getSimulationAmount(simulation)}
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