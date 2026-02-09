# Security

## Encryption
- Environment variables are encrypted using AES-256-GCM
- Each value gets a unique 16-byte IV
- Auth tags ensure data integrity
- Keys are 32 bytes (64 hex chars) stored in `ENCRYPTION_KEY` env var
- Format: `iv:authTag:encryptedData` (hex encoded)

## Authentication
- Supabase Auth with email/password and OAuth (Google, GitHub)
- Session management via middleware (cookie-based)
- Protected routes redirect to login

## Authorization
- Row-Level Security (RLS) on all tables
- Users can only access their own data
- Project ownership verified before env var operations
- Team access via team_members join

## Rate Limiting
- In-memory rate limiter (30 req/min per user)
- Applied to sensitive API routes (env vars, decrypt)

## Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (no camera/mic/geo)
- poweredByHeader: false

## Audit Logging
- All env var operations logged (create, update, delete, decrypt)
- Logs include user_id, action, resource, timestamp

## Reporting Vulnerabilities
If you discover a security vulnerability, please report it responsibly.
