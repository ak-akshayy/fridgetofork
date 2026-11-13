import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import PantryPage from './pages/PantryPage';
import RescueEnginePage from './pages/RescueEnginePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SubstitutionsPage from './pages/SubstitutionsPage';
import ImpactPage from './pages/ImpactPage';
import ProfilePage from './pages/ProfilePage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100 text-textDark selection:bg-sage-300 selection:text-forest-900">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="/rescue-engine" element={<RescueEnginePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/substitutions" element={<SubstitutionsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
