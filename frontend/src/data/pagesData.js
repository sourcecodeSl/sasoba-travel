// Content for the Safari, Cultural, Stays and About pages.
import { unsplash } from './siteData.js';

const place = (slug) => `/images/places/${slug}.jpg`;

// ── Wild & Safari ────────────────────────────────────────────
export const PARK_SPECIES = {
  yala: ['Leopard', 'Sloth bear', 'Elephant', 'Mugger crocodile'],
  wilpattu: ['Leopard', 'Sloth bear', 'Spotted deer', 'Painted stork'],
  udawalawe: ['Asian elephant', 'Water buffalo', 'Crested serpent eagle'],
  minneriya: ['Asian elephant', 'Toque macaque', 'Pelicans'],
  sinharaja: ['Blue magpie', 'Purple-faced langur', 'Green pit viper'],
  'horton-plains': ['Sambar deer', 'Whistling thrush', 'Bear monkey'],
  mirissa: ['Blue whale', 'Sperm whale', 'Spinner dolphin'],
  trincomalee: ['Blue whale', 'Reef sharks', 'Sea turtles'],
  kalpitiya: ['Spinner dolphin', 'Bottlenose dolphin', 'Sperm whale'],
  'arugam-bay': ['Elephant', 'Crocodile', 'Waterbirds'],
};

export const WILDLIFE_CALENDAR = [
  { species: 'Leopards', where: 'Yala · Wilpattu', months: [2, 3, 4, 5, 6, 7] },
  { species: 'The Elephant Gathering', where: 'Minneriya · Kaudulla', months: [7, 8, 9] },
  { species: 'Wild elephants', where: 'Udawalawe', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { species: 'Sloth bears', where: 'Yala · Wilpattu', months: [5, 6, 7] },
  { species: 'Blue whales (south)', where: 'Mirissa', months: [12, 1, 2, 3, 4] },
  { species: 'Blue whales (east)', where: 'Trincomalee', months: [5, 6, 7, 8] },
  { species: 'Spinner dolphins', where: 'Kalpitiya', months: [11, 12, 1, 2, 3] },
  { species: 'Migratory birds', where: 'Bundala · Kumana', months: [11, 12, 1, 2, 3, 4] },
];

export const SAFARI_EXPERIENCES = [
  { icon: 'Car', title: 'Private 4×4 game drives', text: 'Your own jeep, tracker and naturalist. No shared vehicles, no rushing.' },
  { icon: 'Tent', title: 'Luxury tented camps', text: 'Canvas suites with en-suite baths, bush dinners and campfires under the stars.' },
  { icon: 'Fish', title: 'Responsible whale watching', text: 'Small vessels, marine biologists on board and strict distance rules.' },
  { icon: 'Bird', title: 'Birding with experts', text: '34 endemic species. We pair you with an ornithologist for the best chances.' },
  { icon: 'Moon', title: 'Night walks', text: 'Rainforest after dark: tree frogs, lorises and glowing fungi.' },
  { icon: 'Leaf', title: 'Conservation visits', text: 'Meet the people protecting elephants, turtles and leopards.' },
];

// ── Cultural Escapes ─────────────────────────────────────────
export const FESTIVALS = [
  { month: 'January', name: 'Duruthu Perahera', place: 'Kelaniya', text: 'A torch-lit procession celebrating the Buddha’s first visit to Sri Lanka.' },
  { month: 'January', name: 'Thai Pongal', place: 'Jaffna & the east', text: 'The Tamil harvest festival: sweet rice boiled over as an offering to the sun.' },
  { month: 'April', name: 'Sinhala & Tamil New Year', place: 'Island-wide', text: 'Auspicious times, family feasts, oil lamps and village games.' },
  { month: 'May', name: 'Vesak', place: 'Island-wide', text: 'Lanterns, illuminated pandals and free food stalls mark the Buddha’s birth, enlightenment and passing.' },
  { month: 'June', name: 'Poson', place: 'Anuradhapura & Mihintale', text: 'Pilgrims in white celebrate the arrival of Buddhism on the island.' },
  { month: 'July–August', name: 'Esala Perahera', place: 'Kandy', text: 'Ten nights of dancers, drummers, fire-twirlers and caparisoned elephants.' },
  { month: 'August', name: 'Nallur Festival', place: 'Jaffna', text: 'A 25-day Hindu festival with chariot processions at Nallur Kovil.' },
  { month: 'October–November', name: 'Deepavali', place: 'Hill Country & north', text: 'The Hindu festival of lights, with oil lamps and sweets.' },
];

export const CULTURE_EXPERIENCES = [
  { icon: 'ChefHat', title: 'Village cooking class', text: 'Grind spices on a stone and cook rice and curry over a wood fire.' },
  { icon: 'Flower2', title: 'Authentic Ayurveda', text: 'Consultations and treatments with qualified Ayurvedic doctors.' },
  { icon: 'Coffee', title: 'Tea-maker for a day', text: 'Pluck, wither, roll and taste with a tea master.' },
  { icon: 'Palette', title: 'Mask & batik workshops', text: 'Traditional crafts with artisans in Ambalangoda and Kandy.' },
  { icon: 'Music', title: 'Kandyan drumming', text: 'A private lesson with a family of temple drummers.' },
  { icon: 'BookOpen', title: 'Scholar-led temple visits', text: 'Understand what you’re seeing with a historian at your side.' },
];

export const ETIQUETTE = [
  'Cover shoulders and knees at temples; remove shoes and hats before entering.',
  'Never pose with your back to a Buddha statue, and don’t touch statues.',
  'Walk clockwise around stupas and bodhi trees.',
  'Give and receive with your right hand.',
  'Ask before photographing people, monks or ceremonies.',
  'Clothing or tattoos showing the Buddha can cause serious offence.',
];

// ── Luxury Stays ─────────────────────────────────────────────
// Stay styles, not named hotels — the exact property is chosen for each guest.
export const STAYS = [
  {
    title: 'Colonial Planter’s Bungalow',
    location: 'Tea Country, Hatton',
    tier: 'boutique',
    priceFrom: 380,
    image: place('nuwara-eliya'),
    features: ['Personal butler', 'Log fires & high tea', 'Estate walks'],
    text: 'Restored 19th-century bungalows on working tea estates, with only a handful of rooms.',
  },
  {
    title: 'Clifftop Ocean Villa',
    location: 'Weligama & Mirissa',
    tier: 'luxury',
    priceFrom: 620,
    image: place('mirissa'),
    features: ['Infinity pool', 'Private chef', 'Whale-season views'],
    text: 'Architect-designed villas hanging over the Indian Ocean, fully staffed.',
  },
  {
    title: 'Luxury Tented Safari Camp',
    location: 'Edge of Yala',
    tier: 'eco',
    priceFrom: 540,
    image: place('yala'),
    features: ['Resident naturalist', 'Bush dinners', 'Solar-powered'],
    text: 'Canvas suites with private decks, a short drive from the park gate.',
  },
  {
    title: 'Fort Mansion Suite',
    location: 'Galle Fort',
    tier: 'boutique',
    priceFrom: 450,
    image: place('galle'),
    features: ['Colonial interiors', 'Courtyard pool', 'Walk to the ramparts'],
    text: 'Dutch-era merchants’ houses turned into intimate boutique hotels.',
  },
  {
    title: 'Rainforest Eco-Lodge',
    location: 'Sinharaja',
    tier: 'eco',
    priceFrom: 180,
    image: place('sinharaja'),
    features: ['Canopy views', 'Birding guides', 'Farm-to-table food'],
    text: 'Low-impact lodges run with local communities on the forest edge.',
  },
  {
    title: 'Lakeside Heritage Resort',
    location: 'Cultural Triangle',
    tier: 'luxury',
    priceFrom: 390,
    image: place('sigiriya'),
    features: ['Views of Sigiriya', 'Spa & pool', 'Wildlife on site'],
    text: 'Resorts built into the landscape around ancient reservoirs.',
  },
  {
    title: 'Garden Villa by the River',
    location: 'Bentota',
    tier: 'boutique',
    priceFrom: 310,
    image: place('bentota'),
    features: ['Tropical gardens', 'River & beach', 'Bawa-style design'],
    text: 'Villas in the tropical-modern style Geoffrey Bawa made famous.',
  },
  {
    title: 'Beachfront Ayurveda Retreat',
    location: 'South Coast',
    tier: 'luxury',
    priceFrom: 480,
    image: place('tangalle'),
    features: ['Doctor consultations', 'Daily treatments', 'Yoga pavilion'],
    text: 'Resident Ayurvedic doctors, personalised programmes and quiet beaches.',
  },
  {
    title: 'Hill-Country Hideaway',
    location: 'Kandy',
    tier: 'boutique',
    priceFrom: 260,
    image: place('kandy'),
    features: ['Valley views', 'Infinity pool', 'Close to the city'],
    text: 'Small hotels in the forested hills just above Kandy.',
  },
];

export const STAY_PROMISES = [
  { icon: 'Eye', title: 'Personally inspected', text: 'Our designers have stayed in every property we recommend.' },
  { icon: 'Sparkles', title: 'Privileges included', text: 'Upgrades, early check-in and welcome gifts wherever possible.' },
  { icon: 'Leaf', title: 'Responsibly run', text: 'We favour owners who employ locally and protect the land around them.' },
];

// ── About ────────────────────────────────────────────────────
export const ABOUT_STORY = [
  'In Sri Lanka the peacock (monara) is a symbol of grace, pride and beauty. Its feathers carry every colour of our island: the teal of the ocean, the green of the tea hills, the gold of temple roofs and the orange of a south-coast sunset.',
  'Sasoba was founded on the same idea. Every journey should unfold like a peacock’s fan: layered, colourful and full of moments that make you stop and stare.',
];

export const ABOUT_VALUES = [
  { icon: 'Heart', title: 'Genuine hospitality', text: 'Sri Lankans say “Ayubowan”, meaning “may you live long”. We treat every traveller as a guest in our home.' },
  { icon: 'Compass', title: 'Truly tailor-made', text: 'No fixed departures, no group coaches. Every day is planned around you.' },
  { icon: 'Leaf', title: 'Travel that gives back', text: 'Community-run experiences, carbon offsetting and conservation partners.' },
  { icon: 'ShieldCheck', title: 'Licensed & safe', text: 'SLTDA-licensed guides, insured vehicles and 24/7 support.' },
];

export const ABOUT_STEPS = [
  { title: 'Tell us your dream', text: 'Share your dates, interests and travel style by form, WhatsApp or a video call.' },
  { title: 'Receive your proposal', text: 'A journey designer sends a hand-crafted itinerary within 24 hours.' },
  { title: 'Refine together', text: 'We adjust hotels, pace and experiences until it feels perfect.' },
  { title: 'Travel with confidence', text: 'Your chauffeur-guide meets you at arrivals; our concierge is on call 24/7.' },
];

export const ABOUT_TEAM = [
  { icon: 'PenTool', role: 'Journey designers', text: 'Sri Lanka specialists who design each itinerary by hand.' },
  { icon: 'Car', role: 'Chauffeur-guides', text: 'SLTDA-licensed, multilingual drivers who become your local friend.' },
  { icon: 'Binoculars', role: 'Naturalists', text: 'Field experts for safaris, birding and rainforest walks.' },
  { icon: 'Headset', role: 'Concierge team', text: 'On WhatsApp day and night while you travel.' },
];

export const PAGE_IMAGES = {
  safari: place('yala'),
  cultural: place('anuradhapura'),
  stays: unsplash('photo-1546708973-b339540b5162', 2000),
  about: place('sigiriya'),
  journeys: place('ella'),
  destinations: place('galle'),
};
