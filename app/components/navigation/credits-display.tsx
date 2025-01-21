"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePionextCredits } from "@/contexts/pionext-credits-context";
import creditsData from "@/data/credits.json";
import holdingsData from "@/data/credit_balances.json";
import { calculatePrice } from "@/utils/bonding-curve";
import { useAuth } from "@/hooks/use-auth";

export function CreditsDisplay() {
  const { balance, isLoading } = usePionextCredits();
  const { user } = useAuth();
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Get all holdings for the user
    const userHoldings = holdingsData.holdings.filter(h => h.userId === user.id);
    
    // Calculate total value of all holdings
    const totalValue = userHoldings.reduce((sum, holding) => {
      const credit = creditsData.credits.find(c => c.id === holding.creditId);
      if (!credit) return sum;

      const currentPrice = calculatePrice(credit.currentSupply, {
        currentSupply: credit.currentSupply,
        maxSupply: credit.maxSupply
      });

      return sum + (currentPrice * holding.balance);
    }, balance); // Add PIONEXT balance to total

    setPortfolioValue(totalValue);
  }, [user, balance]);

  if (isLoading) {
    return null;
  }

  const formatAmount = (amount: number) => {
    if (amount === 0) {
      return amount.toFixed(2);
    }
    return Math.floor(amount).toLocaleString();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-black font-medium">P${formatAmount(portfolioValue)}</span>
          <span className="text-xs text-gray-500">All Credits</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black font-medium">P${formatAmount(balance)}</span>
          <span className="text-xs text-gray-500">PIONEXT</span>
        </div>
      </div>
      <Button 
        asChild
        className="bg-[#0000FF] text-white hover:bg-[#0000CC] active:bg-[#000099] transition-colors"
      >
        <Link href="/profile">Deposit</Link>
      </Button>
    </div>
  );
} 