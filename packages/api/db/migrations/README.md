# SQL Migrations

## Convention

- Files are named `NNN_description.sql` where `NNN` is a zero-padded integer (001, 002, …)
- Files are sorted lexicographically, so the prefix controls application order
- Each file is applied exactly once, tracked in the `schema_migrations` table
- Each migration runs inside a transaction; a failure rolls back cleanly

## Running migrations

```bash
# From repo root
bun run db:migrate

# Or directly
bun run --cwd packages/api db:migrate
```

## Adding a migration

1. Create a new file: `NNN_description.sql` (increment NNN)
2. Write idempotent SQL (`CREATE TABLE IF NOT EXISTS`, etc.)
3. Run `bun run db:migrate` — only the new file will be applied

## Why raw SQL?

This codebase is a teaching artifact. Raw SQL migrations make the database schema completely visible — no ORM abstraction, no generated code, no magic. Every table and index you see in the app is defined explicitly in these files.
