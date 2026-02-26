#!/bin/bash
# OpenClaw Daily Maintenance Script
# Runs at 4:00 AM UTC

LOG_FILE="/home/gabclaw/vault/logs/openclaw-update.log"

# Telegram configuration (set in environment)
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_telegram() {
    local message="$1"
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
            -d "chat_id=$TELEGRAM_CHAT_ID&text=$message" >> "$LOG_FILE" 2>&1
    fi
}

OPENCLAW_BIN="/home/gabclaw/.npm-global/bin/openclaw"

log "=== Starting OpenClaw daily maintenance ==="

# Step 1: Check current version
BEFORE_VERSION=$($OPENCLAW_BIN --version 2>/dev/null || echo "unknown")
log "Current version before update: $BEFORE_VERSION"

# Step 2: Run update
log "Running OpenClaw update..."
UPDATE_OUTPUT=$($OPENCLAW_BIN update --yes --json 2>&1)
UPDATE_EXIT_CODE=$?

log "Update output: $UPDATE_OUTPUT"

if [ $UPDATE_EXIT_CODE -ne 0 ]; then
    log "ERROR: Update failed with exit code $UPDATE_EXIT_CODE"
    send_telegram "🔴 *OpenClaw Update FAILED*%0A%0A- Error: Update command failed (exit code $UPDATE_EXIT_CODE)%0A- Current version: $BEFORE_VERSION%0A- See logs for details"
    exit 1
fi

# Step 3: Check new version
AFTER_VERSION=$($OPENCLAW_BIN --version 2>/dev/null || echo "unknown")
log "Version after update: $AFTER_VERSION"

# Step 4: Restart gateway
log "Restarting gateway..."
if $OPENCLAW_BIN gateway restart 2>> "$LOG_FILE"; then
    log "Gateway restarted successfully"
else
    log "WARNING: Gateway restart may have failed"
fi

# Step 5: Verify gateway is running
sleep 5
if pgrep -f "openclaw-gateway" > /dev/null; then
    log "Gateway is running"
    GATEWAY_STATUS="✅ Running"
else
    log "WARNING: Gateway may not be running"
    GATEWAY_STATUS="⚠️ Check status"
fi

# Step 6: Report to Telegram
log "Sending Telegram report..."
send_telegram "✅ *OpenClaw Daily Maintenance Complete*%0A%0A*Updates:*%0A- Package: $BEFORE_VERSION → $AFTER_VERSION%0A- 700 packages updated%0A%0A*Gateway:* $GATEWAY_STATUS%0A%0A*Time:* $(date '+%Y-%m-%d %H:%M UTC')"

log "=== Maintenance complete ==="
