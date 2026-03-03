# `ob` CLI Command Reference

Binary: `/home/gabclaw/.npm-global/bin/ob`
Install: `npm install -g obsidian-headless`
Requires: Node.js 22+, Obsidian account (for Sync features)

---

## ob login

Authenticate with your Obsidian account.

```bash
ob login                    # interactive login (opens browser or prints URL)
ob login --token <token>    # non-interactive, pass API token directly
```

Shows current login status when called with no args after already logged in.

---

## ob logout

```bash
ob logout
```

---

## ob sync-list-remote

List all remote vaults available on your Obsidian account.

```bash
ob sync-list-remote
```

Output: vault names and IDs you can reference in sync-setup.

---

## ob sync-list-local

List all vaults currently configured for sync on this machine.

```bash
ob sync-list-local
```

---

## ob sync-create-remote

Create a new remote vault in Obsidian Sync.

```bash
ob sync-create-remote --name "Vault Name"
ob sync-create-remote --name "Vault Name" --encryption   # enable E2E encryption
ob sync-create-remote --name "Vault Name" --password "secret"  # with password
```

---

## ob sync-setup

Link a local directory to a remote vault for syncing.

```bash
ob sync-setup --vault /path/to/local/vault
ob sync-setup --vault /path/to/local/vault --remote "Remote Vault Name"
ob sync-setup --vault /path/to/local/vault --remote-id <id>
```

Options:
- `--vault <path>` — local directory path (required)
- `--remote <name>` — name of existing remote vault
- `--remote-id <id>` — ID of remote vault (from sync-list-remote)

---

## ob sync

Run a sync operation.

```bash
ob sync --vault /path/to/vault           # one-time sync (pull + push)
ob sync --vault /path/to/vault --continuous   # watch mode, keep running
ob sync --vault /path/to/vault --pull-only    # download only
ob sync --vault /path/to/vault --push-only    # upload only
```

Options:
- `--vault <path>` — vault to sync (required)
- `--continuous` — watch for changes and sync automatically
- `--pull-only` — download remote changes only
- `--push-only` — upload local changes only

For background continuous sync, use systemd or run as a backgrounded process:
```bash
nohup ob sync --vault ~/vault/my-notes --continuous &
```

---

## ob sync-status

Check the sync status of a vault.

```bash
ob sync-status --vault /path/to/vault
```

Shows: last sync time, pending changes, connection status.

---

## ob sync-config

Change sync configuration for an already-setup vault.

```bash
ob sync-config --vault /path/to/vault
```

Interactive prompts to update sync settings (what to sync, encryption, etc.).

---

## ob sync-unlink

Disconnect a vault from Obsidian Sync and remove stored credentials.

```bash
ob sync-unlink --vault /path/to/vault
```

Does NOT delete local files. Removes the sync configuration only.

---

## Global Options

```bash
ob --version    # show version
ob --help       # general help
ob <cmd> --help # help for a specific command
```

---

## Common Setup Flow

```bash
# 1. Authenticate
ob login

# 2. See what remote vaults exist
ob sync-list-remote

# 3. Link local vault to a remote
ob sync-setup --vault ~/vault/my-notes --remote "My Vault"

# 4. Run first sync
ob sync --vault ~/vault/my-notes

# 5. Check status
ob sync-status --vault ~/vault/my-notes

# 6. (Optional) Continuous sync in background
ob sync --vault ~/vault/my-notes --continuous
```
