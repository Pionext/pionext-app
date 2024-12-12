"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCredits } from '@/contexts/credits-context';
import creditsData from '@/data/credits.json';
import holdingsData from '@/data/credit_holdings.json';

interface Credit {
  id: string;
  projectId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  currentSupply: number;
  maxSupply: number;
  curveType: 'quadratic' | 'pump';
}

interface CreditHolding {
  id: string;
  creditId: string;
  userId: string;
  balance: number;
  lastUpdated: string;
}

interface Trade {
  id: string;
  creditId: string;
  userId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

export function useProjectCredits(projectId: string) {
  const { user } = useAuth();
  const { setBalance } = useCredits();
  const [credits, setCredits] = useState<Credit | null>(null);
  const [holding, setHolding] = useState<CreditHolding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const credit = creditsData.credits.find(c => c.projectId === projectId);
    if (credit) {
      setCredits(credit);
      if (user) {
        const userHolding = holdingsData.holdings.find(
          h => h.creditId === credit.id && h.userId === user.id
        );
        setHolding(userHolding || null);
      }
    } else {
      setError(new Error('Credits not found'));
    }
    setIsLoading(false);
  }, [projectId, user]);

  const tradeCredits = async (type: 'buy' | 'sell', amount: number) => {
    if (!user) throw new Error('Must be logged in to trade');
    if (!credits) throw new Error('Credits not found');

    try {
      const response = await fetch('/api/credits/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          creditId: credits.id,
          type,
          amount
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to trade credits');
      }

      const { trade, holding: newHolding, credit: updatedCredit, pionextBalance } = await response.json();
      
      setCredits(updatedCredit);
      setHolding(newHolding);
      setBalance(pionextBalance);

      return trade;
    } catch (error) {
      console.error('Trade error:', error);
      throw error;
    }
  };

  return {
    credits,
    holding,
    isLoading,
    error,
    tradeCredits
  };
} 