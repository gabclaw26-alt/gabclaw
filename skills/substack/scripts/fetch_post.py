#!/usr/bin/env python3
"""Fetch content from a Substack post."""
import argparse
import json
import os
import sys
from substack_api import Post, SubstackAuth

def main():
    parser = argparse.ArgumentParser(description="Fetch content from a Substack post")
    parser.add_argument("url", help="Post URL (e.g., https://example.substack.com/p/post-slug)")
    parser.add_argument("--cookies", default="~/.substack_cookies.json", help="Path to cookies JSON file")
    parser.add_argument("--metadata-only", action="store_true", help="Only fetch metadata")
    parser.add_argument("--output", help="Output JSON file")
    args = parser.parse_args()

    # Initialize auth if cookies exist
    cookie_path = os.path.expanduser(args.cookies)
    auth = None
    if os.path.exists(cookie_path):
        auth = SubstackAuth(cookies_path=cookie_path)

    post = Post(args.url, auth=auth)

    # Check if paywalled
    if post.is_paywalled():
        print("⚠️  This post is paywalled. Content may be limited without valid subscription.", file=sys.stderr)

    # Get metadata
    metadata = post.get_metadata()
    result = {"metadata": metadata}

    # Get content if not metadata-only
    if not args.metadata_only:
        content = post.get_content()
        result["content"] = content

    if args.output:
        with open(args.output, "w") as f:
            json.dump(result, f, indent=2, default=str)
        print(f"Saved to {args.output}")
    else:
        print(json.dumps(result, indent=2, default=str))

if __name__ == "__main__":
    main()