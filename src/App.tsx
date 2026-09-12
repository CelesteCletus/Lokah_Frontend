import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import RootLayout from './layouts/RootLayout';

// Components
import IntroScreen from './components/IntroScreen';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import AboutCompany from './pages/AboutCompany';
import ConstructionStandardsPage from './pages/ConstructionStandards';
import Brochure from './pages/Brochure';
import OrganisationChart from './pages/OrganisationChart';
import Consultant from './pages/Consultant';
import Services from './pages/Services';
import TurnkeyProjects from './pages/TurnkeyProjects';
import ResidentialProjects from './pages/ResidentialProjects';
import CommercialProjects from './pages/CommercialProjects';
import InteriorExterior from './pages/InteriorExterior';
import Remodelling from './pages/Remodelling';
import PropertyDevelopment from './pages/PropertyDevelopment';
import Consultancy from './pages/Consultancy';
import ProjectPlanning from './pages/ProjectPlanning';
import PropertyExperience from './pages/PropertyExperience';
import OngoingProjects from './pages/OngoingProjects';
import CompletedProjects from './pages/CompletedProjects';
import LandToLandmark from './pages/LandToLandmark';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Terms from './pages/Legal/Terms';
import Privacy from './pages/Legal/Privacy';
import Cookies from './pages/Legal/Cookies';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// DB Access
import { getProperties, getBlogs } from './lib/db';
import type { Property } from './data/sampleData';
import type { Blog as BlogType } from './lib/db';

function App() {
  // Automatically redirect direct path URLs (e.g. /admin/login) to HashRouter URLs (/#/admin/login)
  if (typeof window !== 'undefined' && window.location.pathname !== '/' && !window.location.hash) {
    const cleanPath = window.location.pathname.replace(/^\//, '');
    if (cleanPath) {
      window.location.replace(`${window.location.origin}/#/${cleanPath}`);
    }
  }

  const [showIntro, setShowIntro] = useState(() => {
    const hash = window.location.hash || '';
    const path = window.location.pathname || '';
    return !(
      hash.includes('admin') || 
      hash.includes('team-login') || 
      path.includes('admin') || 
      path.includes('team-login')
    );
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  // Load properties and blogs on app mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [props, posts] = await Promise.all([
          getProperties(),
          getBlogs()
        ]);
        setProperties(props);
        setBlogs(posts);
      } catch (err) {
        console.error('Failed to pre-fetch App database:', err);
      }
    };
    initData();
  }, []);

  return (
    <div className="bg-matte-black text-ivory-100 min-h-screen">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route 
                path="/" 
                element={
                  <RootLayout 
                    properties={properties} 
                    blogs={blogs} 
                    setProperties={setProperties} 
                    setBlogs={setBlogs} 
                  />
                }
              >
                <Route index element={<Home />} />
                
                {/* Explore Us */}
                <Route path="explore-us/about-company" element={<AboutCompany />} />
                <Route path="explore-us/construction-standards" element={<ConstructionStandardsPage />} />
                <Route path="construction-standards" element={<ConstructionStandardsPage />} />
                <Route path="explore-us/brochure" element={<Brochure />} />
                <Route path="explore-us/organisation-chart" element={<OrganisationChart />} />
                <Route path="explore-us/our-team" element={<Consultant />} />
                <Route path="explore-us/our-people" element={<Consultant />} />
                <Route path="explore-us/consultant" element={<Consultant />} />

                {/* What We Do */}
                <Route path="services" element={<Services />} />
                <Route path="services/turnkey-projects" element={<TurnkeyProjects />} />
                <Route path="services/residential-projects" element={<ResidentialProjects />} />
                <Route path="services/commercial-projects" element={<CommercialProjects />} />
                <Route path="services/interior-exterior" element={<InteriorExterior />} />
                <Route path="services/remodelling" element={<Remodelling />} />
                <Route path="services/property-development" element={<PropertyDevelopment />} />
                <Route path="services/consultancy" element={<Consultancy />} />
                <Route path="services/project-planning" element={<ProjectPlanning />} />

                {/* Our Projects */}
                <Route path="projects/ongoing" element={<OngoingProjects />} />
                <Route path="projects/completed" element={<CompletedProjects />} />
                <Route path="projects/land-to-landmark" element={<LandToLandmark />} />
                <Route path="properties/:slug" element={<PropertyExperience />} />

                {/* Other Main Links */}
                <Route path="blog" element={<Blog />} />
                <Route path="careers" element={<Careers />} />
                <Route path="reach-us" element={<Contact />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />
              </Route>

              {/* Admin routes — standalone, outside RootLayout (no website navbar/footer) */}
              <Route path="team-login" element={<AdminLogin />} />
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="team-login/reset-password" element={<ResetPassword />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />

              {/* Catch-all: unmatched routes get a proper 404 instead of a blank screen */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

