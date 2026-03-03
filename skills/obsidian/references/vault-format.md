# Obsidian Vault Format Reference

## File & Folder Conventions

- Notes are `.md` files anywhere in the vault directory tree
- Folder structure is free-form — Obsidian doesn't enforce layout
- Attachment files (images, PDFs) typically live in `assets/` or `attachments/`
- Daily notes typically follow `YYYY-MM-DD.md` naming

## YAML Frontmatter

Frontmatter goes at the very top of the file, between `---` delimiters.
Obsidian calls these "properties".

```yaml
---
title: My Note
aliases: [alternate name, another alias]
date: 2026-03-03
created: 2026-03-03T14:00:00
modified: 2026-03-03T14:00:00
tags: [project/alpha, inbox, status/active]
status: active
type: note          # note | project | person | reference | daily
source: https://example.com
rating: 4
done: false
---
```

### Property Types

| Type | Example |
|------|---------|
| Text | `status: active` |
| Number | `rating: 4` |
| Checkbox | `done: false` |
| Date | `date: 2026-03-03` |
| DateTime | `created: 2026-03-03T14:30:00` |
| List | `tags: [a, b, c]` or multiline `\n- a\n- b` |
| Aliases | `aliases: [short name, other name]` |

## Links

### Wiki links (preferred in Obsidian)

```markdown
[[Note Title]]                    # basic link
[[Note Title|Display Text]]       # with custom display text
[[Note Title#Heading]]            # link to specific heading
[[Note Title#^block-id]]          # link to specific block
![[Note Title]]                   # embed note content
![[image.png]]                    # embed image
![[Note Title#Heading]]           # embed section
```

### Markdown links

```markdown
[text](path/to/note.md)
[text](https://external.com)
```

## Tags

```markdown
#tag                    # simple
#parent/child           # nested (Obsidian supports hierarchy)
#tag-with-dashes        # dashes allowed
```

Tags in frontmatter:
```yaml
tags: [project/alpha, status/active, inbox]
```

## Callouts

```markdown
> [!NOTE]
> This is a note callout.

> [!TIP] Custom title
> Tip content here.

> [!WARNING]
> Warning content.

> [!IMPORTANT]+ Foldable open by default
> Content

> [!CAUTION]- Foldable closed by default
> Content
```

Callout types: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`,
`ABSTRACT`, `INFO`, `SUCCESS`, `QUESTION`, `FAILURE`, `DANGER`, `BUG`, `EXAMPLE`, `QUOTE`

## Tasks

```markdown
- [ ] Incomplete task
- [x] Complete task
- [/] In progress (Obsidian extended)
- [-] Cancelled (Obsidian extended)
```

## Templates

Obsidian uses `{{date}}`, `{{time}}`, `{{title}}` variables in template files.
Since we operate headlessly, use shell substitution instead:

```bash
DATE=$(date +%Y-%m-%d)
TITLE="My Note"
cat > ~/vault/notes/${TITLE}.md << EOF
---
title: ${TITLE}
date: ${DATE}
tags: [inbox]
---

EOF
```

## Useful Shell Patterns

### Find orphaned notes (no backlinks)

```bash
VAULT=~/vault
find "$VAULT" -name "*.md" | while read note; do
  name=$(basename "$note" .md)
  count=$(grep -r "\[\[${name}\]\]" "$VAULT" --include="*.md" -l 2>/dev/null | wc -l)
  [ "$count" -eq 0 ] && echo "$note"
done
```

### Extract all frontmatter property values

```bash
# Get all unique tag values
grep -rh "^tags:" ~/vault --include="*.md" | \
  sed 's/tags: \[//;s/\]//;s/, /\n/g' | sort -u
```

### List notes by modification date

```bash
find ~/vault -name "*.md" -not -path "*/.git/*" \
  -printf "%T@ %p\n" | sort -rn | head -20 | \
  awk '{print $2}'
```
