import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
const DestinationsPage = lazy(() => import('./pages/DestinationsPage.jsx'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail.jsx'));
const JourneysPage = lazy(() => import('./pages/JourneysPage.jsx'));
const JourneyDetail = lazy(() => import('./pages/JourneyDetail.jsx'));
const SafariPage = lazy(() => import('./pages/SafariPage.jsx'));
const CulturalPage = lazy(() => import('./pages/CulturalPage.jsx'));
const StaysPage = lazy(() => import('./pages/StaysPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950" />}>
      <Routes>
        <Route path="admin/*" element={<AdminApp />} />
        <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:slug" element={<DestinationDetail />} />
        <Route path="journeys" element={<JourneysPage />} />
        <Route path="journeys/:id" element={<JourneyDetail />} />
        <Route path="safari" element={<SafariPage />} />
        <Route path="cultural" element={<CulturalPage />} />
        <Route path="stays" element={<StaysPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
    </Suspense>
  );
}
