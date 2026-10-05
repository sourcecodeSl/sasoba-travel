import DestinationCard from '../components/cards/DestinationCard.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';
import StayCard from '../components/cards/StayCard.jsx';
import TestimonialCard from '../components/cards/TestimonialCard.jsx';
import MomentTile from '../components/cards/MomentTile.jsx';
import FestivalCard from '../components/cards/FestivalCard.jsx';
import ExperienceCard from '../components/cards/ExperienceCard.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import {
  normalizeDestination,
  normalizeExperience,
  normalizeFestival,
  normalizeJourney,
  normalizeMoment,
  normalizeStay,
  normalizeTestimonial,
} from '../data/normalize.js';

/** Miniature of the full-width page banner, to check how the photo crops there. */
function Banner({ image, title, subtitle }) {
  return (
    <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-navy-950">
      <SmartImage src={image} alt="" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/30" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="line-clamp-2 font-display text-2xl leading-tight font-semibold text-white">{title}</p>
        {subtitle && <p className="text-feather mt-0.5 line-clamp-1 font-display text-base italic">{subtitle}</p>}
      </div>
    </div>
  );
}

/**
 * How each content type appears on the website. `views` are rendered with the real components,
 * so the preview always matches the live design.
 */
export const PREVIEWS = {
  testimonials: {
    views: [
      {
        label: 'Home page · Traveller stories carousel',
        dark: true,
        render: (i) => (
          <div className="mx-auto h-[26rem] w-[23rem] max-w-full">
            <TestimonialCard t={normalizeTestimonial(i)} focusable={false} />
          </div>
        ),
      },
    ],
  },
  moments: {
    views: [
      {
        label: 'Home page · #SasobaMoments grid (normal and on hover)',
        render: (i) => (
          <div className="grid grid-cols-2 gap-3">
            <MomentTile post={normalizeMoment(i)} />
            <MomentTile post={normalizeMoment(i)} forceHover />
          </div>
        ),
      },
    ],
  },
  destinations: {
    views: [
      { label: 'Destinations page · card', render: (i) => <div className="mx-auto w-[22rem] max-w-full"><DestinationCard d={normalizeDestination(i)} /></div> },
      { label: 'Destination guide · page banner', render: (i) => <Banner image={i.image} title={i.name || 'New destination'} subtitle={i.tagline} /> },
    ],
  },
  journeys: {
    views: [
      { label: 'Curated Journeys · card', dark: true, render: (i) => <div className="mx-auto w-[22rem] max-w-full"><JourneyCard pkg={normalizeJourney(i)} /></div> },
      { label: 'Journey page · banner', render: (i) => <Banner image={i.image} title={i.title || 'New journey'} subtitle={i.days ? `${i.days} days` : ''} /> },
    ],
  },
  stays: {
    views: [{ label: 'Luxury Stays · card', render: (i) => <div className="mx-auto w-[22rem] max-w-full"><StayCard s={normalizeStay(i)} /></div> }],
  },
  festivals: {
    views: [{ label: 'Cultural Escapes · festival timeline', dark: true, render: (i) => <FestivalCard f={normalizeFestival(i)} /> }],
  },
  culture_experiences: {
    views: [{ label: 'Cultural Escapes · experience card', render: (i) => <div className="mx-auto w-[22rem] max-w-full"><ExperienceCard e={normalizeExperience(i)} /></div> }],
  },
};
