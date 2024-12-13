"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { usePionextCredits } from "@/contexts/pionext-credits-context";

export function PionextCredits() {
  const { user } = useAuth();
  const { balance, purchaseCredits, isLoading } = usePionextCredits();
  const [amount, setAmount] = useState("");
  
  const handlePurchase = async () => {
    try {
      await purchaseCredits(Number(amount));
      alert(`Mock purchase of ${amount} PIONEXT credits successful!`);
      setAmount("");
    } catch (error) {
      alert("Failed to purchase credits");
    }
  };

  if (isLoading) {
    return <Card><CardContent>Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PIONEXT Credits</CardTitle>
        <CardDescription>
          Purchase PIONEXT credits to invest in projects (1 PIONEXT = $1 USD)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div>
          <label className="text-sm font-medium text-gray-500">Current Balance</label>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{balance.toLocaleString()}</span>
            <span className="text-lg text-gray-600">PIONEXT</span>
          </div>
        </div>

        {/* Purchase Interface */}
        <div className="space-y-4">
          <h3 className="font-semibold">Purchase Credits</h3>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Amount of credits"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              className="flex-1"
            />
            <Button 
              onClick={handlePurchase}
              disabled={!amount || Number(amount) <= 0}
            >
              Purchase
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: This is currently a mock purchase. Real purchases will be enabled with Stripe integration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 