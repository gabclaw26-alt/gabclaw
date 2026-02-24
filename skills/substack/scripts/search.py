#!/usr/bin/env python3
"""Search posts within a Substack newsletter."""
import argparse
import json
import os
import sys
from substack_api import Newsletter, SubstackAuth

def main():
    parser = argparse.ArgumentParser(description="Search posts in a Substack newsletter")
    parser.add_argument("url", help="Newsletter URL (e.g., https://example.substack.com)")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--cookies", default="~/.substack_cookies.json", help="Path to cookies JSON file")
    parser.add_argument("--limit", type=int, default=5, help="Number of results")
    parser.add_argument("--output", help="Output JSON file")
    args = parser.parse_args()

    # Initialize auth if cookies exist
    cookie_path = os.path.expanduser(args.cookies)
    auth = None
    if os.path.exists(cookie_path):
        auth = SubstackAuth(cookies_path=cookie_path)

    newsletter = Newsletter(args.url, auth=auth)
    results = newsletter.search_posts(args.query, limit=args.limit)

    if args.output:
        with open(args.output, "w") as f:
            json.dump(results, f, indent=2, default=str)
        print(f"Saved {len(results)} results to {args.output}")
    else:
        print(json.dumps(results, indent=2, default=str))

if __name__ == "__main__":
    main()