#!/usr/bin/env python3
"""
Script to fetch current prices for portfolio holdings and save to JSON.
Prices for Brazilian assets are fetched in BRL, and all prices include USD equivalents.
"""

import json
import requests
import yfinance as yf
from datetime import datetime
from typing import Dict, Optional
import os

PORTFOLIO_PATH = os.path.expanduser("~/vault/projects/Fin/portfolio.json")
OUTPUT_PATH = os.path.expanduser("~/vault/projects/Fin/current_prices.json")


def get_usd_brl_rate() -> float:
    """Fetch the current USD/BRL exchange rate."""
    try:
        ticker = yf.Ticker("BRL=X")
        data = ticker.history(period="1d")
        if not data.empty:
            return float(data['Close'].iloc[-1])
        else:
            ticker = yf.Ticker("USDBRL=X")
            data = ticker.history(period="1d")
            if not data.empty:
                return float(data['Close'].iloc[-1])
            else:
                raise ValueError("Unable to fetch BRL exchange rate")
    except Exception as e:
        print(f"Error fetching USD/BRL rate: {e}")
        raise


def get_tesouro_prices() -> Dict[str, float]:
    """
    Fetch Tesouro Direto prices from Gabriel Gaspar's free API.
    """
    try:
        url = "https://tesouro.gabrielgaspar.com.br/bonds"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        name_mapping = {
            "Tesouro IPCA+ 2026": ["IPCA+", "2026"],
            "Tesouro IPCA+ 2045": ["IPCA+", "2045"],
            "Tesouro IPCA+ 2050": ["IPCA+", "2050"],
            "Tesouro IPCA+ c/ Juros 2030": ["IPCA+", "Juros", "2030"],
            "Tesouro Educa+ 2035": ["Educa+", "2035"],
        }

        prices = {}
        bonds = data.get('bonds', data) if isinstance(data, dict) else data

        for bond in bonds:
            bond_name = bond.get('name', '') or bond.get('bond_name', '')
            bond_price = (
                bond.get('unitary_redemption_value') or
                bond.get('price') or
                bond.get('pu') or
                bond.get('unit_price')
            )

            if bond_price is None:
                continue

            for portfolio_name, patterns in name_mapping.items():
                if "Juros" not in portfolio_name and "Semestrais" in bond_name:
                    continue
                if all(pattern in bond_name for pattern in patterns):
                    prices[portfolio_name] = float(bond_price)
                    break

        return prices

    except requests.exceptions.RequestException as e:
        print(f"Warning: Could not fetch Tesouro prices from API: {e}")
        return {}
    except Exception as e:
        print(f"Warning: Error processing Tesouro prices: {e}")
        return {}


def get_crypto_price(ticker: str) -> Optional[float]:
    """Fetch cryptocurrency price in USD."""
    try:
        crypto_map = {
            "BTC": "BTC-USD",
            "ETH": "ETH-USD",
            "AVAX": "AVAX-USD"
        }
        symbol = crypto_map.get(ticker, f"{ticker}-USD")
        crypto = yf.Ticker(symbol)
        data = crypto.history(period="1d")
        if not data.empty:
            return float(data['Close'].iloc[-1])
        return None
    except Exception as e:
        print(f"Error fetching crypto price for {ticker}: {e}")
        return None


def get_stock_price(ticker: str, local_currency: str, asset_type: str) -> Optional[float]:
    """Fetch stock price in the specified currency."""
    try:
        if asset_type == "Fixed Income" and local_currency == "BRL" and "Tesouro" in ticker:
            return None
        symbol = f"{ticker}.SA" if local_currency == "BRL" else ticker
        stock = yf.Ticker(symbol)
        data = stock.history(period="1d")
        if not data.empty:
            return float(data['Close'].iloc[-1])
        return None
    except Exception as e:
        print(f"Error fetching stock price for {ticker}: {e}")
        return None


def fetch_all_prices(portfolio_path: str = PORTFOLIO_PATH) -> Dict:
    """Fetch current prices for all holdings in the portfolio."""
    with open(portfolio_path, 'r') as f:
        portfolio = json.load(f)

    print("Fetching USD/BRL exchange rate...")
    usd_brl_rate = get_usd_brl_rate()
    print(f"USD/BRL rate: {usd_brl_rate:.4f}")

    print("\nFetching Tesouro Direto prices...")
    tesouro_prices = get_tesouro_prices()
    if tesouro_prices:
        print(f"  Retrieved prices for {len(tesouro_prices)} Tesouro bonds")
    else:
        print("  No Tesouro prices available (using costBasis fallback)")

    prices = {
        "timestamp": datetime.now().isoformat(),
        "usd_brl_rate": usd_brl_rate,
        "holdings": []
    }

    for holding in portfolio['holdings']:
        asset = holding['asset']
        ticker = holding['ticker']
        local_currency = holding['localCurrency']
        asset_type = holding['type']

        print(f"\nFetching {asset} ({ticker})...")

        price_local = None
        price_usd = None

        if asset_type == "Crypto":
            price_usd = get_crypto_price(ticker)
            price_local = price_usd * usd_brl_rate if (price_usd and local_currency == "BRL") else price_usd

        elif asset_type == "Fixed Income" and "Tesouro" in str(ticker):
            if ticker in tesouro_prices:
                price_local = tesouro_prices[ticker]
                price_usd = price_local / usd_brl_rate
            else:
                cost_basis = holding.get('costBasis')
                if cost_basis and holding['quantity'] > 0:
                    price_local = cost_basis / holding['quantity']
                    price_usd = price_local / usd_brl_rate

        else:
            if ticker:
                price_local = get_stock_price(ticker, local_currency, asset_type)
                if price_local:
                    price_usd = price_local / usd_brl_rate if local_currency == "BRL" else price_local

        price_entry = {
            "asset": asset,
            "ticker": ticker,
            "type": asset_type,
            "local_currency": local_currency,
            "price_local": round(price_local, 4) if price_local else None,
            "price_usd": round(price_usd, 4) if price_usd else None,
            "quantity": holding['quantity'],
            "value_local": round(price_local * holding['quantity'], 2) if price_local else None,
            "value_usd": round(price_usd * holding['quantity'], 2) if price_usd else None
        }

        prices['holdings'].append(price_entry)

        if price_local:
            source = ""
            if asset_type == "Fixed Income" and "Tesouro" in str(ticker):
                source = f" [{'API' if ticker in tesouro_prices else 'costBasis'}]"
            print(f"  {price_local:.2f} {local_currency} (${price_usd:.2f} USD){source}")
        else:
            print(f"  Unable to fetch price")

    return prices


def main():
    print("=" * 60)
    print("Portfolio Price Update")
    print("=" * 60)

    try:
        prices = fetch_all_prices()

        with open(OUTPUT_PATH, 'w') as f:
            json.dump(prices, f, indent=2)

        print("\n" + "=" * 60)
        print(f"Prices saved to {OUTPUT_PATH}")

        total_usd = sum(h['value_usd'] for h in prices['holdings'] if h['value_usd'])
        fetched = sum(1 for h in prices['holdings'] if h['value_usd'])
        print(f"Assets priced: {fetched}/{len(prices['holdings'])}")
        print(f"Total portfolio value: ${total_usd:,.2f} USD")
        print(f"USD/BRL rate: {prices['usd_brl_rate']:.4f}")
        print("=" * 60)

    except Exception as e:
        print(f"\nError: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
