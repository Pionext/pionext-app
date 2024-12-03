"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
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
  const [simulatedAmount, setSimulatedAmount] = useState(0);
  
  // Sample funding data
  const fundingGoal = 100000;
  const currentFunding = 45000;
  const dailyVolume = 2500;
  const daysLeft = 30;
  
  // Sample bonding curve data (simplified quadratic curve)
  const getBondingCurvePrice = (supply: number) => {
    return 0.5 + (supply * supply) / 1000000;
  };
  
  const bondingCurveData = Array.from({length: 20}, (_, i) => {
    const supply = i * 5000;
    return {
      supply,
      price: getBondingCurvePrice(supply)
    };
  });

  // Calculate current position on bonding curve
  const currentSupply = 45000; // Example value
  const currentPrice = getBondingCurvePrice(currentSupply);
  const simulatedPrice = getBondingCurvePrice(currentSupply + simulatedAmount);

  return (
    <div className="space-y-8">
      {/* Funding Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(currentFunding / fundingGoal) * 100} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Raised</p>
              <p className="text-xl font-bold">${currentFunding.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Goal</p>
              <p className="text-xl font-bold">${fundingGoal.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Daily Volume</p>
              <p className="text-lg">${dailyVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days Left</p>
              <p className="text-lg">{daysLeft} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Card */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Trading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Overview */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Credit Price</p>
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

          {/* Bonding Curve Visualization */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Bonding Curve</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bondingCurveData}>
                  <XAxis 
                    dataKey="supply" 
                    label={{ value: 'Supply', position: 'bottom' }} 
                  />
                  <YAxis 
                    label={{ value: 'Price (PIONEXT)', angle: -90, position: 'left' }} 
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    fill="#93c5fd" 
                  />
                  {/* Marker for current position */}
                  <Line
                    data={[{ supply: currentSupply, price: currentPrice }]}
                    type="monotone"
                    dataKey="price"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Impact Simulator */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Simulate Purchase Impact</h3>
            <Slider
              defaultValue={[0]}
              max={20000}
              step={1000}
              onValueChange={([value]) => setSimulatedAmount(value)}
            />
            <div className="flex justify-between text-sm">
              <span>Amount: {simulatedAmount} credits</span>
              <span>Estimated Price: ${simulatedPrice.toFixed(2)}</span>
            </div>
          </div>

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

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Amount</label>
                <span className="text-sm text-gray-500">Balance: 0 credits</span>
              </div>
              <Input
                type="number"
                placeholder="Enter amount of credits"
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
                  <span>Total {action === 'buy' ? 'Cost (PIONEXT)' : 'Receive (PIONEXT)'}</span>
                  <span>${estimatedPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button 
              className="w-full"
              size="lg"
              disabled={!amount || Number(amount) <= 0}
            >
              {action === 'buy' ? 'Buy Project Credits' : 'Sell Project Credits'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 