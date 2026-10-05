// Loads live content from the admin-managed database and swaps it into the data modules
// in place, so every page keeps importing the same arrays. If the API is unreachable the
// site falls back to the built-in content, so it never shows an empty page.
import { DESTINATIONS } from './destinations.js';
import { CONTACT, DESTINATIONS as DESTINATION_NAMES, INSTAGRAM, PACKAGES, TESTIMONIALS } from './siteData.js';
import {
  ABOUT_STEPS,
  ABOUT_STORY,
  ABOUT_TEAM,
  ABOUT_VALUES,
  CULTURE_EXPERIENCES,
  ETIQUETTE,
  FESTIVALS,
  PARK_SPECIES,
  STAYS,
} from './pagesData.js';
import {
  normalizeDestination,
  normalizeExperience,
  normalizeFestival,
  normalizeJourney,
  normalizeMoment,
  normalizeStay,
  normalizeTestimonial,
} from './normalize.js';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const replace = (target, items) => {
  if (Array.isArray(items)) target.splice(0, target.length, ...items);
};

export async function loadContent(timeoutMs = 3500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/public/content`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const destinations = (data.destinations || []).map(normalizeDestination);
    replace(DESTINATIONS, destinations);
    replace(DESTINATION_NAMES, destinations.map((d) => d.name));
    for (const key of Object.keys(PARK_SPECIES)) delete PARK_SPECIES[key];
    for (const d of destinations) if (d.species.length) PARK_SPECIES[d.slug] = d.species;

    replace(PACKAGES, data.journeys?.map(normalizeJourney));
    replace(TESTIMONIALS, data.testimonials?.map(normalizeTestimonial));
    replace(INSTAGRAM, data.moments?.map(normalizeMoment));
    replace(FESTIVALS, data.festivals?.map(normalizeFestival));
    replace(CULTURE_EXPERIENCES, data.culture_experiences?.map(normalizeExperience));
    replace(STAYS, data.stays?.map(normalizeStay));
    replace(ETIQUETTE, data.etiquette?.filter(Boolean));
    if (data.contact) Object.assign(CONTACT, data.contact);
    if (data.about) {
      replace(ABOUT_STORY, data.about.story?.filter(Boolean));
      replace(ABOUT_VALUES, data.about.values?.map((v) => ({ ...v, icon: v.icon || 'Heart' })));
      replace(ABOUT_STEPS, data.about.steps);
      replace(ABOUT_TEAM, data.about.team?.map((t) => ({ ...t, icon: t.icon || 'Compass' })));
    }
    return true;
  } catch (err) {
    console.warn('[Sasoba] Using built-in content:', err.message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Sends a "Plan your trip" enquiry to the admin inbox. */
export async function sendEnquiry(payload) {
  const res = await fetch(`${API_BASE}/public/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'We couldn’t send your message. Please try WhatsApp instead.');
  return data;
}
