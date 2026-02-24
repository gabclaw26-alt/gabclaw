---
name: substack
description: "Interact with Substack newsletters, posts, and user data using the substack-api Python library. Use when: (1) reading posts from a Substack publication, (2) accessing paywalled content using session cookies, (3) searching newsletters, (4) fetching user profiles and subscriptions, or (5) retrieving podcast episodes. Requires user-provided cookies for authenticated access."
---

# Substack Interaction Skill

This skill provides tools for reading and querying Substack content using the `substack-api` Python library.

## Installation

```bash
pip install substack-api
```

## Cookie Setup

The user will provide their Substack session cookies. Save them to a JSON file:

```json
[
  {"name": "substack.sid", "value": "...", "domain": ".substack.com", "path": "/", "secure": true},
  {"name": "substack.lli", "value": "...", "domain": ".substack.com", "path": "/", "secure": true}
]
```

Save as `~/.substack_cookies.json` or as directed by the user.

## Usage

### Authenticated Access

```python
from substack_api import Newsletter, Post, SubstackAuth

auth = SubstackAuth(cookies_path="path/to/cookies.json")
```

### Reading a Newsletter

```python
newsletter = Newsletter("https://example.substack.com", auth=auth)
posts = newsletter.get_posts(limit=10)
top_posts = newsletter.get_posts(sorting="top", limit=5)
```

### Reading a Post

```python
post = Post("https://example.substack.com/p/post-slug", auth=auth)
metadata = post.get_metadata()
content = post.get_content()

if post.is_paywalled():
    print("Paywalled content - requires subscription")
```

### Search Posts

```python
results = newsletter.search_posts("topic", limit=5)
```

### User Profiles

```python
from substack_api import User
user = User("username")
profile = user.get_raw_data()
subscriptions = user.get_subscriptions()
```

## Scripts

- `scripts/fetch_newsletter.py` - Fetch posts from a newsletter URL
- `scripts/fetch_post.py` - Fetch content from a specific post URL
- `scripts/search.py` - Search posts across a newsletter

See individual scripts for usage details.