import { motion } from 'framer-motion';
import { CONTACT, INSTAGRAM } from '../../data/siteData.js';
import MomentTile from '../cards/MomentTile.jsx';
import { InstagramIcon } from '../ui/BrandIcons.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { fadeUp, stagger } from '../ui/Reveal.jsx';

// Mock feed — connect the Instagram Graph API (or a widget like Behold/EmbedSocial) for live posts.
export default function InstagramGrid() {
  return (
    <section className="bg-porcelain py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="#SasobaMoments"
            title="Moments from"
            accent="the road"
            text="Tag @sasobatravels to be featured. A live window into our travellers' adventures."
          />
          <a
            href={CONTACT.instagram || 'https://instagram.com/'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-sunset via-[#d62976] to-[#962fbf] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            <InstagramIcon className="h-4 w-4" /> Follow @sasobatravels
          </a>
        </div>

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {INSTAGRAM.map((post, i) => (
            <motion.li key={post.id ?? post.handle} variants={fadeUp} className={i % 2 === 1 ? 'lg:translate-y-8' : ''}>
              <MomentTile post={post} href={post.link || CONTACT.instagram || 'https://instagram.com/'} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
