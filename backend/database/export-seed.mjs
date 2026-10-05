// Exports the website's built-in content to seed.json for the first database load.
//   node backend/database/export-seed.mjs
import { writeFileSync } from 'node:fs';
import { DESTINATIONS } from '../../frontend/src/data/destinations.js';
import { CONTACT, PACKAGES, TESTIMONIALS, INSTAGRAM } from '../../frontend/src/data/siteData.js';
import {
  PARK_SPECIES,
  FESTIVALS,
  CULTURE_EXPERIENCES,
  ETIQUETTE,
  STAYS,
  ABOUT_STORY,
  ABOUT_VALUES,
  ABOUT_STEPS,
  ABOUT_TEAM,
} from '../../frontend/src/data/pagesData.js';

const seed = {
  testimonials: TESTIMONIALS.map((t) => ({ ...t, rating: 5 })),
  moments: INSTAGRAM.map((m) => ({ ...m, link: 'https://instagram.com/' })),
  destinations: DESTINATIONS.map((d) => ({ ...d, species: PARK_SPECIES[d.slug] || [] })),
  journeys: PACKAGES.map(({ id, ...p }) => ({ slug: id, ...p })),
  festivals: FESTIVALS,
  culture_experiences: CULTURE_EXPERIENCES,
  stays: STAYS,
  contact: {
    ...CONTACT,
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
    hours: 'Our concierge replies 24/7 on WhatsApp',
  },
  about: { story: ABOUT_STORY, values: ABOUT_VALUES, steps: ABOUT_STEPS, team: ABOUT_TEAM },
  etiquette: ETIQUETTE,
};

writeFileSync(new URL('./seed.json', import.meta.url), JSON.stringify(seed, null, 2));
console.log('seed.json written:', Object.entries(seed).map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : 'obj'}`).join(', '));
