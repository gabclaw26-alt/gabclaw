---
name: finportfolio-portfolio-manager
description: Manage the FinPortolio investment portfolio — record new transactions (buy/sell), update quantities in portfolio.json and transactions.json, add new holdings, and refresh market prices by running fetch_prices.py. Use when the user says things like "I bought X shares of Y", "I sold Z shares", "add a new position", "update my prices", "record a transaction", or any request to modify portfolio holdings or refresh current_prices.json.
---

# FinPortolio Portfolio Manager

Working files live at `~/vault/projects/Fin/`:
- `portfolio.json` — current holdings and quantities
- `current_prices.json` — latest fetched prices (written by fetch_prices.py)

Price update script lives at:
- `~/vault/skills/portfolio-prices/fetch_prices.py`

---

## Workflow: Recording a Transaction

When the user reports a buy or sell:

1. Read `~/vault/projects/Fin/portfolio.json`
2. Update `quantity` for the asset (add for buy, subtract for sell)
3. If the asset is **new**, create a holding entry — ask for missing metadata (`sector`, `country`, `type`, `localCurrency`, `techExposed`) if not provided
4. Confirm the changes to the user
5. Optionally run a price update after recording

### Transaction category mapping

| Category | Examples |
|---|---|
| `acoes_brazil` | WEGE3, ITUB3, VALE3, FLRY3, BBDC3 (BRL) |
| `us_stocks` | AAPL, MSFT, GOOGL, AMZN (USD) |
| `us_reits` | O, PLD (USD) |
| `fiis_brazil` | HGLG11, XPML11, VRTA11 (BRL) |
| `crypto` | BTC, ETH, AVAX (USD) |
| `tesouro` | Tesouro IPCA+ bonds (BRL) |
| `international_stocks` | ASML, TSM, UBS, DBSDY (USD) |
| `fixed_income_us` | BIL, TFLO (USD) |
| `gold` | IAU (USD) |

### Transaction entry format

```json
{"date": "YYYY-MM-DD", "type": "buy", "quantity": 10, "gross_amount": 1800.00, "net_amount": null, "currency": "USD"}
```

**Rules:**
- `quantity` is **negative** for sells; `gross_amount` is always **positive**
- `net_amount` is optional — only include when the user provides it
- After a sell that zeroes a position, keep the holding in `portfolio.json` with `quantity: 0`

### New holding entry format (portfolio.json)

```json
{
  "asset": "Display Name",
  "ticker": "TICK",
  "quantity": 10,
  "localCurrency": "USD",
  "sector": "Technology",
  "country": "US",
  "type": "Stocks",
  "techExposed": false
}
```

Valid `type` values: `Stocks`, `Crypto`, `Fixed Income`, `FII`, `REITS`, `Gold`

Set `techExposed: true` for: Technology, Semiconductors, Semi Equip, BTC proxy, Crypto.

---

## Workflow: Updating Prices

```bash
bash ~/vault/skills/portfolio-prices/run.sh
```

This overwrites `~/vault/projects/Fin/current_prices.json` with fresh data from yfinance and the Tesouro Direto API.

---

## Workflow: Portfolio Summary

After fetching prices, summarize by reading `current_prices.json`:

```python
import json
with open("~/vault/projects/Fin/current_prices.json") as f:
    data = json.load(f)
total = sum(h['value_usd'] for h in data['holdings'] if h['value_usd'])
print(f"Total: ${total:,.2f} USD @ {data['usd_brl_rate']} BRL/USD")
```

Group by `type` field for allocation breakdown.
