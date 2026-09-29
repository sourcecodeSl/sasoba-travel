import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { INSTAGRAM } from '../../data/siteData.js';
import SmartImage from '../ui/SmartImage.jsx';
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
            text="Tag @sasobatravels to be featured — a live window into our travellers' adventures."
          />
          <a
            href="https://instagram.com/"
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
            <motion.li key={post.handle} variants={fadeUp} className={i % 2 === 1 ? 'lg:translate-y-8' : ''}>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl"
                aria-label={`Instagram post by ${post.handle}`}
              >
                <SmartImage src={post.image} alt="" className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-950/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <InstagramIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">{post.handle}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/80">
                    <Heart className="h-3.5 w-3.5 fill-sunset text-sunset" /> {post.likes.toLocaleString()}
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
