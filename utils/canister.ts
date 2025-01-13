import axios from 'axios';

const canisterClient = axios.create({
    baseURL: `http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943`
})

export async function executeTradeOnCanister(tradeRequest: {
  id: string,
  userId: string;
  creditId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number,
  timestamp: string
}) {
  try {
    const response = await canisterClient.post('/transactions', tradeRequest);
    return response.data;
  } catch (error) {
    console.error('Trade execution error:', error);
  }
}
