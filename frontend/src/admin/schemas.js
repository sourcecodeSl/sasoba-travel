import { CATEGORIES, REGIONS } from '../data/destinations.js';
import { BUILDER, TRAVEL_STYLES } from '../data/siteData.js';

/**
 * Crop frames: the exact shape each photo is shown in on the website.
 * `safe` marks the lower part of the image that sits under titles/text.
 */
export const FRAMES = {
  story: { aspect: 15 / 16, width: 1200, label: 'Travel story card (almost square)', safe: '58%' },
  moment: { aspect: 1, width: 1080, label: 'Square #SasobaMoments tile' },
  destination: { aspect: 16 / 10, width: 2000, label: 'Destination card and page banner (wide)', safe: '35%' },
  journey: { aspect: 3 / 2, width: 2000, label: 'Journey cards and banner. Keep the subject near the centre', safe: '45%' },
  stay: { aspect: 16 / 10, width: 1600, label: 'Luxury stay card (wide)' },
};

const textItem = [
  { key: 'title', label: 'Title', span: 'full' },
  { key: 'text', label: 'Description', type: 'textarea', rows: 2, span: 'full' },
];

/**
 * Content types managed in the admin. `list` controls the table, `sections` the editor.
 * Field types: text, textarea, number, select, chips, toggle, image, list, objects, months, icon, group, email, url.
 */
export const COLLECTIONS = {
  testimonials: {
    title: 'Travel Stories',
    singular: 'story',
    description: 'Traveller testimonials shown in the “Told by those who flew with us” carousel on the home page.',
    list: { image: 'image', title: 'name', subtitle: (i) => [i.flag, i.country, i.trip].filter(Boolean).join(' · ') },
    sections: [
      {
        title: 'Traveller',
        fields: [
          { key: 'name', label: 'Name', required: true, placeholder: 'Charlotte & James Whitmore', max: 40 },
          { key: 'country', label: 'Country', placeholder: 'United Kingdom', max: 24 },
          { key: 'flag', label: 'Flag emoji', placeholder: '🇬🇧', hint: 'Win + . opens the emoji panel' },
          { key: 'trip', label: 'Trip', placeholder: 'Luxury Honeymoon · 12 days', max: 40 },
          { key: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5, step: 0.5 },
        ],
      },
      {
        title: 'Story',
        fields: [
          { key: 'quote', label: 'Quote', type: 'textarea', required: true, rows: 4, span: 'full', max: 200 },
          { key: 'image', label: 'Background photo', type: 'image', span: 'full', frame: FRAMES.story },
          { key: 'video', label: 'Video URL (optional)', type: 'url', placeholder: 'https://…/story.mp4', hint: 'Plays when the story is opened', span: 'full' },
        ],
      },
    ],
  },

  moments: {
    title: 'Sasoba Moments',
    singular: 'moment',
    description: 'The #SasobaMoments photo grid on the home page.',
    list: { image: 'image', title: (i) => i.handle || 'Untitled moment', subtitle: (i) => (i.likes ? `♥ ${i.likes.toLocaleString()}` : i.caption || '') },
    sections: [
      {
        title: 'Moment',
        fields: [
          { key: 'image', label: 'Photo', type: 'image', required: true, span: 'full', frame: FRAMES.moment },
          { key: 'handle', label: 'Instagram handle', placeholder: '@wanderwithmia', max: 22 },
          { key: 'likes', label: 'Likes', type: 'number', min: 0 },
          { key: 'link', label: 'Post link', type: 'url', placeholder: 'https://instagram.com/p/…', span: 'full' },
          { key: 'caption', label: 'Caption (used as image description)', span: 'full', max: 100 },
        ],
      },
    ],
  },

  destinations: {
    title: 'Destinations',
    singular: 'destination',
    description: 'Every place on the Destinations page, with its own guide page.',
    list: { image: 'image', title: 'name', subtitle: (i) => `${i.region} · ${(i.categories || []).join(', ')}`, badge: (i) => (i.unesco ? 'UNESCO' : null) },
    preview: (i) => `/destinations/${i.slug}`,
    sections: [
      {
        title: 'Basics',
        fields: [
          { key: 'name', label: 'Name', required: true, placeholder: 'Sigiriya', max: 28 },
          { key: 'slug', label: 'URL slug', required: true, slugFrom: 'name', hint: '/destinations/your-slug' },
          { key: 'region', label: 'Region', type: 'select', options: REGIONS, required: true },
          { key: 'tagline', label: 'Tagline', placeholder: 'The Lion Rock fortress in the sky', max: 45 },
          { key: 'categories', label: 'Experience types', type: 'chips', options: CATEGORIES, span: 'full' },
          { key: 'unesco', label: 'UNESCO', type: 'toggle', toggleLabel: 'UNESCO World Heritage Site' },
        ],
      },
      {
        title: 'Photo',
        fields: [
          { key: 'image', label: 'Main photo', type: 'image', span: 'full', frame: FRAMES.destination },
          {
            key: 'credit',
            label: 'Photo credit (required for Creative Commons photos)',
            type: 'group',
            span: 'full',
            fields: [
              { key: 'author', label: 'Author' },
              { key: 'license', label: 'Licence', placeholder: 'CC BY-SA 4.0' },
              { key: 'source', label: 'Source link', type: 'url' },
            ],
          },
        ],
      },
      {
        title: 'Guide',
        fields: [
          { key: 'intro', label: 'Introduction', type: 'textarea', rows: 5, span: 'full', max: 420 },
          { key: 'highlights', label: 'Highlights', type: 'list', placeholder: 'Sunrise climb before the crowds', span: 'full' },
          { key: 'experiences', label: 'Sasoba experiences', type: 'objects', fields: textItem, itemLabel: 'Experience', span: 'full' },
          { key: 'species', label: 'Wildlife you might see', type: 'list', placeholder: 'Leopard', span: 'full', hint: 'Shown on wildlife destinations' },
        ],
      },
      {
        title: 'Planning',
        fields: [
          { key: 'bestMonths', label: 'Best months to visit', type: 'months', span: 'full' },
          { key: 'idealStay', label: 'Ideal stay', placeholder: '2–3 nights', max: 28 },
          { key: 'fromColombo', label: 'Travel time from Colombo', placeholder: '≈ 4 h', max: 14 },
          { key: 'note', label: 'Travel note (optional)', placeholder: 'Block 1 usually closes for part of September–October.', span: 'full', max: 120 },
        ],
      },
    ],
  },

  journeys: {
    title: 'Curated Journeys',
    singular: 'journey',
    description: 'Signature itineraries shown on the home page and the Curated Journeys page.',
    list: { image: 'image', title: 'title', subtitle: (i) => `${i.days} days · from $${Number(i.priceFrom || 0).toLocaleString()}`, badge: 'badge' },
    preview: (i) => `/journeys/${i.slug}`,
    sections: [
      {
        title: 'Basics',
        fields: [
          { key: 'title', label: 'Title', required: true, placeholder: 'The Royal Heritage & Misty Hills', span: 'full', max: 50 },
          { key: 'slug', label: 'URL slug', required: true, slugFrom: 'title', hint: '/journeys/your-slug' },
          { key: 'badge', label: 'Badge', type: 'select', options: ['Trending', 'Exclusive', 'Eco-Certified'] },
          { key: 'days', label: 'Days', type: 'number', min: 1, required: true },
          { key: 'priceFrom', label: 'Price from (USD per person)', type: 'number', min: 0 },
          { key: 'rating', label: 'Rating', type: 'number', min: 0, max: 5, step: 0.1 },
          { key: 'reviews', label: 'Number of reviews', type: 'number', min: 0 },
          { key: 'styles', label: 'Travel styles', type: 'chips', options: TRAVEL_STYLES, span: 'full', hint: 'Used by the home-page search' },
        ],
      },
      { title: 'Photo', fields: [{ key: 'image', label: 'Main photo', type: 'image', span: 'full', frame: FRAMES.journey }] },
      {
        title: 'Route',
        fields: [
          { key: 'route', label: 'Route stops (shown on cards)', type: 'list', placeholder: 'Sigiriya', span: 'full' },
          { key: 'destinations', label: 'Linked destination guides', type: 'chips', optionsFrom: 'destinations', span: 'full' },
          { key: 'places', label: 'Search keywords (places)', type: 'list', placeholder: 'Kandy', span: 'full', hint: 'Matched by the hero search box' },
        ],
      },
      {
        title: 'Itinerary',
        fields: [
          { key: 'highlights', label: 'Highlights', type: 'list', placeholder: 'Private dawn climb of Sigiriya', span: 'full' },
          {
            key: 'itinerary',
            label: 'Day by day',
            type: 'objects',
            itemLabel: 'Day',
            span: 'full',
            fields: [
              { key: 'day', label: 'Day(s)', placeholder: '2–3', span: 'third' },
              { key: 'title', label: 'Title', placeholder: 'Sigiriya & Dambulla', span: 'third' },
              { key: 'text', label: 'Description', type: 'textarea', rows: 2, span: 'full' },
            ],
          },
        ],
      },
    ],
  },

  festivals: {
    title: 'Festivals',
    singular: 'festival',
    description: 'The “A year of celebration” timeline on the Cultural Escapes page.',
    list: { title: 'name', subtitle: (i) => `${i.month} · ${i.place || ''}` },
    sections: [
      {
        title: 'Festival',
        fields: [
          { key: 'name', label: 'Name', required: true, placeholder: 'Esala Perahera', max: 32 },
          { key: 'month', label: 'Month(s)', required: true, placeholder: 'July–August' },
          { key: 'place', label: 'Place', placeholder: 'Kandy', span: 'full' },
          { key: 'text', label: 'Description', type: 'textarea', rows: 3, span: 'full', max: 160 },
        ],
      },
    ],
  },

  culture_experiences: {
    title: 'Cultural Experiences',
    singular: 'experience',
    description: 'The “Live the culture” cards on the Cultural Escapes page.',
    list: { icon: 'icon', title: 'title', subtitle: 'text' },
    sections: [
      {
        title: 'Experience',
        fields: [
          { key: 'title', label: 'Title', required: true, placeholder: 'Village cooking class', span: 'full', max: 30 },
          { key: 'text', label: 'Description', type: 'textarea', rows: 3, span: 'full', max: 120 },
          { key: 'icon', label: 'Icon', type: 'icon', span: 'full' },
        ],
      },
    ],
  },

  stays: {
    title: 'Luxury Stays',
    singular: 'stay',
    description: 'Stay styles on the Luxury Stays page, filterable by tier.',
    list: {
      image: 'image',
      title: 'title',
      subtitle: (i) => `${i.location || ''} · ${BUILDER.tiers.find((t) => t.id === i.tier)?.label || i.tier}`,
      badge: (i) => (i.priceFrom ? `$${i.priceFrom}/night` : null),
    },
    sections: [
      {
        title: 'Stay',
        fields: [
          { key: 'title', label: 'Title', required: true, placeholder: 'Colonial Planter’s Bungalow', span: 'full', max: 34 },
          { key: 'location', label: 'Location', placeholder: 'Tea Country, Hatton', max: 28 },
          { key: 'tier', label: 'Tier', type: 'select', required: true, options: BUILDER.tiers.map((t) => ({ value: t.id, label: t.label })) },
          { key: 'priceFrom', label: 'Price from (USD / night)', type: 'number', min: 0 },
          { key: 'text', label: 'Description', type: 'textarea', rows: 3, span: 'full', max: 140 },
          { key: 'features', label: 'Features (first 4 are shown)', type: 'list', placeholder: 'Personal butler', span: 'full' },
          { key: 'image', label: 'Photo', type: 'image', span: 'full', frame: FRAMES.stay },
        ],
      },
    ],
  },
};

export const SETTINGS = {
  contact: {
    title: 'Contact Details',
    description: 'Used across the whole website: WhatsApp buttons, footer, enquiry emails and social links.',
    sections: [
      {
        title: 'How guests reach you',
        fields: [
          { key: 'whatsapp', label: 'WhatsApp number', placeholder: '94771234567', hint: 'Country code, digits only' },
          { key: 'phone', label: 'Phone (as displayed)', placeholder: '+94 77 123 4567' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'concierge@sasobatravels.com' },
          { key: 'hours', label: 'Availability', placeholder: 'Our concierge replies 24/7 on WhatsApp' },
          { key: 'address', label: 'Address', type: 'textarea', rows: 2, span: 'full' },
        ],
      },
      {
        title: 'Social media',
        fields: [
          { key: 'instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/sasobatravels' },
          { key: 'facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/…' },
          { key: 'youtube', label: 'YouTube', type: 'url', placeholder: 'https://youtube.com/@…' },
        ],
      },
    ],
  },
  about: {
    title: 'About Us',
    description: 'The story, values, process and team on the About Us page.',
    sections: [
      { title: 'Our story', fields: [{ key: 'story', label: 'Paragraphs', type: 'list', multiline: true, span: 'full' }] },
      {
        title: 'Values',
        fields: [
          {
            key: 'values',
            label: 'What we believe',
            type: 'objects',
            itemLabel: 'Value',
            span: 'full',
            fields: [...textItem, { key: 'icon', label: 'Icon', type: 'icon', span: 'full' }],
          },
        ],
      },
      { title: 'How it works', fields: [{ key: 'steps', label: 'Steps', type: 'objects', itemLabel: 'Step', fields: textItem, span: 'full' }] },
      {
        title: 'Team',
        fields: [
          {
            key: 'team',
            label: 'Team roles',
            type: 'objects',
            itemLabel: 'Role',
            span: 'full',
            fields: [
              { key: 'role', label: 'Role', span: 'full' },
              { key: 'text', label: 'Description', type: 'textarea', rows: 2, span: 'full' },
              { key: 'icon', label: 'Icon', type: 'icon', span: 'full' },
            ],
          },
        ],
      },
    ],
  },
  etiquette: {
    title: 'Temple Etiquette',
    description: 'The etiquette tips box on the Cultural Escapes page.',
    isList: true,
    sections: [{ title: 'Tips', fields: [{ key: 'items', label: 'Tips', type: 'list', multiline: true, span: 'full' }] }],
  },
};

export const allFields = (sections) => sections.flatMap((s) => s.fields);

export const slugify = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
