import { motion } from 'framer-motion';
import { getIcon } from '../ui/icons.js';
import { fadeUp } from '../ui/Reveal.jsx';

/** Icon card used for cultural experiences. */
export default function ExperienceCard({ e }) {
  const Icon = getIcon(e.icon);
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group h-full rounded-3xl bg-white p-7 ring-1 ring-navy-900/5 transition-shadow hover:shadow-luxe">
      <motion.span whileHover={{ rotate: 12 }} className="bg-feather grid h-12 w-12 place-items-center rounded-2xl text-white">
        <Icon className="h-6 w-6" />
      </motion.span>
      <h3 className="mt-5 line-clamp-2 font-display text-2xl font-semibold break-words">{e.title}</h3>
      {e.text && <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-navy-800/65">{e.text}</p>}
    </motion.div>
  );
}
