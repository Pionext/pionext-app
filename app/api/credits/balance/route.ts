import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const balancesPath = path.join(process.cwd(), 'data', 'pionext_balances.json');
    const transactionsPath = path.join(process.cwd(), 'data', 'pionext_transactions.json');
    
    const [balancesContent, transactionsContent] = await Promise.all([
      fs.readFile(balancesPath, 'utf-8'),
      fs.readFile(transactionsPath, 'utf-8')
    ]);

    const balancesData = JSON.parse(balancesContent);
    const transactionsData = JSON.parse(transactionsContent);

    const userBalance = balancesData.balances.find((b: any) => b.userId === userId);
    const userTransactions = transactionsData.transactions.filter((t: any) => t.userId === userId);

    return NextResponse.json({
      balance: userBalance?.balance || 0,
      transactions: userTransactions
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}