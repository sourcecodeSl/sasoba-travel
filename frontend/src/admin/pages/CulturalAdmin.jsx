import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarHeart, HandHeart, ScrollText } from 'lucide-react';
import PageHeader from '../ui/PageHeader.jsx';
import CollectionPage from './CollectionPage.jsx';
import SettingsPage from './SettingsPage.jsx';

const TABS = [
  { id: 'festivals', label: 'Festivals', icon: CalendarHeart },
  { id: 'experiences', label: 'Experiences', icon: HandHeart },
  { id: 'etiquette', label: 'Temple etiquette', icon: ScrollText },
];

export default function CulturalAdmin() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'festivals';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Content" title="Cultural Escapes" text="Festivals, hands-on experiences and etiquette tips on the Cultural Escapes page." />
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-white p-1.5 ring-1 ring-navy-900/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setParams({ tab: t.id }, { replace: true })}
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${tab === t.id ? 'text-white' : 'text-navy-800/60 hover:text-navy-900'}`}
          >
            {tab === t.id && <motion.span layoutId="culture-tab" className="absolute inset-0 rounded-full bg-navy-900" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <t.icon className="relative h-4 w-4" />
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'festivals' && <CollectionPage name="festivals" embedded />}
        {tab === 'experiences' && <CollectionPage name="culture_experiences" embedded />}
        {tab === 'etiquette' && <SettingsPage settingKey="etiquette" embedded />}
      </motion.div>
    </div>
  );
}
