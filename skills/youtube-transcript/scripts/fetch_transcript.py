#!/usr/bin/env python3
"""
YouTube Transcript Fetcher

Usage:
    python3 fetch_transcript.py <youtube_url_or_video_id> [--output FILE] [--lang LANG] [--all-langs]

Examples:
    python3 fetch_transcript.py https://youtu.be/dQw4w9WgXcQ
    python3 fetch_transcript.py dQw4w9WgXcQ --output transcript.txt
    python3 fetch_transcript.py dQw4w9WgXcQ --lang pt --all-langs
"""

import argparse
import sys
import re
import json
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import (
        NoTranscriptFound,
        VideoUnavailable,
        TranscriptsDisabled,
        CouldNotRetrieveTranscript,
        RequestBlocked
    )
except ImportError:
    print("Error: youtube-transcript-api not installed.")
    print("Install with: uv pip install youtube-transcript-api")
    print("Or: pip install youtube-transcript-api")
    sys.exit(1)


def extract_video_id(url_or_id: str) -> str:
    """Extract video ID from YouTube URL or return as-is if already an ID."""
    patterns = [
        r'(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})',
        r'(?:youtu\.be/)([a-zA-Z0-9_-]{11})',
        r'(?:youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        r'(?:youtube\.com/v/)([a-zA-Z0-9_-]{11})',
        r'(?:youtube\.com/shorts/)([a-zA-Z0-9_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    
    if len(url_or_id) == 11 and re.match(r'^[a-zA-Z0-9_-]+$', url_or_id):
        return url_or_id
    
    raise ValueError(f"Could not extract video ID from: {url_or_id}")


def fetch_transcript(video_id: str, language: str = None, all_langs: bool = False, proxy: str = None) -> dict:
    """Fetch transcript from YouTube video."""
    yta = YouTubeTranscriptApi(proxy=proxy) if proxy else YouTubeTranscriptApi()
    
    if all_langs:
        transcript_list = yta.list(video_id)
        results = {}
        
        for transcript in transcript_list:
            lang_code = transcript.language_code
            try:
                fetched = transcript.fetch()
                text = ' '.join([item['text'] for item in fetched])
                results[lang_code] = {
                    'language': transcript.language,
                    'text': text
                }
                print(f"✓ Got transcript for: {transcript.language} ({lang_code})")
            except Exception as e:
                print(f"✗ Failed to fetch {lang_code}: {e}")
        
        return results
    
    if language:
        try:
            transcript_list = yta.list(video_id)
            transcript = transcript_list.find_transcript([language]).fetch()
        except NoTranscriptFound:
            transcript_list = yta.list(video_id)
            for t in transcript_list:
                if t.language_code.startswith(language.split('-')[0]):
                    transcript = t.fetch()
                    print(f"Using fallback: {t.language}")
                    break
            else:
                raise NoTranscriptFound(f"No transcript available for: {language}")
    else:
        transcript_list = yta.list(video_id)
        transcript = transcript_list.find_transcript(['en']).fetch()
    
    return transcript


def format_transcript(transcript_data: list, format_type: str = 'text') -> str:
    """Format transcript data into desired output format."""
    if isinstance(transcript_data, dict) and 'text' in transcript_data:
        return transcript_data['text']
    
    if format_type == 'json':
        return json.dumps(transcript_data, indent=2, ensure_ascii=False)
    
    if format_type == 'srt':
        output = []
        for i, item in enumerate(transcript_data, 1):
            start = format_srt_time(item['start'])
            end = format_srt_time(item['start'] + item['duration'])
            output.append(f"{i}\n{start} --> {end}\n{item['text']}\n")
        return '\n'.join(output)
    
    if format_type == 'vtt':
        output = ["WEBVTT\n"]
        for item in transcript_data:
            start = format_vtt_time(item['start'])
            end = format_vtt_time(item['start'] + item['duration'])
            output.append(f"{start} --> {end}\n{item['text']}\n")
        return '\n'.join(output)
    
    return ' '.join([item['text'] for item in transcript_data])


def format_srt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def format_vtt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"


def main():
    parser = argparse.ArgumentParser(
        description="Fetch YouTube video transcripts",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('video', help="YouTube URL or video ID")
    parser.add_argument('--output', '-o', help="Output file path")
    parser.add_argument('--lang', '-l', help="Language code (e.g., 'en', 'pt', 'es')")
    parser.add_argument('--all-langs', '-a', action='store_true',
                        help="Fetch all available language transcripts")
    parser.add_argument('--format', '-f', choices=['text', 'json', 'srt', 'vtt'],
                        default='text', help="Output format")
    parser.add_argument('--proxy', '-p', help="Proxy URL (e.g., http://user:pass@host:port)")
    
    args = parser.parse_args()
    
    try:
        video_id = extract_video_id(args.video)
        print(f"Video ID: {video_id}")
        
        transcript = fetch_transcript(video_id, args.lang, args.all_langs, args.proxy)
        
        if args.all_langs and isinstance(transcript, dict):
            if args.output:
                output_path = Path(args.output)
                for lang_code, data in transcript.items():
                    file_path = output_path.parent / f"{output_path.stem}_{lang_code}{output_path.suffix}"
                    content = format_transcript(data, args.format)
                    file_path.write_text(content, encoding='utf-8')
                    print(f"Saved: {file_path}")
            else:
                print("\n=== All Available Transcripts ===\n")
                for lang_code, data in transcript.items():
                    print(f"\n--- {data['language']} ({lang_code}) ---")
                    print(data['text'][:500] + "..." if len(data['text']) > 500 else data['text'])
        else:
            content = format_transcript(transcript, args.format)
            
            if args.output:
                Path(args.output).write_text(content, encoding='utf-8')
                print(f"Transcript saved to: {args.output}")
            else:
                print("\n" + "="*50)
                print(content)
                print("="*50)
        
        print("\n✓ Done!")
        
    except RequestBlocked as e:
        print("\n⚠️  Error: YouTube is blocking requests from this IP")
        print("This usually happens when running from a cloud provider or data center.")
        print("\nWorkarounds:")
        print("1. Use a proxy: --proxy http://user:pass@host:port")
        print("2. Run from a local machine (not server/cloud)")
        print("3. Use browser automation to get captions manually")
        sys.exit(1)
    except VideoUnavailable:
        print("Error: Video is unavailable")
        sys.exit(1)
    except TranscriptsDisabled:
        print("Error: Transcripts are disabled for this video")
        sys.exit(1)
    except NoTranscriptFound as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()