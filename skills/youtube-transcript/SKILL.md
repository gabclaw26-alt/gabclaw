---
name: youtube-transcript
description: Fetch YouTube video transcripts using the youtube-transcript-api Python library. Use when: (1) Extracting transcript from a YouTube video URL or ID, (2) Converting YouTube videos to text, (3) Getting subtitles/captions from YouTube, (4) Processing multiple language transcripts. Supports plain text, JSON, SRT, and VTT output formats.
---

# YouTube Transcript Fetcher

## Quick Start

```bash
# Install dependency (using UV)
uv pip install youtube-transcript-api

# Or with pip
pip install youtube-transcript-api

# Run the script
python3 skills/youtube-transcript/scripts/fetch_transcript.py <youtube_url_or_video_id>
```

## Installation

### Using UV (recommended)
```bash
uv pip install youtube-transcript-api
```

### Using pip
```bash
pip install youtube-transcript-api
```

## Usage Examples

### Basic transcript fetch
```bash
python3 skills/youtube-transcript/scripts/fetch_transcript.py https://youtu.be/dQw4w9WgXcQ
python3 skills/youtube-transcript/scripts/fetch_transcript.py dQw4w9WgXcQ
```

### Save to file
```bash
python3 .../fetch_transcript.py VIDEO_ID -o transcript.txt
python3 .../fetch_transcript.py VIDEO_ID -o subtitles.srt --format srt
```

### Specific language
```bash
python3 .../fetch_transcript.py VIDEO_ID --lang pt
python3 .../fetch_transcript.py VIDEO_ID --lang en
```

### Get all available languages
```bash
python3 .../fetch_transcript.py VIDEO_ID --all-langs
```

### Output formats
```bash
--format text    # Plain text (default)
--format json    # JSON with timing info
--format srt     # SubRip subtitle format
--format vtt     # WebVTT subtitle format
```

### Using a proxy (if IP blocked)
```bash
python3 .../fetch_transcript.py VIDEO_ID --proxy http://user:pass@host:port
```

## Troubleshooting

### "RequestBlocked" Error
If you get `RequestBlocked` error, YouTube is blocking your IP. This happens when:
- Running from a cloud provider (AWS, GCP, Azure)
- Running from a data center
- IP has been rate-limited

**Solutions:**
1. Use a proxy: `--proxy http://host:port`
2. Run from a local machine
3. Use browser automation to manually download captions

## Script Location

```
/home/gabclaw/vault/skills/youtube-transcript/scripts/fetch_transcript.py
```