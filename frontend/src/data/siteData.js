// ─────────────────────────────────────────────────────────────
// Sasoba Travels — mock content. Replace with CMS / API data later.
// ─────────────────────────────────────────────────────────────

export const unsplash = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// TODO: replace with the real business contact details before launch.
export const CONTACT = {
  whatsapp: '94770000000', // international format, no "+" or spaces
  email: 'concierge@sasobatravels.com',
  phone: '+94 77 000 0000',
  address: 'Colombo 03, Sri Lanka',
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// Indicative rates vs USD — wire up to a live FX API in production.
export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB' },
  AUD: { symbol: 'A$', rate: 1.52, locale: 'en-AU' },
};

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
];

export const TRANSLATIONS = {
  en: {
    'nav.destinations': 'Destinations',
    'nav.journeys': 'Curated Journeys',
    'nav.safari': 'Wild & Safari',
    'nav.cultural': 'Cultural Escapes',
    'nav.stays': 'Luxury Stays',
    'nav.about': 'About Us',
    'cta.plan': 'Plan Your Bespoke Trip',
    'hero.eyebrow': 'Bespoke journeys across Ceylon & beyond',
    'hero.title1': 'Experience the World',
    'hero.title2': 'in Full Feather',
    'hero.subtitle':
      'Private, eco-luxury journeys crafted around you, guided by naturalists, chauffeured in comfort, and hosted with true Sri Lankan royal hospitality.',
    'search.cta': 'Explore Journeys',
  },
  de: {
    'nav.destinations': 'Reiseziele',
    'nav.journeys': 'Kuratierte Reisen',
    'nav.safari': 'Wildnis & Safari',
    'nav.cultural': 'Kulturreisen',
    'nav.stays': 'Luxusunterkünfte',
    'nav.about': 'Über uns',
    'cta.plan': 'Ihre Maßreise planen',
    'hero.eyebrow': 'Maßgeschneiderte Reisen durch Ceylon & die Welt',
    'hero.title1': 'Erleben Sie die Welt',
    'hero.title2': 'in voller Pracht',
    'hero.subtitle':
      'Private, nachhaltige Luxusreisen ganz nach Ihren Wünschen, mit Naturführern, eigenem Chauffeur und echter srilankischer Gastfreundschaft.',
    'search.cta': 'Reisen entdecken',
  },
  fr: {
    'nav.destinations': 'Destinations',
    'nav.journeys': 'Voyages sélectionnés',
    'nav.safari': 'Nature & Safari',
    'nav.cultural': 'Escapades culturelles',
    'nav.stays': 'Séjours de luxe',
    'nav.about': 'À propos',
    'cta.plan': 'Créer mon voyage sur mesure',
    'hero.eyebrow': 'Voyages sur mesure à Ceylan et au-delà',
    'hero.title1': 'Vivez le monde',
    'hero.title2': 'dans toute sa splendeur',
    'hero.subtitle':
      'Des voyages privés et éco-luxe conçus pour vous : guides naturalistes, chauffeur privé et véritable hospitalité royale sri-lankaise.',
    'search.cta': 'Explorer les voyages',
  },
};

export const NAV_LINKS = [
  { key: 'nav.destinations', to: '/destinations' },
  { key: 'nav.journeys', to: '/journeys' },
  { key: 'nav.safari', to: '/safari' },
  { key: 'nav.cultural', to: '/cultural' },
  { key: 'nav.stays', to: '/stays' },
  { key: 'nav.about', to: '/about' },
];

// Verified Unsplash photos. Swap in your own 4K drone footage / photography for launch.
const IMG = {
  sigiriya: 'photo-1612862862126-865765df2ded',
  nineArch: 'photo-1566296314736-6eaac1ca0cb9',
  mirissa: 'photo-1580910527739-556eb89f9d65',
  leopard: 'photo-1456926631375-92c8ce872def',
  southCoast: 'photo-1552055568-f8c4fb8c6320',
  palmBeach: 'photo-1586500036706-41963de24d8b',
  ecoLodge: 'photo-1605538032432-a9f0c8d9baac',
  resortPool: 'photo-1546708973-b339540b5162',
};

export const HERO_SLIDES = [
  { image: unsplash(IMG.sigiriya, 2400), place: 'Sigiriya Lion Rock', region: 'Cultural Triangle' },
  { image: unsplash(IMG.nineArch, 2400), place: 'Nine Arch Bridge, Ella', region: 'Hill Country' },
  { image: unsplash(IMG.mirissa, 2400), place: 'Coconut Tree Hill, Mirissa', region: 'Southern Coast' },
  { image: unsplash(IMG.leopard, 2400), place: 'Leopard Country, Yala', region: 'Wild Ceylon' },
  { image: unsplash(IMG.southCoast, 2400), place: 'Fishing Harbours of the South', region: 'Galle & Tangalle' },
];

export const DESTINATIONS = [
  'Sigiriya & Dambulla',
  'Kandy',
  'Nuwara Eliya',
  'Ella',
  'Yala National Park',
  'Mirissa',
  'Galle',
  'Tangalle',
  'Hiriketiya',
  'Trincomalee',
  'Sinharaja Rainforest',
  'Maldives Extension',
  'South India Extension',
];

export const TRAVEL_STYLES = [
  'Wildlife Safari',
  'Cultural',
  'Luxury Honeymoon',
  'Coastal Escape',
  'Wellness / Ayurveda',
];

export const WHY_US = [
  {
    icon: 'Compass',
    title: '100% Tailor-Made Itineraries',
    text: 'No group tours, no templates. Every route, stay and pace is designed around you by a dedicated journey designer.',
    stat: '1:1',
    statLabel: 'Personal designer',
  },
  {
    icon: 'ShieldCheck',
    title: 'Certified Chauffeur & Naturalist Guides',
    text: 'SLTDA-licensed chauffeur guides and field naturalists who know every leopard territory and temple legend.',
    stat: '15+',
    statLabel: 'Years average experience',
  },
  {
    icon: 'Leaf',
    title: 'Sustainable & Eco-Luxury Conscious',
    text: 'Carbon-offset transfers, community-owned lodges and conservation partners in every region we explore.',
    stat: '100%',
    statLabel: 'Carbon-offset journeys',
  },
  {
    icon: 'Headset',
    title: '24/7 Concierge Support on the Road',
    text: 'A real human on WhatsApp day and night for rebooking, restaurant tables, or a surprise birthday cake in the jungle.',
    stat: '24/7',
    statLabel: 'Live concierge',
  },
];

export const PACKAGES = [
  {
    id: 'royal-heritage',
    title: 'The Royal Heritage & Misty Hills',
    route: ['Sigiriya', 'Kandy', 'Nuwara Eliya'],
    destinations: ['sigiriya', 'dambulla', 'polonnaruwa', 'minneriya', 'kandy', 'nuwara-eliya'],
    days: 9,
    styles: ['Cultural', 'Luxury Honeymoon', 'Wellness / Ayurveda'],
    places: ['Sigiriya & Dambulla', 'Kandy', 'Nuwara Eliya', 'Ella'],
    priceFrom: 3450,
    rating: 5.0,
    reviews: 412,
    badge: 'Trending',
    image: unsplash(IMG.sigiriya, 1400),
    highlights: [
      'Private dawn climb of Sigiriya Lion Rock',
      'Temple of the Tooth evening puja with a scholar',
      'Scenic first-class train through tea country',
      'Colonial tea-planter bungalow with butler',
    ],
    itinerary: [
      { day: '1', title: 'Arrival & Negombo Lagoon', text: 'VIP airport meet-and-greet, sunset lagoon cruise and seafood dinner.' },
      { day: '2–3', title: 'Sigiriya & Dambulla', text: 'Dawn ascent of Lion Rock, cave temples of Dambulla, village bullock-cart and cookery session.' },
      { day: '4', title: 'Polonnaruwa by Bicycle', text: 'Cycle the ancient royal capital with an archaeologist; elephant safari at Minneriya.' },
      { day: '5–6', title: 'Kandy', text: 'Spice gardens, Royal Botanic Gardens at Peradeniya, private Temple of the Tooth puja.' },
      { day: '7–8', title: 'Nuwara Eliya', text: 'Train to the highlands, tea plucking with estate families, high tea at the planter’s bungalow.' },
      { day: '9', title: 'Departure', text: 'Leisurely transfer to Colombo with lunch at a heritage hotel.' },
    ],
  },
  {
    id: 'wild-ceylon',
    title: 'Wild Ceylon: Leopards, Whales & Rainforests',
    route: ['Yala', 'Mirissa', 'Sinharaja'],
    destinations: ['bentota', 'sinharaja', 'yala', 'mirissa', 'galle'],
    days: 11,
    styles: ['Wildlife Safari', 'Coastal Escape'],
    places: ['Yala National Park', 'Mirissa', 'Sinharaja Rainforest'],
    priceFrom: 4890,
    rating: 5.0,
    reviews: 287,
    badge: 'Exclusive',
    image: unsplash(IMG.leopard, 1400),
    highlights: [
      'Private 4x4 leopard safaris with a field naturalist',
      'Blue whale expedition on a marine-biologist-led vessel',
      'UNESCO Sinharaja rainforest trek for endemic birds',
      'Luxury tented camp on the edge of Yala',
    ],
    itinerary: [
      { day: '1–2', title: 'Colombo & Bentota', text: 'Arrive, unwind at a Geoffrey Bawa riverside villa, mangrove boat safari.' },
      { day: '3–5', title: 'Sinharaja Rainforest', text: 'Guided treks for blue magpies and endemic frogs; eco-lodge nights under the canopy.' },
      { day: '6–8', title: 'Yala National Park', text: 'Twice-daily private game drives in Block 1 and 5; bush breakfast; star-lit tented camp.' },
      { day: '9–10', title: 'Mirissa', text: 'Early-morning blue whale expedition, sea-turtle hatchery, clifftop villa sunsets.' },
      { day: '11', title: 'Departure', text: 'Expressway transfer to the airport with Galle Fort lunch en route.' },
    ],
  },
  {
    id: 'southern-bliss',
    title: 'Southern Bliss: Secret Beaches & Dutch Forts',
    route: ['Galle', 'Tangalle', 'Hiriketiya'],
    destinations: ['galle', 'tangalle', 'mirissa'],
    days: 8,
    styles: ['Coastal Escape', 'Luxury Honeymoon', 'Wellness / Ayurveda'],
    places: ['Galle', 'Tangalle', 'Hiriketiya', 'Mirissa', 'Maldives Extension'],
    priceFrom: 2980,
    rating: 5.0,
    reviews: 356,
    badge: 'Eco-Certified',
    image: unsplash(IMG.southCoast, 1400),
    highlights: [
      'Galle Fort walking tour with a local historian',
      'Private beach villa with infinity pool in Tangalle',
      'Surf lessons in the horseshoe bay of Hiriketiya',
      'Ayurvedic spa ritual and sunset catamaran',
    ],
    itinerary: [
      { day: '1–3', title: 'Galle Fort', text: 'Boutique fort mansion, ramparts at dusk, stilt fishermen and cinnamon island.' },
      { day: '4–6', title: 'Tangalle', text: 'Secluded beach villa, lagoon kayaking, Mulkirigala rock temple and private chef dinners.' },
      { day: '7', title: 'Hiriketiya', text: 'Surf, swim and café-hop in the south’s most beautiful little bay.' },
      { day: '8', title: 'Departure', text: 'Transfer to Colombo or extend to the Maldives.' },
    ],
  },
  {
    id: 'hills-to-hideaways',
    title: 'Ceylon Honeymoon: Hills to Hideaways',
    route: ['Kandy', 'Ella', 'Galle'],
    destinations: ['kandy', 'nuwara-eliya', 'ella', 'udawalawe', 'galle'],
    days: 12,
    styles: ['Luxury Honeymoon', 'Coastal Escape', 'Wellness / Ayurveda'],
    places: ['Kandy', 'Nuwara Eliya', 'Ella', 'Galle'],
    priceFrom: 4250,
    rating: 5.0,
    reviews: 198,
    badge: 'Exclusive',
    image: '/images/places/ella.jpg',
    highlights: [
      'Private carriage on the Kandy–Ella hill-country train',
      'Candle-lit dinner in a tea-estate bungalow',
      'Couples’ Ayurveda ritual',
      'Sunset on Galle Fort ramparts',
    ],
    itinerary: [
      { day: '1–2', title: 'Kandy', text: 'Lakeside boutique hotel, Temple of the Tooth evening puja and Peradeniya gardens.' },
      { day: '3–4', title: 'Tea Country', text: 'Scenic train to Nuwara Eliya, planter’s bungalow with butler, high tea on the lawn.' },
      { day: '5–6', title: 'Ella', text: 'Nine Arch Bridge, Little Adam’s Peak at sunrise and a couples’ cooking class.' },
      { day: '7', title: 'Udawalawe', text: 'Afternoon elephant safari on the way down to the coast.' },
      { day: '8–11', title: 'Galle & the South', text: 'Fort mansion suite, private rampart dinner and a sunset catamaran.' },
      { day: '12', title: 'Departure', text: 'Expressway transfer to the airport.' },
    ],
  },
  {
    id: 'east-and-ancient-north',
    title: 'East Coast & the Ancient North',
    route: ['Anuradhapura', 'Jaffna', 'Trincomalee'],
    destinations: ['anuradhapura', 'jaffna', 'trincomalee', 'pasikudah'],
    days: 10,
    styles: ['Cultural', 'Coastal Escape'],
    places: ['Anuradhapura', 'Jaffna', 'Trincomalee', 'Pasikudah'],
    priceFrom: 3180,
    rating: 4.9,
    reviews: 121,
    badge: 'Trending',
    image: '/images/places/trincomalee.jpg',
    highlights: [
      'Sacred city of Anuradhapura by bicycle',
      'Jaffna’s Tamil temples and food trail',
      'Snorkelling at Pigeon Island',
      'Calm waters of Pasikudah bay',
    ],
    itinerary: [
      { day: '1–2', title: 'Anuradhapura', text: 'Dagobas, the Sri Maha Bodhi and a sunset climb at Mihintale.' },
      { day: '3–4', title: 'Jaffna', text: 'Nallur Kovil at puja time, Jaffna Fort and a ferry to Nainativu island.' },
      { day: '5–7', title: 'Trincomalee', text: 'Nilaveli beach, Pigeon Island snorkelling and Koneswaram temple.' },
      { day: '8–9', title: 'Pasikudah', text: 'Slow beach days on the calm, shallow bay.' },
      { day: '10', title: 'Departure', text: 'Transfer to Colombo or fly by seaplane.' },
    ],
  },
  {
    id: 'family-wild-and-waves',
    title: 'Family Adventure: Wild & Waves',
    route: ['Sigiriya', 'Udawalawe', 'Bentota'],
    destinations: ['sigiriya', 'minneriya', 'kandy', 'udawalawe', 'bentota'],
    days: 11,
    styles: ['Wildlife Safari', 'Coastal Escape'],
    places: ['Sigiriya & Dambulla', 'Kandy', 'Udawalawe', 'Bentota'],
    priceFrom: 2890,
    rating: 5.0,
    reviews: 164,
    badge: 'Eco-Certified',
    image: '/images/places/udawalawe.jpg',
    highlights: [
      'Kid-friendly climb of Sigiriya',
      'Elephant safaris at Minneriya and Udawalawe',
      'Village cooking and bullock-cart ride',
      'River safari and turtle hatchery in Bentota',
    ],
    itinerary: [
      { day: '1–3', title: 'Sigiriya', text: 'Lion Rock, village safari and an elephant gathering at Minneriya.' },
      { day: '4–5', title: 'Kandy', text: 'Kandyan dance show, spice garden and the Temple of the Tooth.' },
      { day: '6–7', title: 'Udawalawe', text: 'Jeep safari and feeding time at the Elephant Transit Home.' },
      { day: '8–10', title: 'Bentota', text: 'Beach resort, mangrove river safari and a turtle hatchery visit.' },
      { day: '11', title: 'Departure', text: 'Short transfer to the airport.' },
    ],
  },
];

export const findPackage = (id) => PACKAGES.find((p) => p.id === id);

export const BUILDER = {
  interests: [
    { id: 'beaches', label: 'Beaches', icon: 'Waves', multiplier: 1.0 },
    { id: 'wildlife', label: 'Wildlife', icon: 'PawPrint', multiplier: 1.15 },
    { id: 'tea', label: 'Tea Trails', icon: 'Leaf', multiplier: 1.05 },
    { id: 'ancient', label: 'Ancient Cities', icon: 'Landmark', multiplier: 1.08 },
  ],
  durations: [
    { id: 'short', label: '5–7 days', days: 6 },
    { id: 'medium', label: '8–12 days', days: 10 },
    { id: 'long', label: '14+ days', days: 15 },
  ],
  tiers: [
    { id: 'boutique', label: 'Boutique Villas', text: 'Characterful, design-led hideaways', perDay: 260, icon: 'Home' },
    { id: 'luxury', label: '5-Star Luxury', text: 'Iconic resorts with butler service', perDay: 420, icon: 'Crown' },
    { id: 'eco', label: 'Eco-Lodges', text: 'Low-impact stays deep in nature', perDay: 210, icon: 'TreePine' },
  ],
};

export const TESTIMONIALS = [
  {
    name: 'Charlotte & James Whitmore',
    country: 'United Kingdom',
    flag: '🇬🇧',
    trip: 'Luxury Honeymoon · 12 days',
    quote:
      'Every single detail felt considered. A private dinner on the ramparts of Galle Fort was the most romantic evening of our lives.',
    image: unsplash(IMG.palmBeach, 900),
  },
  {
    name: 'Lukas Hoffmann',
    country: 'Germany',
    flag: '🇩🇪',
    trip: 'Wild Ceylon · 11 days',
    quote:
      'Our naturalist found us three leopards in one morning. The organisation was flawless: pünktlich, professional and warm.',
    image: unsplash(IMG.leopard, 900),
  },
  {
    name: 'Amélie Laurent',
    country: 'France',
    flag: '🇫🇷',
    trip: 'Cultural Escape · 9 days',
    quote:
      'Sigiriya at sunrise with nobody else around. Sasoba understood exactly the kind of journey I dreamed of.',
    image: unsplash(IMG.sigiriya, 900),
  },
  {
    name: 'The Martinez Family',
    country: 'United States',
    flag: '🇺🇸',
    trip: 'Family Adventure · 14 days',
    quote:
      'Our kids still talk about the whales and the tuk-tuk ride through Kandy. The 24/7 WhatsApp concierge was a lifesaver.',
    image: unsplash(IMG.mirissa, 900),
  },
  {
    name: 'Olivia Chen',
    country: 'Australia',
    flag: '🇦🇺',
    trip: 'Wellness & Ayurveda · 10 days',
    quote:
      'I came home rested in a way I hadn’t felt in years. The Ayurveda retreat and tea-country train were pure magic.',
    image: unsplash(IMG.resortPool, 900),
  },
];

export const INSTAGRAM = [
  { image: unsplash(IMG.nineArch, 700), handle: '@wanderwithmia', likes: 2841 },
  { image: unsplash(IMG.palmBeach, 700), handle: '@thewhitmores', likes: 1932 },
  { image: unsplash(IMG.leopard, 700), handle: '@lukas.wild', likes: 4210 },
  { image: unsplash(IMG.ecoLodge, 700), handle: '@olivia.slowtravel', likes: 1577 },
  { image: unsplash(IMG.sigiriya, 700), handle: '@amelie.voyage', likes: 3368 },
  { image: unsplash(IMG.mirissa, 700), handle: '@bluewhalebound', likes: 2204 },
];

export const FOOTER_LINKS = {
  Journeys: [
    { label: 'Signature Journeys', to: '/journeys' },
    { label: 'Wild & Safari', to: '/safari' },
    { label: 'Cultural Escapes', to: '/cultural' },
    { label: 'Luxury Stays', to: '/stays' },
    { label: 'Build Your Own', to: '/#builder' },
  ],
  'Destination Guides': [
    { label: 'Sigiriya', to: '/destinations/sigiriya' },
    { label: 'Kandy', to: '/destinations/kandy' },
    { label: 'Ella', to: '/destinations/ella' },
    { label: 'Yala National Park', to: '/destinations/yala' },
    { label: 'Galle Fort', to: '/destinations/galle' },
    { label: 'All destinations', to: '/destinations' },
  ],
  Company: [
    { label: 'About Sasoba', to: '/about' },
    { label: 'How it works', to: '/about' },
    { label: 'Traveller stories', to: '/#stories' },
    { label: 'Contact', to: '/about' },
  ],
};
