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

    const creditsPath = path.join(process.cwd(), 'data', 'pionext_credits.json');
    const creditsContent = await fs.readFile(creditsPath, 'utf-8');
    const creditsData = JSON.parse(creditsContent);

    const userBalance = creditsData.balances.find((b: any) => b.userId === userId);
    const userTransactions = creditsData.transactions.filter((t: any) => t.userId === userId);

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