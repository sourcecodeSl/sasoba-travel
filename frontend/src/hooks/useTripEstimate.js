import { useMemo } from 'react';
import { BUILDER } from '../data/siteData.js';

const CHAUFFEUR_PER_DAY = 95; // private vehicle + guide, per group (USD)
const CHILD_FACTOR = 0.5;

/** Indicative USD budget range for the itinerary builder. */
export function useTripEstimate({ interests, duration, tier, adults, children }) {
  return useMemo(() => {
    const d = BUILDER.durations.find((x) => x.id === duration);
    const t = BUILDER.tiers.find((x) => x.id === tier);
    if (!d || !t) return null;

    const chosen = BUILDER.interests.filter((i) => interests.includes(i.id));
    const multiplier = chosen.length
      ? chosen.reduce((sum, i) => sum + i.multiplier, 0) / chosen.length
      : 1;

    const travellers = adults + children * CHILD_FACTOR;
    const total = (t.perDay * multiplier * travellers + CHAUFFEUR_PER_DAY) * d.days;
    const perPerson = total / Math.max(adults + children, 1);

    return {
      low: total * 0.9,
      high: total * 1.15,
      perPerson,
      days: d.days,
    };
  }, [interests, duration, tier, adults, children]);
}
