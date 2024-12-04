export interface BondingCurveParams {
  currentSupply: number;
  maxSupply: number;
}

export interface PurchaseResult {
  cost: number;
  averagePrice: number;
  newPrice: number;
  priceImpact: number;
  newSupply: number;
}

export interface SaleResult {
  proceeds: number;
  averagePrice: number;
  newPrice: number;
  priceImpact: number;
  newSupply: number;
}

// Quadratic curve: P = (S/maxSupply)^2
// This ensures P = 1 when S = maxSupply
export function calculatePrice(supply: number, params: BondingCurveParams) {
  return Math.pow(supply / params.maxSupply, 2);
}

export function calculateCost(fromSupply: number, toSupply: number, params: BondingCurveParams) {
  // Quadratic curve cost: integral of P = (S/maxSupply)^2
  const normalizedTo = Math.pow(toSupply / params.maxSupply, 3) / 3;
  const normalizedFrom = Math.pow(fromSupply / params.maxSupply, 3) / 3;
  return (normalizedTo - normalizedFrom) * params.maxSupply;
}

export function getBondingCurvePoints(params: BondingCurveParams, numPoints = 50) {
  if (!params.maxSupply || params.maxSupply <= 0) {
    return [];
  }

  const points: Array<{ supply: number; price: number }> = [];
  const step = Math.max(params.maxSupply / numPoints, 1);

  for (let supply = 0; supply <= params.maxSupply; supply += step) {
    points.push({
      supply,
      price: calculatePrice(supply, params)
    });
  }

  // Always include the max supply point
  if (points[points.length - 1]?.supply !== params.maxSupply) {
    points.push({
      supply: params.maxSupply,
      price: 1  // Will always be 1 at maxSupply
    });
  }

  return points;
}

export function simulatePurchase(amount: number, params: BondingCurveParams): PurchaseResult | null {
  const newSupply = params.currentSupply + amount;
  if (newSupply > params.maxSupply) {
    return null;
  }

  const cost = calculateCost(params.currentSupply, newSupply, params);
  const averagePrice = cost / amount;
  const newPrice = calculatePrice(newSupply, params);
  const priceImpact = newPrice - calculatePrice(params.currentSupply, params);

  return {
    cost,
    averagePrice,
    newPrice,
    priceImpact,
    newSupply
  };
}

export function simulateSale(amount: number, params: BondingCurveParams): SaleResult | null {
  const newSupply = params.currentSupply - amount;
  if (newSupply < 0) {
    return null;
  }

  const proceeds = calculateCost(newSupply, params.currentSupply, params);
  const averagePrice = proceeds / amount;
  const newPrice = calculatePrice(newSupply, params);
  const priceImpact = calculatePrice(params.currentSupply, params) - newPrice;

  return {
    proceeds,
    averagePrice,
    newPrice,
    priceImpact,
    newSupply
  };
}

export function calculateTotalRaise(params: BondingCurveParams): number {
  // This calculates how much money would be raised if all tokens were sold
  // Uses the same integral as calculateCost but from 0 to maxSupply
  return calculateCost(0, params.maxSupply, params);
}

// For convenience, also add a function to calculate raise up to current supply
export function calculateCurrentRaise(params: BondingCurveParams): number {
  // This calculates how much money has been raised so far
  return calculateCost(0, params.currentSupply, params);
}