import axios from 'axios';

const canisterClient = axios.create({
    baseURL: `${process.env.CANISTER_API_URL}`
})


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
  id: string,
  userId: string;
  creditId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number,
  timestamp: string
}


type Credit = {
  id: string;
  projectId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  currentSupply: number;
  maxSupply: number;
};

export async function executeTrade(tradeRequest: Transactions) {
  try {
    const response = await canisterClient.post('/transactions', tradeRequest);
    return response.data;
  } catch (error) {
    console.error('Trade execution error:', error);
  }
}

export async function createProject(project: Project, credits: Credit) {
  try {
    const response = await canisterClient.post('/projects', { project, credits });
    return response.data;
  } catch (error) {
    console.error('Create project:', error);
  }
}
