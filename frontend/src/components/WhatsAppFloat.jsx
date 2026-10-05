import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { whatsappLink } from '../data/siteData.js';
import { WhatsAppIcon } from './ui/BrandIcons.jsx';
import { INTRO_DELAY } from './ui/Preloader.jsx';

export default function WhatsAppFloat() {
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setBubble(true), 6000);
    const hide = setTimeout(() => setBubble(false), 18000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative hidden max-w-64 rounded-2xl sm:block rounded-br-sm bg-white p-4 pr-8 text-sm text-navy-900 shadow-luxe"
          >
            <button
              type="button"
              onClick={() => setBubble(false)}
              aria-label="Dismiss"
              className="absolute top-2 right-2 text-navy-900/40 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="font-semibold">Ayubowan! 🙏</p>
            <p className="mt-1 text-navy-800/70">Our concierge is online. Ask us anything about your Sri Lanka journey.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a
        href={whatsappLink("Hello Sasoba Travels! I'd like help planning a trip.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with our concierge on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: INTRO_DELAY + 1, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-[0_15px_35px_-10px_rgb(37_211_102/0.7)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <WhatsAppIcon className="relative h-7 w-7" />
        <span className="relative hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-500 group-hover:max-w-40 group-hover:pr-2 sm:inline">
          WhatsApp Concierge
        </span>
      </motion.a>
    </div>
  );
}
