import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PeacockLogo from '../components/ui/PeacockLogo.jsx';

export default function NotFound() {
  return (
    <section className="grid min-h-[85svh] place-items-center bg-navy-950 px-4 pt-28 pb-16 text-center text-white">
      <div className="flex flex-col items-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <PeacockLogo className="h-32 w-32" spin />
        </motion.div>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-sun">404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">This path wandered off</h1>
        <p className="mt-4 max-w-md text-white/65">The page you’re looking for doesn’t exist, but plenty of beautiful places do.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 text-sm font-semibold text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </section>
  );
}
