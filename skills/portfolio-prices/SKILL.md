---
name: portfolio-prices
description: Fetch live market prices for all portfolio holdings (stocks, crypto, FIIs, REITs, Tesouro Direto) and save results to ~/vault/projects/Fin/current_prices.json. Returns total portfolio value in USD and per-asset prices in local currency.
---

# Portfolio Price Fetcher

Fetches live prices for all 44 holdings in `~/vault/projects/Fin/portfolio.json` and writes results to `~/vault/projects/Fin/current_prices.json`.

## When to use
- User asks for portfolio value, prices, or a market update
- User asks "how is my portfolio doing?"
- User asks about a specific holding's current price
- Scheduled price updates (e.g. daily cron)

## How to run

```bash
cd ~/vault/skills/portfolio-prices
source .venv/bin/activate
python fetch_prices.py
```

Or use the runner script (handles venv automatically):

```bash
bash ~/vault/skills/portfolio-prices/run.sh
```

## Output
- File: `~/vault/projects/Fin/current_prices.json`
- Fields per holding: `price_local`, `price_usd`, `value_local`, `value_usd`
- Top-level: `timestamp`, `usd_brl_rate`, total value

## Asset coverage
| Source       | Assets                                      |
|-------------|---------------------------------------------|
| yfinance     | US stocks, ETFs, BRL stocks (.SA), crypto   |
| Tesouro API  | Tesouro IPCA+, Educa+ bonds                 |
| costBasis    | Fallback for Tesouro if API unavailable     |

## Setup (already done)
```bash
cd ~/vault/skills/portfolio-prices
uv venv
source .venv/bin/activate
uv add yfinance requests
```
