# Neptune

A local-first portfolio dashboard with holdings, allocation, transaction tracking, and historical risk analytics. Prices and portfolio examples are illustrative; the app has no brokerage or live market-data connection.

## Run locally

```sh
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Historical risk analytics

In **Analytics**, download the CSV template and upload daily portfolio values. The file must contain at least three dated rows:

```csv
date,portfolio_value,benchmark_value
2025-01-01,100,100
2025-01-02,101,100.5
2025-01-03,99,99.8
```

`benchmark_value` is optional. Include it to see benchmark return and estimated beta. The dashboard also calculates annualized volatility, historical 95% VaR and CVaR, maximum drawdown, a Sharpe ratio assuming a 0% cash rate, and current holding concentration. Metrics use daily observations and a 252-day annualization convention; short histories are flagged.

Imported data stays in the browser’s local storage and is included in a JSON backup.

## Verify

```sh
pnpm test:e2e
pnpm build
```
