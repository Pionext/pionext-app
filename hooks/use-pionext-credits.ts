"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

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

  const fetchBalance = async (userId: string) => {
    try {
      const response = await fetch(`/api/credits/balance?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      const data = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance(user.id);
    }
  }, [user]);

  const purchaseCredits = async (amount: number) => {
    if (!user) throw new Error("Must be logged in to purchase credits");

    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to purchase credits');
      }

      const { balance: newBalance, transaction } = await response.json();
      
      setBalance(newBalance);
      setTransactions(prev => [...prev, transaction]);

      return transaction;
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  };

  return {
    balance,
    transactions,
    isLoading,
    purchaseCredits
  };
} 