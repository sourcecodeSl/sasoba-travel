import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CURRENCIES, LANGUAGES, TRANSLATIONS } from '../data/siteData.js';

const LocaleContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  // All prices in mock data are stored in USD and converted for display.
  const formatPrice = useCallback(
    (usd) => {
      const { rate, locale } = CURRENCIES[currency];
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(Math.round((usd * rate) / 10) * 10);
    },
    [currency]
  );

  const t = useCallback(
    (key) => TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key,
    [language]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, language, setLanguage, formatPrice, t, currencies: CURRENCIES, languages: LANGUAGES }),
    [currency, language, formatPrice, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <CurrencyProvider>');
  return ctx;
}
