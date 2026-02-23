#!/usr/bin/env bash
# Runner script — sets up venv if needed and executes fetch_prices.py
set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SKILL_DIR"

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
  echo "Setting up virtual environment..."
  uv venv
  source .venv/bin/activate
  uv add yfinance requests
else
  source .venv/bin/activate
fi

python fetch_prices.py
