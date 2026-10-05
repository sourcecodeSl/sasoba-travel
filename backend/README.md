# Sasoba Travels — Backend (PHP + MySQL)

A small JSON API that powers the admin panel (`/admin`) and serves website content.
Runs on XAMPP's Apache + MariaDB/MySQL — no extra installs.

## First-time setup

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Create the database `sasoba` (already done if it shows in phpMyAdmin).
3. Create the tables and load the starter content:
   ```bash
   C:\xampp\php\php.exe backend\database\setup.php
   ```
   Safe to run again — it never overwrites existing data.
4. Start the website (`cd frontend && npm run dev`) and open **http://localhost:5173/admin**.
   The first visit asks you to create the administrator account.

## How it fits together

```
Browser ──► Vite (5173 dev / 4173 preview) ──► /api/*, /uploads/*  ──► Apache: /sasoba travel/backend/
```

| Path | What |
| --- | --- |
| `api/index.php` | Router for every endpoint |
| `src/auth.php` | Sign-in, first-run setup, sessions (hashed bearer tokens), brute-force lock-out |
| `src/content.php` | Content types, settings, enquiries, image uploads, dashboard stats |
| `database/schema.sql` | Table definitions |
| `database/setup.php` | Creates tables + loads `seed.json` |
| `database/export-seed.mjs` | Regenerates `seed.json` from the website's built-in data |
| `uploads/` | Images uploaded in the admin (scripts can't run here) |

### Tables

`testimonials` (travel stories), `moments`, `destinations`, `journeys`, `festivals`,
`culture_experiences`, `stays`, `settings` (contact, about, etiquette), `enquiries`
("Plan your trip" messages), plus `admins`, `admin_tokens`, `login_attempts`, `rate_limits`.

## Configuration

Defaults live in `config.php` (XAMPP: user `root`, no password). For another server,
create `config.local.php` (git-ignored):

```php
<?php
return ['db' => ['user' => 'sasoba', 'pass' => 'a-strong-password']];
```

If the backend lives at a different URL, start Vite with `BACKEND_URL`, e.g.
`BACKEND_URL=http://localhost/backend npm run dev`.

## Security notes

- Passwords are hashed with `password_hash` (bcrypt); sessions are random 256-bit tokens stored as SHA-256 hashes.
- 8 failed sign-ins from one IP lock sign-in for 15 minutes; the enquiry form allows 6 messages per IP per hour and has a spam honeypot.
- All SQL uses prepared statements with whitelisted columns.
- `config.php`, `src/` and `database/` are blocked from the web by `.htaccess`.
- **Before going live:** use HTTPS, give MySQL a non-root user with a password, and change the API origin list in `config.php`.
