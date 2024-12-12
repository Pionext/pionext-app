"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import creditsData from "@/data/credits.json";
import holdingsData from "@/data/credit_holdings.json";
import { calculatePrice } from "@/utils/bonding-curve";
import Link from "next/link";

export function ProjectCredits() {
  const { user } = useAuth();

  if (!user) return null;

  // Get all holdings for the user
  const userHoldings = holdingsData.holdings.filter(h => h.userId === user.id);
  
  // Map holdings to credits data
  const holdingsWithCredits = userHoldings.map(holding => {
    const credit = creditsData.credits.find(c => c.id === holding.creditId);
    if (!credit) return null;

    const currentPrice = calculatePrice(credit.currentSupply, {
      ...credit,
      curveType: credit.curveType as 'quadratic' | 'pump'
    });

    return {
      ...holding,
      credit,
      currentPrice
    };
  }).filter(Boolean);

  if (holdingsWithCredits.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {holdingsWithCredits.map((holding) => (
            <Link 
              key={holding.id} 
              href={`/projects/${holding.credit.projectId}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">{holding.credit.name}</h3>
                  <p className="text-sm text-gray-500">{holding.credit.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{holding.balance.toLocaleString()} credits</p>
                  <p className="text-sm text-gray-500">
                    ${holding.currentPrice.toFixed(4)} per credit
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 