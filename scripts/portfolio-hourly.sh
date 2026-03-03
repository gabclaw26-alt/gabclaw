#!/bin/bash
# Portfolio hourly update - runs every hour

# Source the venv for Python
source ~/vault/skills/portfolio-prices/.venv/bin/activate

# Update prices
cd ~/vault/skills/portfolio-prices
python fetch_prices.py > /dev/null 2>&1

# Run python to get the message
cd ~/vault/projects/Fin
python3 << 'ENDPYTHON'
import json
import subprocess

with open('current_prices.json') as f:
    data = json.load(f)

total = sum(h['value_usd'] for h in data['holdings'])

btc = next((h['price_local'] for h in data['holdings'] if h['ticker']=='BTC'), 0)
eth = next((h['price_local'] for h in data['holdings'] if h['ticker']=='ETH'), 0)
avax = next((h['price_local'] for h in data['holdings'] if h['ticker']=='AVAX'), 0)

cats = {}
for h in data['holdings']:
    t = h['ticker']
    val = h['value_usd']
    if h['type'] == 'Crypto': cat = 'Crypto'
    elif h['type'] == 'Gold': cat = 'Gold'
    elif t in ['BIL', 'TFLO']: cat = 'Cash'
    elif 'Tesouro' in h['asset']: cat = 'Tesouro'
    elif h['type'] == 'FII': cat = 'FIIs'
    elif h['type'] == 'REITS': cat = 'US REITs'
    elif h['local_currency'] == 'USD': cat = 'US Stocks'
    else: cat = 'BR Stocks'
    cats[cat] = cats.get(cat, 0) + val

cat_str = ", ".join(["{}: ${} ({}%)".format(c, int(v), int(v/total*100)) for c,v in sorted(cats.items(), key=lambda x: -x[1])])

message = "Portfolio Update\n\nTotal: ${}\n\n{}\n\nCrypto: BTC ${} | ETH ${} | AVAX ${}".format(
    int(total), cat_str, int(btc), int(eth), int(avax))

# Send to Telegram
cmd = ["curl", "-s", "-X", "POST", "https://api.telegram.org/bot8724639176:AAFOCECxZEgblZCNhMDdHzq154g4ljPNK1o/sendMessage",
       "-d", "chat_id=-5123666717", "-d", "text=" + message]
subprocess.run(cmd)
ENDPYTHON
