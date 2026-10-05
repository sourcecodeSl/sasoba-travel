import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { ToastProvider } from './ui/Toast.jsx';
import { ConfirmProvider } from './ui/Confirm.jsx';
import AdminLayout from './AdminLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EnquiriesPage from './pages/EnquiriesPage.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import CulturalAdmin from './pages/CulturalAdmin.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AccountPage from './pages/AccountPage.jsx';

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-950">
      <motion.img
        src="/brand/sasoba-mark.svg"
        alt="Loading"
        className="h-20 w-20"
        animate={{ rotate: 360, scale: [1, 1.06, 1] }}
        transition={{ rotate: { duration: 6, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, repeat: Infinity } }}
      />
    </div>
  );
}

function Gate() {
  const { state } = useAuth();
  if (state === 'loading') return <Splash />;
  if (state === 'setup') return <LoginPage mode="setup" />;
  if (state === 'signedOut') return <LoginPage />;

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="stories" element={<CollectionPage key="testimonials" name="testimonials" />} />
        <Route path="moments" element={<CollectionPage key="moments" name="moments" />} />
        <Route path="destinations" element={<CollectionPage key="destinations" name="destinations" />} />
        <Route path="journeys" element={<CollectionPage key="journeys" name="journeys" />} />
        <Route path="cultural" element={<CulturalAdmin />} />
        <Route path="stays" element={<CollectionPage key="stays" name="stays" />} />
        <Route path="about" element={<SettingsPage key="about" settingKey="about" />} />
        <Route path="contact" element={<SettingsPage key="contact" settingKey="contact" />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

/** Admin panel, mounted at /admin/* (lazy-loaded, separate from the public site). */
export default function AdminApp() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Sasoba Admin Studio';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Gate />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
