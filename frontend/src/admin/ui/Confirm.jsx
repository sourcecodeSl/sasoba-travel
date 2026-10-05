import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(async () => false);

/** `await confirm({ title, text, action })` resolves true when the user confirms. */
export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    (o) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setOpts(o);
      }),
    []
  );
  const done = (v) => {
    resolver.current?.(v);
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {opts && (
          <motion.div
            className="fixed inset-0 z-[150] grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => done(false)}
            onKeyDown={(e) => e.key === 'Escape' && done(false)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-luxe"
            >
              <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${opts.danger === false ? 'bg-teal/10 text-teal' : 'bg-sunset/10 text-sunset'}`}>
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy-900">{opts.title}</h3>
              {opts.text && <p className="mt-2 text-sm text-navy-800/65">{opts.text}</p>}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => done(false)} className="rounded-full bg-navy-900/5 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-900/10">
                  Cancel
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={() => done(true)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white ${opts.danger === false ? 'bg-teal hover:brightness-110' : 'bg-sunset hover:brightness-110'}`}
                >
                  {opts.action || 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
