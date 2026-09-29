import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';
import WhatsAppFloat from '../WhatsAppFloat.jsx';
import Preloader from '../ui/Preloader.jsx';
import ScrollProgress from '../ui/ScrollProgress.jsx';

/** Scrolls to the top on page change, or to `#section` when the link has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // Wait for the incoming page to mount after the transition.
    let tries = 0;
    const id = setInterval(() => {
      const el = document.getElementById(hash.slice(1));
      if (el || ++tries > 20) {
        clearInterval(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
    return () => clearInterval(id);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <ScrollManager />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
