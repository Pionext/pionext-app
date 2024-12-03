"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChangeEvent } from "react";

interface TradingSectionProps {
  projectId: string;
}

// Sample price data
const priceData = [
  { time: '00:00', price: 0.5 },
  { time: '04:00', price: 0.52 },
  { time: '08:00', price: 0.48 },
  { time: '12:00', price: 0.55 },
  { time: '16:00', price: 0.53 },
  { time: '20:00', price: 0.51 },
  { time: '24:00', price: 0.54 },
];

export function TradingSection({ projectId }: TradingSectionProps) {
  const [timeRange, setTimeRange] = useState('24h');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  
  // TODO: Calculate these based on bonding curve
  const priceImpact = amount ? Number(amount) * 0.01 : 0;
  const estimatedPrice = amount ? Number(amount) * 0.5 + priceImpact : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Overview */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-2xl font-bold">$0.50</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">24h Change</p>
            <p className="text-emerald-600">+8.00%</p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="h-[300px] w-full">
          <Tabs defaultValue="24h" onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
            <TabsContent value="24h" className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>

        {/* Trading Interface */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={action === 'buy' ? 'default' : 'outline'}
              onClick={() => setAction('buy')}
              className="flex-1"
            >
              Buy
            </Button>
            <Button 
              variant={action === 'sell' ? 'default' : 'outline'}
              onClick={() => setAction('sell')}
              className="flex-1"
            >
              Sell
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm">Amount</label>
              <span className="text-sm text-gray-500">Balance: 0 tokens</span>
            </div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            />
          </div>

          {amount && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Price Impact</span>
                <span>{priceImpact.toFixed(4)} (~{(priceImpact / estimatedPrice * 100).toFixed(2)}%)</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total {action === 'buy' ? 'Cost' : 'Receive'}</span>
                <span>${estimatedPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button 
            className="w-full"
            size="lg"
            disabled={!amount || Number(amount) <= 0}
          >
            {action === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 