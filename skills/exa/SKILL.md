---
name: exa
description: |
  Web search and content scraping via Exa AI. Use for: (1) Web search for any topic, (2) Finding code examples and documentation, (3) Researching companies, (4) Deep research reports. NOT for: browser automation (use Firecrawl), simple static scraping (use Exa), or when interaction needed (use Firecrawl browser).
metadata:
  {
    "openclaw": {
      "requires": { "bins": ["exa"] },
      "install": [
        {
          "id": "pip",
          "kind": "pip",
          "package": "exa-py",
          "label": "Install exa-py (pip)",
        },
      ],
    },
  }
---

# Exa Search

Web search and content scraping via Exa AI's neural search engine.

## Prerequisites

```bash
pip install exa-py
```

Get your API key at https://dashboard.exa.ai/api-keys

Set the environment variable:
```bash
export EXA_API_KEY="your_api_key_here"
```

Or pass `api_key` directly in code.

## Usage

### Web Search

```python
from exa_py import Exa

exa = Exa(api_key=os.getenv("EXA_API_KEY"))

# Basic search
results = exa.search("AI agents 2024", num_results=5)
for result in results.results:
    print(f"{result.title}: {result.url}")

# Search with content scraping
results = exa.search(
    "python async best practices",
    num_results=10,
    text=True,  # Get full text content
    highlights=True  # Get relevant snippets
)
```

### Code Search

```python
# Find code examples
results = exa.search(
    "how to implement OAuth2 python",
    num_results=10,
    category="code"  # Search code specifically
)
```

### Company Research

```python
# Research a company
results = exa.search(
    "Stripe company overview",
    num_results=5,
    category="company"
)
```

### Deep Research (Long-form Reports)

```python
# Start a deep research task
research = exa.deep_search(
    "state of quantum computing startups 2024",
    type="auto"  # Generates comprehensive report
)

# Check status and get results
status = exa.get_research(research.id)
if status.status == "completed":
    print(status.report)
```

## Key Parameters

- `num_results`: Number of results (default 10)
- `text`: Include full text content (boolean)
- `highlights`: Include relevant highlights/snippets (boolean)
- `category`: Filter by type - "code", "company", "article", "pdf"
- `domains`: Restrict to specific domains
- `start_published_date`: Filter by date
- `type`: For deep_search - "research_report", "summary", "outline"

## Tools Available

When this skill is loaded, use Bash with `exa` commands for:
- `exa search <query>` - Quick CLI search (if installed)
- Direct Python usage as shown above

## When to Use Exa vs Firecrawl

- **Use Exa for**: Web search, finding content, code search, company research, neural search
- **Use Firecrawl for**: Browser automation, interactive pages, form fills, clicks, pagination
