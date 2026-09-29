import { useState } from 'react';
import Hero from '../components/hero/Hero.jsx';
import DestinationsMarquee from '../components/DestinationsMarquee.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Packages from '../components/packages/Packages.jsx';
import TripBuilder from '../components/builder/TripBuilder.jsx';
import Testimonials from '../components/social/Testimonials.jsx';
import InstagramGrid from '../components/social/InstagramGrid.jsx';

export default function Home() {
  const [search, setSearch] = useState(null);

  const handleSearch = (query) => {
    setSearch(query);
    requestAnimationFrame(() => document.getElementById('journeys')?.scrollIntoView({ behavior: 'smooth' }));
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <DestinationsMarquee />
      <WhyUs />
      <Packages search={search} onClearSearch={() => setSearch(null)} />
      <TripBuilder />
      <Testimonials />
      <InstagramGrid />
    </>
  );
}
