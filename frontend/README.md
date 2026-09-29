# Sasoba Travels — Frontend

React 19 + Vite + Tailwind CSS v4 + Framer Motion + Lucide.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

```
src/
  App.jsx                      page composition + hero-search → journeys wiring
  context/CurrencyContext.jsx  currency (USD/EUR/GBP/AUD) + language (EN/DE/FR)
  data/siteData.js             ALL content: packages, testimonials, contact, rates, translations
  hooks/                       useMagnetic, useScrolled, useAutoplay, useLockBody, useTripEstimate
  components/
    Navbar.jsx                 glass navbar, switchers, magnetic CTA, mobile menu
    hero/                      cinematic slideshow + smart search widget
    packages/                  bento grid cards + itinerary modal
    builder/TripBuilder.jsx    3-step itinerary wizard with live estimate
    social/                    testimonial carousel + Instagram grid
    Footer.jsx, WhatsAppFloat.jsx, DestinationsMarquee.jsx, WhyUs.jsx
    ui/                        shared primitives (SmartImage, Reveal, icons…)
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/destinations` | 25 destinations with region / experience / month filters |
| `/destinations/:slug` | Destination guide (e.g. `/destinations/sigiriya`) |
| `/journeys`, `/journeys/:id` | All curated journeys + full itinerary pages |
| `/safari` | Wild & Safari — parks, wildlife calendar, marine life |
| `/cultural` | Cultural Escapes — heritage sites, festivals, etiquette |
| `/stays` | Luxury Stays by tier |
| `/about` | About Us |

Content lives in `src/data/` (`destinations.js`, `siteData.js`, `pagesData.js`).

**Hosting on Apache/XAMPP:** `public/.htaccess` sends all routes to `index.html`. Deploy the contents of `dist/` to the web root of a (virtual) host — the site expects to live at `/`, not in a sub-folder.

**Photo credits:** destination photos in `public/images/places/` are from Wikimedia Commons under Creative Commons licences. Each page shows the required author/licence credit (`credit` in `destinations.js`) — keep these if you keep the photos.

## Brand assets (`public/brand/`)

| File | Use |
| --- | --- |
| `sasoba-mark.svg` | Full peacock mandala — vector, any size |
| `sasoba-feathers.svg` + `sasoba-emblem.svg` | Same mark split in two layers (the site animates the feather ring) |
| `sasoba-logo-full.png` | Logo + “Sasoba Travels” wordmark, transparent, for light backgrounds |
| `sasoba-logo-full-light.png` | Same, light text for dark backgrounds |
| `sasoba-mark-1024.png`, `icon-512.png`, `icon-192.png`, `apple-touch-icon.png` | Social / app / favicon sizes |

## Before launch — replace placeholders

| What | Where |
| --- | --- |
| WhatsApp number, email, phone, address | `CONTACT` in `src/data/siteData.js` |
| Photography / 4K drone footage | `IMG` map in `siteData.js` (currently Unsplash) |
| Live exchange rates | `CURRENCIES` in `siteData.js` (static indicative rates) |
| Free guide PDF | add `public/guides/sasoba-ceylon-guide.pdf` |
| Newsletter signup | `TODO` in `Footer.jsx` (currently client-side only) |
| Instagram feed | `InstagramGrid.jsx` (mock data — connect Instagram Graph API) |
| Testimonial videos | add a `video` URL to items in `TESTIMONIALS` |
| Social / SLTDA links | `Footer.jsx` |
