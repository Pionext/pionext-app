import axios from "axios";

const canisterClient = axios.create({
  baseURL: `${process.env.CANISTER_API_URL}`,
});

type Material = {
  title: string;
  url: string;
  type: "PDF" | "Video" | "Other";
};

type Project = {
  id: string;
  name: string;
  description: string;
  launchDate: string;
  status: "Active" | "Inactive" | "Upcoming";
  userId: string;
  targetRaise: number;
  materials: Material[];
};

type Transactions = {
  id: string;
  userId: string;
  creditId: string;
  type: "buy" | "sell" | "purchase";
  amount: number;
  price: number;
  timestamp: string;
};

export type PionextTransaction = {
  id: string;
  userId: string;
  type: "buy" | "sell" | "purchase";
  amount: number;
  timestamp: string;
};

type Credit = {
  id: string;
  projectId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  currentSupply: number;
  maxSupply: number;
};

export async function executecreditsTransaction(tradeRequest: Transactions) {
  try {
    const response = await canisterClient.post(
      "/transactions/credits",
      tradeRequest
    );
    return response.data;
  } catch (error) {
    console.error("Trade execution error:", error);
  }
}

export async function executePionextTransaction(
  tradeRequest: PionextTransaction
) {
  try {
    const response = await canisterClient.post(
      "/transactions/pionext",
      tradeRequest
    );
    return response.data;
  } catch (error) {
    console.error("Pionext transaction execution error:", error);
  }
}

export async function updateUserPionextPionextBalance(user: {
  userId: string;
  balance: number;
}) {
  try {
    const response = await canisterClient.put("/transactions/pionext/balance", {
      userId: user.userId,
      balance: user.balance,
    });

    return response.data;
  } catch (error) {
    console.error("Pionext transaction execution error:", error);
  }
}

export async function createProject(project: Project, credits: Credit) {
  try {
    const response = await canisterClient.post("/projects", {
      project,
      credits,
    });
    return response.data;
  } catch (error) {
    console.error("Create project:", error);
  }
}
