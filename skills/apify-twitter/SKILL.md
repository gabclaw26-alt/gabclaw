---
name: apify-twitter
description: |
  Scrape and analyze Twitter/X using Apify Tweet Scraper. Use for: (1) Extracting tweets from profiles, (2) Searching by keyword, (3) Scraping lists, (4) Getting user info and engagement metrics. Requires APIFY_API_TOKEN.
metadata:
  {
    "openclaw": {
      "emoji": "🐦",
      "requires": { "env": ["APIFY_API_TOKEN"] },
    },
  }
---

# Apify Twitter Scraper

Scrape Twitter/X data using Apify's Tweet Scraper actor.

## Prerequisites

Set your Apify API token:
```bash
openclaw config set env.APIFY_API_TOKEN "your_token_here"
```

Get your token at: https://console.apify.com/settings/tokens

## Quick Start

### Search for tweets:
```bash
apify-twitter "ASML"
```

### Scrape a profile:
```bash
apify-twitter-profile "elonmusk"
```

## Complete Workflow

### Step 1: Start the Run

```bash
RUN_RESPONSE=$(curl -s -X POST \
  "https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs?token=$APIFY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "searchTerms": ["ASML"],
    "maxTweets": 50
  }')

RUN_ID=$(echo "$RUN_RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('id',''))")
```

### Step 2: Poll for Completion

```bash
for i in {1..30}; do
  STATUS=$(curl -s "https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs/$RUN_ID?token=$APIFY_API_TOKEN" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('status',''))")
  [ "$STATUS" = "SUCCEEDED" ] && break
  sleep 2
done
```

### Step 3: Get Dataset ID & Fetch Results

```bash
DATASET_ID=$(curl -s "https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs/$RUN_ID?token=$APIFY_API_TOKEN" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('defaultDatasetId',''))")

curl -s "https://api.apify.com/v2/datasets/$DATASET_ID/items?token=$APIFY_API_TOKEN" > tweets.json
```

**Quick method - Get latest successful run:**

```bash
RUN_INFO=$(curl -s "https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs?token=$APIFY_API_TOKEN&status=SUCCEEDED&limit=1")
DATASET_ID=$(echo "$RUN_INFO" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('items',[{}])[0].get('defaultDatasetId',''))")
curl -s "https://api.apify.com/v2/datasets/$DATASET_ID/items?token=$APIFY_API_TOKEN" > tweets.json
```

## Input Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `startUrls` | array | URLs to scrape (profiles, searches, lists) |
| `searchTerms` | array | Keywords to search for |
| `twitterHandles` | array | Twitter handles to get tweets from |
| `maxTweets` | number | Maximum number of tweets |
| `sort` | string | Sort by: "Latest", "Top", "People" |
| `lang` | string | Language filter (e.g., "en") |
| `since` | string | Start date YYYY-MM-DD |
| `until` | string | End date YYYY-MM-DD |

## Example Inputs

**Search:**
```json
{"searchTerms": ["ASML"], "maxTweets": 50, "sort": "Latest"}
```

**Profile:**
```json
{"startUrls": [{"url": "https://twitter.com/elonmusk"}], "maxTweets": 20}
```

**List:**
```json
{"startUrls": [{"url": "https://twitter.com/i/lists/78783491"}], "maxTweets": 100}
```

## Output

Tweet fields include:
- `text` / `fullText` - Tweet content
- `createdAt` - Publication date
- `likeCount`, `retweetCount`, `replyCount`, `quoteCount`
- `user` - Author info (name, username, followers)
- `url` - Tweet URL
- `hashtags` - Array of hashtags
- `mentions` - Array of mentioned users

## Actor ID

- Actor: `apidojo~tweet-scraper`
- ID: `61RPP7dywgiy0JPD0`
