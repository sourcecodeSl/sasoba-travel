import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBody } from '../../hooks/useLockBody.js';
import EnquiryForm from './EnquiryForm.jsx';

export default function EnquiryModal({ open, onClose, title = 'Plan your trip', subtitle, ...formProps }) {
  const close = useCallback(() => onClose(), [onClose]);
  useLockBody(open, close);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-navy-950/70 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-cream p-6 shadow-luxe sm:rounded-[2rem] sm:p-8"
          >
            <button type="button" onClick={close} aria-label="Close" className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-navy-900/5 hover:bg-navy-900/10">
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">Plan your trip</p>
            <h3 className="mt-2 pr-10 font-display text-3xl font-semibold text-navy-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-navy-800/60">{subtitle}</p>}
            <div className="mt-6">
              <EnquiryForm {...formProps} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
