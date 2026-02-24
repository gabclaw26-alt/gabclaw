---
name: finportolio-portfolio-manager
description: Manage the FinPortolio investment portfolio — record new transactions (buy/sell), update quantities in portfolio.json and transactions.json, add new holdings, and refresh market prices by running update_prices.py. Use when the user says things like "I bought X shares of Y", "I sold Z shares", "add a new position", "update my prices", "record a transaction", or any request to modify portfolio holdings or refresh current_prices.json.
---

# FinPortolio Portfolio Manager

Working files live at `~/vault/projects/Fin/`:
- `portfolio.json` — current holdings and quantities
- `transactions.json` — full transaction history
- `current_prices.json` — latest fetched prices (written by the price script)

The skill `assets/` folder is a portable backup copy. **Always read and write the live files at `~/vault/projects/Fin/`**, not the skill assets.

---

## Workflow: Recording a Transaction

When the user reports a buy or sell:

1. Read `~/vault/projects/Fin/transactions.json` and `~/vault/projects/Fin/portfolio.json`
2. Add a transaction entry under the correct category in `transactions.json`
3. Update `current_quantity` for that asset in `transactions.json`
4. Update `quantity` for the same asset in `portfolio.json`
5. If the asset is **new**, also create a holding entry in `portfolio.json` — ask for missing metadata (`sector`, `country`, `type`, `localCurrency`, `techExposed`) if not provided
6. Confirm the changes to the user

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
| `emergency_fund` | Cash, money market funds |

### Transaction entry format

```json
{"date": "YYYY-MM-DD", "type": "buy", "quantity": 10, "gross_amount": 1800.00, "net_amount": null, "currency": "USD"}
```

**Rules:**
- `quantity` is **negative** for sells; `gross_amount` is always **positive**
- `net_amount` is optional — only include when the user provides it
- After a sell that zeroes out a position, keep the holding in `portfolio.json` with `quantity: 0`

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

Set `techExposed: true` when sector is Technology, Semiconductors, Semi Equip, BTC proxy, or Crypto.

---

## Workflow: Updating Prices

```bash
bash ~/vault/skills/portfolio-prices/run.sh
```

This overwrites `~/vault/projects/Fin/current_prices.json` with fresh data from yfinance and the Tesouro Direto API. Brazilian stocks get `.SA` suffix automatically; crypto maps to `BTC-USD` format.

---

## Reference

For full JSON field definitions and special cases (Tesouro bonds, FIIs, crypto), read `references/schemas.md`.
