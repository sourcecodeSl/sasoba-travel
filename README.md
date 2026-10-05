# Sasoba Travels

Luxury, tailor-made travel website for Sasoba Travels — bespoke journeys across Sri Lanka.

- **`frontend/`** — React 19 + Vite + Tailwind CSS v4 + Framer Motion site. See [frontend/README.md](frontend/README.md).
- **`backend/`** — PHP + MySQL API for the admin panel and the “Plan your trip” inbox. See [backend/README.md](backend/README.md).
- **Admin panel** — `/admin` on the website (e.g. http://localhost:5173/admin).

## Run locally

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Load the database once (creates the tables in `sasoba` and the starter content):
   ```bash
   C:\xampp\php\php.exe backend\database\setup.php
   ```
3. Start the website:
   ```bash
   cd frontend
   npm install
   npm run dev      # http://localhost:5173   (admin: http://localhost:5173/admin)
   npm run build    # production build → frontend/dist/
   ```
