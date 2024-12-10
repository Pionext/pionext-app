import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface PurchaseRequest {
  userId: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    const body: PurchaseRequest = await request.json();
    const { userId, amount } = body;

    const creditsPath = path.join(process.cwd(), 'data', 'pionext_credits.json');
    const creditsContent = await fs.readFile(creditsPath, 'utf-8');
    const creditsData = JSON.parse(creditsContent);

    // Find or create user balance
    let userBalance = creditsData.balances.find((b: any) => b.userId === userId);
    if (!userBalance) {
      userBalance = {
        userId,
        balance: 0,
        lastUpdated: new Date().toISOString()
      };
      creditsData.balances.push(userBalance);
    }

    // Update balance
    userBalance.balance += amount;
    userBalance.lastUpdated = new Date().toISOString();

    // Add transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: "purchase" as const,
      amount,
      timestamp: new Date().toISOString()
    };
    creditsData.transactions.push(transaction);

    // Save changes
    await fs.writeFile(creditsPath, JSON.stringify(creditsData, null, 2));

    return NextResponse.json({
      balance: userBalance.balance,
      transaction
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
} 