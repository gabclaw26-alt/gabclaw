---
name: polymarket
description: |
  Polymarket CLI - CLI for browsing and trading prediction markets on Polymarket (polymarket.com)
  
  USE FOR:
  - Browsing prediction markets (elections, sports, crypto, etc.)
  - Checking market prices, order books, and volume
  - Viewing positions, trades, and account balances
  - Placing and canceling orders
  - Managing wallet and approvals
  
  WARNING: Early experimental software. Use at your own risk.
allowed-tools:
  - Bash(polymarket *)
  - Bash(curl *)
  - Bash(jq *)
---

# Polymarket CLI

Official CLI for Polymarket prediction markets. Browse markets, place orders, manage positions, and interact with onchain contracts.

## Installation

```bash
# Option 1: Homebrew (macOS/Linux)
brew tap Polymarket/polymarket-cli
brew install polymarket

# Option 2: Install script
curl -sSL https://raw.githubusercontent.com/Polymarket/polymarket-cli/main/install.sh | sh

# Option 3: Build from source (requires Rust)
git clone https://github.com/Polymarket/polymarket-cli
cd polymarket-cli
cargo install --path .
```

Verify installation:
```bash
polymarket --version
polymarket --help
```

## Wallet Setup

For trading, you need a wallet. Three ways to provide private key (checked in order):
1. CLI flag: `--private-key 0xabc...`
2. Environment variable: `POLYMARKET_PRIVATE_KEY=0xabc...`
3. Config file: `~/.config/polymarket/config.json`

```bash
# Create new wallet
polymarket wallet create

# Import existing key
polymarket wallet import 0xabc123...

# Check wallet info
polymarket wallet show
polymarket wallet address
```

Before trading, approve contracts:
```bash
polymarket approve set  # Needs MATIC for gas on Polygon
```

## Output Modes

All commands support `-o table` (default) and `-o json`:
```bash
polymarket -o json markets list --limit 5
```

## Quick Commands

### Markets
```bash
# List markets
polymarket markets list --limit 10
polymarket markets list --active true --order volume_num

# Search markets
polymarket markets search "bitcoin" --limit 5

# Get specific market
polymarket markets get will-trump-win-the-2024-election
polymarket markets get 12345
```

### Events & Tags
```bash
polymarket events list --limit 10
polymarket events list --tag politics
polymarket tags list
```

### Prices & Order Book
```bash
polymarket clob price TOKEN_ID --side buy
polymarket clob midpoint TOKEN_ID
polymarket clob spread TOKEN_ID
polymarket clob book TOKEN_ID
polymarket clob last-trade TOKEN_ID
```

### Trading (requires wallet)
```bash
# Place limit order (buy 10 shares at $0.50)
polymarket clob create-order --token TOKEN_ID --side buy --price 0.50 --size 10

# Place market order ($5 worth)
polymarket clob market-order --token TOKEN_ID --side buy --amount 5

# Cancel orders
polymarket clob cancel ORDER_ID
polymarket clob cancel-all
```

### Balances & Positions
```bash
polymarket clob balance --asset-type collateral
polymarket clob balance --asset-type conditional --token TOKEN_ID
polymarket clob orders
polymarket clob trades
polymarket data positions WALLET_ADDRESS
polymarket data value WALLET_ADDRESS
```

### Rewards
```bash
polymarket clob rewards --date 2024-06-15
polymarket clob current-rewards
```

### On-chain Operations
```bash
# Split USDC into YES/NO tokens
polymarket ctf split --condition CONDITION_ID --amount 10

# Merge back to USDC
polymarket ctf merge --condition CONDITION_ID --amount 10

# Redeem winnings after resolution
polymarket ctf redeem --condition CONDITION_ID
```

### Interactive Shell
```bash
polymarket shell
# Then type commands without "polymarket" prefix
```

## Environment Variables

```bash
export POLYMARKET_PRIVATE_KEY=0xabc...      # Your private key
export POLYMARKET_SIGNATURE_TYPE=proxy      # proxy (default), eoa, or gnosis-safe
export POLYMARKET_CHAIN_ID=137              # Polygon mainnet
```

## Common Use Cases

### Check election market prices
```bash
polymarket markets search "election" --limit 5
polymarket clob book MARKET_TOKEN_ID
```

### Check your positions
```bash
polymarket wallet address  # Get your address first
polymarket data positions YOUR_ADDRESS
polymarket data value YOUR_ADDRESS
```

### Place a bet
```bash
# 1. Find the market
polymarket markets search "trump" --limit 3

# 2. Get the token ID
polymarket markets get THE_MARKET_SLUG

# 3. Check price
polymarket clob midpoint TOKEN_ID

# 4. Place order
polymarket clob market-order --token TOKEN_ID --side buy --amount 10
```

### Monitor rewards
```bash
polymarket clob current-rewards
polymarket clob reward-percentages
```

## Notes

- Most read-only commands work WITHOUT a wallet (browse markets, view prices, order books)
- Trading requires wallet setup and MATIC for Polygon gas
- Default chain is Polygon (chain_id: 137)
- Use `-o json` for scripting and automation
- All amounts are in USDC dollars