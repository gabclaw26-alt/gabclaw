# tasks/

Task queue for agent-managed work.

## Workflow

- `pending/` — new tasks, instructions, reminders (one file per task)
- `active/`  — tasks currently being worked on (move from pending/ when starting)
- `done/`    — completed tasks with outcome notes (move from active/ when done)

## Task File Format

Name files: `YYYY-MM-DD-short-description.md`

Contents:
```
# Task: [title]
Created: YYYY-MM-DD
Priority: high | normal | low

## What to do
[description]

## Done
[outcome — fill in when completing and moving to done/]
```
