---
name: obsidian
description: |
  Work with Obsidian vaults from the command line. Use this skill whenever
  the user wants to create, read, search, or manage notes in an Obsidian vault;
  work with tags, frontmatter/properties, daily notes, or backlinks; sync a
  vault with Obsidian Sync; or do anything vault-related. Also use it when the
  user asks to "add a note", "search my vault", "tag this", "create a daily
  note", or "sync obsidian".
allowed-tools:
  - Bash(ob *)
  - Bash(grep *)
  - Bash(find *)
  - Read
  - Write
  - Edit
---

# Obsidian Skill

Obsidian vaults are directories of plain Markdown files. On this server the
agent interacts with them in two ways:

1. **Direct file ops** — read/write/search `.md` files directly (no app needed)
2. **`ob` CLI** — official `obsidian-headless` tool for Obsidian Sync operations

Binary: `/home/gabclaw/.npm-global/bin/ob`
Default vault: `/home/gabclaw/obsidian` (PARA knowledge vault — Projects/Areas/Resources/Archive)
Agent workspace: `/home/gabclaw/vault` (OpenClaw agent files, separate from knowledge vault)

---

## 1. Direct Vault Operations

### Creating a note

```bash
cat > ~/vault/path/to/Note Title.md << 'EOF'
---
title: Note Title
date: 2026-03-03
tags: [tag1, tag2]
---

Content here.
EOF
```

Always include YAML frontmatter for new notes. See `references/vault-format.md`
for the full frontmatter spec.

### Reading a note

Use the `Read` tool directly on the `.md` file path.

### Searching the vault

```bash
# Full-text search
grep -r "search term" ~/vault --include="*.md" -l

# Search with context (show surrounding lines)
grep -r "search term" ~/vault --include="*.md" -C 2

# Find by tag
grep -r "#tag-name\|tags:.*tag-name" ~/vault --include="*.md" -l

# Find by frontmatter property
grep -r "^status: active" ~/vault --include="*.md" -l

# Find notes modified today
find ~/vault -name "*.md" -newer ~/vault/memory/$(date +%Y-%m-%d).md
```

### Daily notes

Daily notes live at `/home/gabclaw/obsidian/00 - Inbox/YYYY-MM-DD.md` or
directly in the vault root. Template at `Templates/Daily Note Template.md`.
To read today's: `Read "/home/gabclaw/obsidian/00 - Inbox/$(date +%Y-%m-%d).md"`
To append: use `Edit` to add content at the bottom.

### Tags

Obsidian supports two tag formats:
- Inline: `#tag-name` anywhere in the body
- Frontmatter: `tags: [tag1, tag2]`

```bash
# List all unique tags in vault
grep -roh '#[a-zA-Z0-9/_-]*\|tags: \[.*\]' ~/vault --include="*.md" | sort -u

# Count tag frequency
grep -roh '#[a-zA-Z0-9/_-]*' ~/vault --include="*.md" | sort | uniq -c | sort -rn
```

### Links and backlinks

Obsidian uses `[[Note Title]]` wiki-style links.

```bash
# Find all notes that link to a specific note
grep -r '\[\[Note Title\]\]' ~/vault --include="*.md" -l

# Find orphaned notes (no incoming links)
# Complex — see references/vault-format.md for the one-liner
```

### Renaming / moving notes

Use `mv` to move the file, then update all backlinks:
```bash
# Move
mv ~/vault/OldName.md ~/vault/NewName.md

# Update all links pointing to the old name
grep -rl '\[\[OldName\]\]' ~/vault --include="*.md" | \
  xargs sed -i 's/\[\[OldName\]\]/[[NewName]]/g'
```

---

## 2. `ob` CLI — Obsidian Sync

The `ob` tool handles Obsidian Sync (requires Obsidian account / subscription).
For full command reference see `references/commands.md`.

### Auth

```bash
ob login          # opens browser or shows login URL
ob logout
ob login          # with no args shows current login status
```

### Check sync status

```bash
ob sync-status --vault ~/vault
ob sync-list-local       # vaults already set up for sync
ob sync-list-remote      # remote vaults available on your account
```

### First-time sync setup

```bash
# Link a local path to an existing remote vault
ob sync-setup --vault ~/vault/my-notes

# Create a brand-new remote vault and link it
ob sync-create-remote --name "My Vault"
ob sync-setup --vault ~/vault/my-notes --remote "My Vault"
```

### Sync

```bash
ob sync --vault ~/vault/my-notes          # one-time sync
ob sync --vault ~/vault/my-notes --continuous   # watch mode (keep running)
```

### Reconfigure / unlink

```bash
ob sync-config --vault ~/vault/my-notes   # change sync settings
ob sync-unlink --vault ~/vault/my-notes   # disconnect from sync
```

---

## Typical Workflows

### "Search my vault for X"
```bash
grep -r "X" "/home/gabclaw/obsidian" --include="*.md" -l
# then Read the relevant files
```

### "Create a note about X"
1. Determine PARA category: Projects (active), Areas (ongoing), Resources (reference), Archive
2. Write the file with frontmatter + content using `Write` to the right subdirectory
3. Use the appropriate template from `Templates/` as a starting point

### "What are my active projects?"
```bash
grep -r "^status: active" "/home/gabclaw/obsidian/10 - Projects" --include="*.md" -l
```

### "Add to today's daily note"
Create or edit `/home/gabclaw/obsidian/00 - Inbox/$(date +%Y-%m-%d).md`
using the `Daily Note Template.md` as a starting point.

### "Set up Obsidian Sync"
```bash
# Login first (requires Obsidian account credentials)
ob login --email YOUR_EMAIL --password YOUR_PASSWORD

# Then set up sync for the knowledge vault
ob sync-list-remote                              # see available remote vaults
ob sync-create-remote --name "gabclaw-obsidian" # create new remote if needed
ob sync-setup --vault /home/gabclaw/obsidian
ob sync --vault /home/gabclaw/obsidian --continuous  # keep running in background
```

---

## Reference Files

- `references/vault-format.md` — full frontmatter spec, link syntax, callouts, templates
- `references/commands.md` — complete `ob` CLI command reference with all options
