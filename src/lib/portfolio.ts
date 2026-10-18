export type Holding = {
  ticker: string; name: string; sector: string; region: string; country: string;
  shares: number; price: number; average: number; daily: number; dividend: number;
};
export type Transaction = { id: string; date: string; type: "Buy" | "Sell"; ticker: string; name: string; shares: number; price: number; fees: number };
export const sampleHoldings: Holding[] = [
  { ticker:"VTI", name:"Vanguard Total Stock Market ETF", sector:"ETF", region:"North America", country:"United States", shares:18, price:291.42, average:248.5, daily:.8, dividend:3.8 },
  { ticker:"MSFT", name:"Microsoft Corporation", sector:"Technology", region:"North America", country:"United States", shares:8, price:513.18, average:424.2, daily:1.2, dividend:3.32 },
  { ticker:"AAPL", name:"Apple Inc.", sector:"Technology", region:"North America", country:"United States", shares:11, price:247.65, average:209.4, daily:-.4, dividend:1.04 },
  { ticker:"ASML", name:"ASML Holding N.V.", sector:"Technology", region:"Europe", country:"Netherlands", shares:2, price:1012.4, average:746.3, daily:.6, dividend:6.7 },
  { ticker:"NVO", name:"Novo Nordisk A/S", sector:"Healthcare", region:"Europe", country:"Denmark", shares:14, price:68.42, average:96.8, daily:-1.1, dividend:1.55 },
  { ticker:"JNJ", name:"Johnson & Johnson", sector:"Healthcare", region:"North America", country:"United States", shares:12, price:176.33, average:151.8, daily:.5, dividend:4.96 },
  { ticker:"V", name:"Visa Inc.", sector:"Financials", region:"North America", country:"United States", shares:5, price:361.8, average:302.25, daily:.3, dividend:2.36 },
  { ticker:"SHEL", name:"Shell plc", sector:"Energy", region:"Europe", country:"United Kingdom", shares:24, price:34.16, average:28.7, daily:.9, dividend:1.42 },
  { ticker:"NESN", name:"Nestlé S.A.", sector:"Consumer Staples", region:"Europe", country:"Switzerland", shares:20, price:88.3, average:91.45, daily:-.2, dividend:3.1 },
  { ticker:"TSM", name:"Taiwan Semiconductor", sector:"Technology", region:"Asia", country:"Taiwan", shares:5, price:203.7, average:158.2, daily:1.8, dividend:2.4 },
  { ticker:"COST", name:"Costco Wholesale", sector:"Consumer Staples", region:"North America", country:"United States", shares:2, price:951.4, average:804.6, daily:.1, dividend:5.2 },
  { ticker:"VWCE", name:"Vanguard FTSE All-World ETF", sector:"ETF", region:"Global", country:"Germany", shares:12, price:142.36, average:128.8, daily:.4, dividend:2.2 },
];
export const sampleTransactions: Transaction[] = [
  {id:"1",date:"2026-10-11",type:"Buy",ticker:"VTI",name:"Vanguard Total Stock Market ETF",shares:2,price:285.1,fees:1},
  {id:"2",date:"2026-09-14",type:"Buy",ticker:"MSFT",name:"Microsoft Corporation",shares:2,price:489.25,fees:1},
  {id:"3",date:"2026-08-22",type:"Sell",ticker:"AAPL",name:"Apple Inc.",shares:1,price:239.4,fees:1},
];
export const valueOf = (h: Holding) => h.shares * h.price;
export const basisOf = (h: Holding) => h.shares * h.average;
export const totalValue = (items: Holding[]) => items.reduce((sum,h)=>sum+valueOf(h),0);
export const totalBasis = (items: Holding[]) => items.reduce((sum,h)=>sum+basisOf(h),0);
export const money = (n:number,currency="USD") => { const rate:Record<string,number>={USD:1,EUR:.92,CHF:.88,GBP:.79}; return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(n*(rate[currency]||1)); };
