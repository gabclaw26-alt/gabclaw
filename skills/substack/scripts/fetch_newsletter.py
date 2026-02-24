#!/usr/bin/env python3
"""Fetch posts from a Substack newsletter."""
import argparse
import json
import sys
from substack_api import Newsletter, SubstackAuth

def main():
    parser = argparse.ArgumentParser(description="Fetch posts from a Substack newsletter")
    parser.add_argument("url", help="Newsletter URL (e.g., https://example.substack.com)")
    parser.add_argument("--cookies", default="~/.substack_cookies.json", help="Path to cookies JSON file")
    parser.add_argument("--limit", type=int, default=10, help="Number of posts to fetch")
    parser.add_argument("--sort", choices=["recent", "top"], default="recent", help="Sort order")
    parser.add_argument("--output", help="Output JSON file")
    args = parser.parse_args()

    # Initialize auth if cookies exist
    import os
    cookie_path = os.path.expanduser(args.cookies)
    auth = None
    if os.path.exists(cookie_path):
        auth = SubstackAuth(cookies_path=cookie_path)

    newsletter = Newsletter(args.url, auth=auth)
    posts = newsletter.get_posts(limit=args.limit, sorting=args.sort)

    if args.output:
        with open(args.output, "w") as f:
            json.dump(posts, f, indent=2, default=str)
        print(f"Saved {len(posts)} posts to {args.output}")
    else:
        print(json.dumps(posts, indent=2, default=str))

if __name__ == "__main__":
    main()