#!/bin/bash
# Portfolio update - runs 3x daily

source ~/vault/skills/portfolio-prices/.venv/bin/activate

# Update prices
cd ~/vault/skills/portfolio-prices
python fetch_prices.py > /dev/null 2>&1

# Get prices
cd ~/vault/projects/fin

python3 << 'ENDPYTHON'
import json
import subprocess
import os

# Load current prices
with open('current_prices.json') as f:
    data = json.load(f)

# Previous prices (if exists)
prev_file = '/tmp/prev_prices.json'
prev_data = {}
if os.path.exists(prev_file):
    with open(prev_file) as f:
        prev_data = {h['ticker']: h['price_local'] for h in json.load(f)['holdings']}

total = sum(h['value_usd'] for h in data['holdings'])
usd_brl = data['usd_brl_rate']

# Category breakdown
cats = {}
for h in data['holdings']:
    t = h['ticker']
    val = h['value_usd']
    if h['type'] == 'Crypto': cat = 'Crypto'
    elif h['type'] == 'Gold': cat = 'Gold'
    elif t in ['BIL', 'TFLO']: cat = 'Cash/T-Bills'
    elif 'Tesouro' in h['asset']: cat = 'Tesouro'
    elif h['type'] == 'FII': cat = 'FIIs'
    elif h['type'] == 'REITS': cat = 'US REITs'
    elif h['local_currency'] == 'USD': cat = 'US Stocks'
    else: cat = 'BR Stocks'
    cats[cat] = cats.get(cat, 0) + val

# Format categories
cat_lines = []
for cat, val in sorted(cats.items(), key=lambda x: -x[1]):
    pct = int(val/total*100)
    cat_lines.append(f"| {cat:<18} | ${val:>8,.0f} | {pct:>2}% |")

# Find movers (top 3 by % change)
movers = []
for h in data['holdings']:
    t = h['ticker']
    curr = h['price_local']
    if t in prev_data:
        prev = prev_data[t]
        if prev > 0:
            pct = (curr - prev) / prev * 100
            if abs(pct) > 0.3:  # Only show >0.3% moves
                movers.append((t, prev, curr, pct, h['local_currency']))

movers.sort(key=lambda x: abs(x[3]), reverse=True)
movers = movers[:5]

mover_lines = []
for t, prev, curr, pct, currency in movers[:3]:
    if currency == 'BRL':
        mover_lines.append(f"• {t}: R${prev:.2f} → R${curr:.2f} ({pct:+.1f}%)")
    else:
        mover_lines.append(f"• {t}: ${prev:,.0f} → ${curr:,.0f} ({pct:+.1f}%)")

# Build message
message = "Prices Updated ✓\n\n"
message += f"Total: ${total:,.0f} USD (USD/BRL: {usd_brl:.2f})\n\n"
message += "| Category         | Value     | %  |\n"
message += "| --------------- | --------- | -- |\n"
for line in cat_lines:
    message += line + "\n"
    
if mover_lines:
    message += "\nMovers since last update:\n\n"
    for line in mover_lines:
        message += line + "\n"

# Save current as previous
with open(prev_file, 'w') as f:
    json.dump(data, f)

# Send to Telegram
cmd = ["curl", "-s", "-X", "POST", 
       "https://api.telegram.org/bot8724639176:AAFOCECxZEgblZCNhMDdHzq154g4ljPNK1o/sendMessage",
       "-d", "chat_id=-5123666717", "-d", "text=" + message]
subprocess.run(cmd)
ENDPYTHON
