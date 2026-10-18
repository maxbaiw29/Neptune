# Neptune feature map

This is a functional summary of the public TESI app demo and the matching Neptune workflows. Neptune uses original branding, interface copy, and illustrative sample data.

| Reference workflow | Neptune implementation |
| --- | --- |
| Dashboard: value, daily move, return, income, performance, allocation and recent activity | Overview metrics, illustrative chart, sector allocation, largest positions and recent transactions |
| Holdings: search, filters, sorting and exports | Search ticker/company, filter by sector, sort by value/return/name, export CSV |
| Analytics: return contributions and concentration | Contribution views, HHI, largest holding and top-three concentration, sector mix |
| Historical portfolio risk and benchmark context | CSV-powered annualized volatility, historical VaR/CVaR, max drawdown, zero-rate Sharpe ratio, total return and optional benchmark return/beta |
| Health score and exposure notes | Educational score based on position count, sector coverage and regions |
| Valuation scenarios | Cautious, middle and optimistic sample scenarios |
| Allocation by sector, country, region and asset class | Sector and regional allocation views |
| Dividend and earnings calendar | Month grid and sample event list |
| Dividend income schedule | Annualized income, yield and sample payout schedule |
| Transactions | Buy/sell entry, updated holdings, local transaction ledger |
| Watchlist | Add and remove ticker symbols |
| Settings and backup | Portfolio name, currency, JSON import/export, restore sample data |

## Data scope

- Prices and events are illustrative; there is no market-data connection or automatic refresh.
- Portfolio data is stored in this browser’s local storage. JSON backup supports manual restore.
- Historical risk data can be imported as `date,portfolio_value` with optional `benchmark_value`; observations are treated as daily returns and annualized with 252 trading days. Imported history stays local and is included in JSON backups.
- Risk statistics are descriptive estimates from the uploaded series, not forecasts. Short history is flagged; no live market-data service or brokerage link is used.
- No brokerage connection, cloud sync, tax calculation, account system, or investment recommendation is included.
