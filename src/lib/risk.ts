export type PortfolioPoint = { date: string; value: number; benchmarkValue?: number };

export function parsePortfolioHistory(csv: string): PortfolioPoint[] {
  const lines = csv.replace(/^\uFEFF/, "").trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 4) throw new Error("Include a header and at least three daily observations.");
  const headers = lines[0].split(",").map((cell) => cell.trim().replace(/^"|"$/g, "").toLowerCase());
  const dateIndex = headers.indexOf("date");
  const valueIndex = headers.indexOf("portfolio_value");
  const benchmarkIndex = headers.indexOf("benchmark_value");
  if (dateIndex < 0 || valueIndex < 0 || headers.length !== (benchmarkIndex < 0 ? 2 : 3)) {
    throw new Error("CSV needs date,portfolio_value columns and an optional benchmark_value column.");
  }
  const points = lines.slice(1).map((line, index) => {
    const cells = line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));
    const date = cells[dateIndex];
    const parsedDate = new Date(`${date}T00:00:00Z`);
    const value = Number(cells[valueIndex]?.replace(/[$\s]/g, ""));
    const benchmarkValue = benchmarkIndex < 0 ? undefined : Number(cells[benchmarkIndex]?.replace(/[$\s]/g, ""));
    if (cells.length !== headers.length || !/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || value <= 0 || !Number.isFinite(value) || (benchmarkIndex >= 0 && (!Number.isFinite(benchmarkValue) || benchmarkValue! <= 0))) {
      throw new Error(`Invalid date or value on CSV row ${index + 2}.`);
    }
    return { date, value, ...(benchmarkValue === undefined ? {} : { benchmarkValue }) };
  }).sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(points.map((point) => point.date)).size !== points.length) throw new Error("CSV contains duplicate dates.");
  return points;
}

export function isPortfolioHistory(value: unknown): value is PortfolioPoint[] {
  return Array.isArray(value) && value.every((point) => {
    if (!point || typeof point.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(point.date) || !Number.isFinite(point.value) || point.value <= 0 || (point.benchmarkValue !== undefined && (!Number.isFinite(point.benchmarkValue) || point.benchmarkValue <= 0))) return false;
    const date = new Date(`${point.date}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === point.date;
  });
}

export function calculateRisk(points: PortfolioPoint[]) {
  const returns = points.slice(1).map((point, index) => point.value / points[index].value - 1);
  if (returns.length < 2) return null;
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const dailyVariance = returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (returns.length - 1);
  const dailyVolatility = Math.sqrt(dailyVariance);
  const sorted = [...returns].sort((a, b) => a - b);
  const tailIndex = Math.max(0, Math.ceil(sorted.length * 0.05) - 1);
  const tail = sorted.slice(0, tailIndex + 1);
  let peak = points[0].value;
  let maxDrawdown = 0;
  for (const point of points) {
    peak = Math.max(peak, point.value);
    maxDrawdown = Math.min(maxDrawdown, point.value / peak - 1);
  }
  const benchmarkReturns = points.slice(1).map((point, index) => point.benchmarkValue === undefined || points[index].benchmarkValue === undefined ? null : point.benchmarkValue / points[index].benchmarkValue - 1);
  const paired = returns.flatMap((value, index) => benchmarkReturns[index] === null ? [] : [[value, benchmarkReturns[index]!] as const]);
  const beta = paired.length > 1 ? (() => {
    const portfolioMean = paired.reduce((sum, [value]) => sum + value, 0) / paired.length;
    const benchmarkMean = paired.reduce((sum, [, value]) => sum + value, 0) / paired.length;
    const covariance = paired.reduce((sum, [portfolio, benchmark]) => sum + (portfolio - portfolioMean) * (benchmark - benchmarkMean), 0);
    const benchmarkVariance = paired.reduce((sum, [, benchmark]) => sum + (benchmark - benchmarkMean) ** 2, 0);
    return benchmarkVariance ? covariance / benchmarkVariance : null;
  })() : null;
  return {
    observations: returns.length,
    portfolioReturn: points.at(-1)!.value / points[0].value - 1,
    benchmarkReturn: points.every((point) => point.benchmarkValue !== undefined) ? points.at(-1)!.benchmarkValue! / points[0].benchmarkValue! - 1 : null,
    annualizedVolatility: dailyVolatility * Math.sqrt(252),
    historicalVaR95: -sorted[tailIndex],
    historicalCVar95: -tail.reduce((sum, value) => sum + value, 0) / tail.length,
    maxDrawdown,
    sharpe: dailyVolatility ? mean / dailyVolatility * Math.sqrt(252) : 0,
    beta,
  };
}
