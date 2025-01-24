import {
  executePionextTransaction,
  updateUserPionextPionextBalance,
} from "@/utils/canister";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

interface PurchaseRequest {
  userId: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    const body: PurchaseRequest = await request.json();
    const { userId, amount } = body;

    const balancesPath = path.join(
      process.cwd(),
      "data",
      "pionext_balances.json"
    );
    const transactionsPath = path.join(
      process.cwd(),
      "data",
      "pionext_transactions.json"
    );

    // Read both files
    const [balancesContent, transactionsContent] = await Promise.all([
      fs.readFile(balancesPath, "utf-8"),
      fs.readFile(transactionsPath, "utf-8"),
    ]);

    const balancesData = JSON.parse(balancesContent);
    const transactionsData = JSON.parse(transactionsContent);

    // Find or create user balance
    let userBalance = balancesData.balances.find(
      (b: any) => b.userId === userId
    );
    if (!userBalance) {
      userBalance = {
        userId,
        balance: 0,
        lastUpdated: new Date().toISOString(),
      };
      balancesData.balances.push(userBalance);
    }

    // Update balance
    userBalance.balance += amount;
    userBalance.lastUpdated = new Date().toISOString();

    console.log(userBalance.userId)
    console.log(userBalance.balance)
    await updateUserPionextPionextBalance({
      userId: userBalance.userId,
      balance: userBalance.balance,
    });

    // Create transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      userId,
      type: "purchase" as const,
      amount,
      timestamp: new Date().toISOString(),
    };
    transactionsData.transactions.push(transaction);
    await executePionextTransaction(transaction);

    // Save both files
    await Promise.all([
      fs.writeFile(balancesPath, JSON.stringify(balancesData, null, 2)),
      fs.writeFile(transactionsPath, JSON.stringify(transactionsData, null, 2)),
    ]);

    return NextResponse.json({
      balance: userBalance.balance,
      transaction,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
