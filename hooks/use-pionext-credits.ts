"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import pionextCreditsData from "@/data/pionext_credits.json";

interface PionextCreditsData {
  balances: Array<{
    userId: string;
    balance: number;
    lastUpdated: string;
  }>;
  transactions: Array<{
    id: string;
    userId: string;
    type: "purchase";
    amount: number;
    timestamp: string;
  }>;
}

export function usePionextCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<PionextCreditsData["transactions"]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call
      const data = pionextCreditsData as PionextCreditsData;
      const userBalance = data.balances.find(b => b.userId === user.id)?.balance || 0;
      const userTransactions = data.transactions.filter(t => t.userId === user.id);
      
      setBalance(userBalance);
      setTransactions(userTransactions);
      setIsLoading(false);
    }
  }, [user]);

  const purchaseCredits = async (amount: number) => {
    // This would be replaced with actual API call and Stripe integration
    const mockPurchase = {
      id: `txn_${Date.now()}`,
      userId: user?.id || "",
      type: "purchase" as const,
      amount,
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [...prev, mockPurchase]);
    setBalance(prev => prev + amount);

    return mockPurchase;
  };

  return {
    balance,
    transactions,
    isLoading,
    purchaseCredits
  };
} 