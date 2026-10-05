// Fills in safe defaults so content added in the admin can never break a page:
// empty lists become [], missing numbers get sensible values, unknown badges fall back.

const arr = (v) => (Array.isArray(v) ? v.filter((x) => x !== null && x !== undefined && x !== '') : []);
const num = (v, d) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
const str = (v, d = '') => (typeof v === 'string' ? v : v == null ? d : String(v));

export const BADGES = ['Trending', 'Exclusive', 'Eco-Certified'];

export const normalizeDestination = (d = {}) => ({
  ...d,
  slug: str(d.slug, 'new-destination'),
  name: str(d.name, 'New destination'),
  region: str(d.region, 'Sri Lanka'),
  tagline: str(d.tagline),
  intro: str(d.intro),
  categories: arr(d.categories),
  highlights: arr(d.highlights),
  experiences: arr(d.experiences).filter((e) => e.title || e.text),
  species: arr(d.species),
  bestMonths: arr(d.bestMonths).map(Number).filter((m) => m >= 1 && m <= 12),
  idealStay: str(d.idealStay, 'Flexible'),
  fromColombo: str(d.fromColombo, '—'),
  image: str(d.image),
  credit: d.credit && (d.credit.author || d.credit.source) ? d.credit : null,
  unesco: Boolean(d.unesco),
});

export const normalizeJourney = (p = {}) => ({
  ...p,
  id: str(p.id ?? p.slug, 'new-journey'),
  title: str(p.title, 'New journey'),
  days: Math.max(1, num(p.days, 1)),
  priceFrom: num(p.priceFrom, 0),
  rating: Math.min(5, Math.max(0, num(p.rating, 5))),
  reviews: num(p.reviews, 0),
  badge: BADGES.includes(p.badge) ? p.badge : 'Exclusive',
  route: arr(p.route),
  destinations: arr(p.destinations),
  styles: arr(p.styles),
  places: arr(p.places),
  highlights: arr(p.highlights),
  itinerary: arr(p.itinerary).filter((s) => s.title || s.text),
  image: str(p.image),
});

export const normalizeTestimonial = (t = {}) => ({
  ...t,
  name: str(t.name, 'Guest'),
  quote: str(t.quote),
  trip: str(t.trip),
  country: str(t.country),
  flag: str(t.flag),
  image: str(t.image),
  rating: Math.min(5, Math.max(1, num(t.rating, 5))),
});

export const normalizeMoment = (m = {}) => ({ ...m, image: str(m.image), handle: str(m.handle, '@sasobatravels'), likes: num(m.likes, 0) });

export const normalizeStay = (s = {}) => ({
  ...s,
  title: str(s.title, 'New stay'),
  location: str(s.location),
  tier: ['boutique', 'luxury', 'eco'].includes(s.tier) ? s.tier : 'boutique',
  priceFrom: num(s.priceFrom, 0),
  features: arr(s.features),
  text: str(s.text),
  image: str(s.image),
});

export const normalizeFestival = (f = {}) => ({ ...f, name: str(f.name, 'Festival'), month: str(f.month), place: str(f.place), text: str(f.text) });
export const normalizeExperience = (e = {}) => ({ ...e, title: str(e.title, 'Experience'), text: str(e.text), icon: str(e.icon, 'Sparkles') });
