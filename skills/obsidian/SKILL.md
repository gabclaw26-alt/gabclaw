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
Default vault: `/home/gabclaw/vault` (unless user specifies another)

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

Daily notes live at `~/vault/memory/YYYY-MM-DD.md` by convention.
To read today's: `Read ~/vault/memory/$(date +%Y-%m-%d).md`
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
grep -r "X" ~/vault --include="*.md" -l
# then Read the relevant files
```

### "Create a note about X"
1. Choose a logical path under `~/vault/`
2. Write the file with frontmatter + content using `Write`
3. Confirm with the user if unsure where it belongs

### "Add to today's daily note"
```bash
# Append to today's memory file
# Use Edit tool on ~/vault/memory/$(date +%Y-%m-%d).md
```

### "Set up Obsidian Sync"
```bash
ob login
ob sync-list-remote   # see available remote vaults
ob sync-setup --vault /path/to/vault
ob sync --continuous  # keep running in background
```

---

## Reference Files

- `references/vault-format.md` — full frontmatter spec, link syntax, callouts, templates
- `references/commands.md` — complete `ob` CLI command reference with all options
