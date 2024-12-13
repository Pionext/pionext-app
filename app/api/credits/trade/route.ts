import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { simulatePurchase, simulateSale, PurchaseResult, SaleResult } from '@/utils/bonding-curve';

interface TradeRequest {
  userId: string;
  creditId: string;
  type: 'buy' | 'sell';
  amount: number;
}

export async function POST(request: Request) {
  try {
    const body: TradeRequest = await request.json();
    const { userId, creditId, type, amount } = body;

    // Read all necessary files
    const [creditsContent, holdingsContent, tradesContent, balancesContent] = await Promise.all([
      fs.readFile(path.join(process.cwd(), 'data', 'credits.json'), 'utf-8'),
      fs.readFile(path.join(process.cwd(), 'data', 'credit_balances.json'), 'utf-8'),
      fs.readFile(path.join(process.cwd(), 'data', 'credit_transactions.json'), 'utf-8'),
      fs.readFile(path.join(process.cwd(), 'data', 'pionext_balances.json'), 'utf-8')
    ]);

    const creditsData = JSON.parse(creditsContent);
    const holdingsData = JSON.parse(holdingsContent);
    const tradesData = JSON.parse(tradesContent);
    const balancesData = JSON.parse(balancesContent);

    // Get the credit being traded
    const credit = creditsData.credits.find((c: any) => c.id === creditId);
    if (!credit) {
      return NextResponse.json({ error: 'Credit not found' }, { status: 404 });
    }

    // Get user's PIONEXT balance and project credit holdings
    const pionextBalance = balancesData.balances.find((b: any) => b.userId === userId)?.balance || 0;
    let holding = holdingsData.holdings.find((h: any) => h.userId === userId && h.creditId === creditId);

    // Simulate the trade
    const simulation = type === 'buy' 
      ? simulatePurchase(amount, credit)
      : simulateSale(amount, credit);

    if (!simulation) {
      return NextResponse.json({ error: 'Invalid trade amount' }, { status: 400 });
    }

    // Check if user has enough balance
    if (type === 'buy') {
      const purchaseSimulation = simulation as PurchaseResult;
      if (pionextBalance < purchaseSimulation.cost) {
        return NextResponse.json({ error: 'Insufficient PIONEXT balance' }, { status: 400 });
      }
    } else {
      if (!holding || holding.balance < amount) {
        return NextResponse.json({ error: 'Insufficient credit balance' }, { status: 400 });
      }
    }

    // Update credit supply
    credit.currentSupply = type === 'buy' 
      ? credit.currentSupply + amount 
      : credit.currentSupply - amount;

    // Update user's PIONEXT balance
    const pionextBalanceRecord = balancesData.balances.find((b: any) => b.userId === userId);
    if (type === 'buy') {
      const purchaseSimulation = simulation as PurchaseResult;
      pionextBalanceRecord.balance -= purchaseSimulation.cost;
    } else {
      const saleSimulation = simulation as SaleResult;
      pionextBalanceRecord.balance += saleSimulation.proceeds;
    }
    pionextBalanceRecord.lastUpdated = new Date().toISOString();

    // Update or create user's credit holding
    if (!holding) {
      holding = {
        id: `hold_${Date.now()}`,
        creditId,
        userId,
        balance: 0,
        lastUpdated: new Date().toISOString()
      };
      holdingsData.holdings.push(holding);
    }
    holding.balance = type === 'buy' 
      ? holding.balance + amount 
      : holding.balance - amount;
    holding.lastUpdated = new Date().toISOString();

    // Record the trade
    const trade = {
      id: `trd_${Date.now()}`,
      creditId,
      userId,
      type,
      amount,
      price: simulation.averagePrice,
      timestamp: new Date().toISOString()
    };
    tradesData.trades.push(trade);

    // Save all changes
    await Promise.all([
      fs.writeFile(path.join(process.cwd(), 'data', 'credits.json'), JSON.stringify(creditsData, null, 2)),
      fs.writeFile(path.join(process.cwd(), 'data', 'credit_balances.json'), JSON.stringify(holdingsData, null, 2)),
      fs.writeFile(path.join(process.cwd(), 'data', 'credit_transactions.json'), JSON.stringify(tradesData, null, 2)),
      fs.writeFile(path.join(process.cwd(), 'data', 'pionext_balances.json'), JSON.stringify(balancesData, null, 2))
    ]);

    return NextResponse.json({
      trade,
      holding,
      pionextBalance: pionextBalanceRecord.balance,
      credit
    });
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { error: 'Failed to process trade' },
      { status: 500 }
    );
  }
} 