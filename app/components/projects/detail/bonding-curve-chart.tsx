"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { getBondingCurvePoints, calculatePrice } from "@/utils/bonding-curve";

const chartConfig = {
  price: {
    label: "Price",
    theme: {
      light: "#E8F4FF",
      dark: "#0000FF"
    }
  },
} satisfies ChartConfig;

interface BondingCurveChartProps {
  credit: {
    symbol: string;
    name: string;
    currentSupply: number;
    maxSupply: number;
  }
}

export function BondingCurveChart({ credit }: BondingCurveChartProps) {
  const curvePoints = getBondingCurvePoints({
    maxSupply: credit.maxSupply,
    currentSupply: credit.currentSupply
  });

  const currentPrice = calculatePrice(credit.currentSupply, {
    maxSupply: credit.maxSupply,
    currentSupply: credit.currentSupply
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{credit.name} Bonding Curve</CardTitle>
        <CardDescription>
          {credit.symbol} token price based on supply
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={curvePoints}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="supply"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => Math.round(value).toLocaleString()}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Supply
                        </span>
                        <span className="font-bold">
                          {Math.round(data.supply).toLocaleString()} {credit.symbol}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Price
                        </span>
                        <span className="font-bold">
                          ${data.price.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="price"
              type="monotone"
              fill="#E8F4FF"
              fillOpacity={0.6}
              stroke="#0000FF"
              strokeWidth={2}
            />
            <ReferenceLine
              x={credit.currentSupply}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{
                value: `Current: ${credit.currentSupply.toLocaleString()}`,
                position: 'top',
                fill: 'hsl(var(--primary))',
                fontSize: 12
              }}
            />
            <ReferenceLine
              y={currentPrice}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{
                value: `$${currentPrice.toFixed(4)}`,
                position: 'right',
                fill: 'hsl(var(--primary))',
                fontSize: 12
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 