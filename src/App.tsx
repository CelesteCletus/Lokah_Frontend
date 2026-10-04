import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import RootLayout from './layouts/RootLayout';

// Components
import IntroScreen from './components/IntroScreen';
import ScrollToTop from './components/ScrollToTop';

// Immediate Load for Instant Landing
import Home from './pages/Home';

// Lazy Loaded Secondary Pages for App-Like Speed and Smoothness
const AboutCompany = lazy(() => import('./pages/AboutCompany'));
const ConstructionStandardsPage = lazy(() => import('./pages/ConstructionStandards'));
const Brochure = lazy(() => import('./pages/Brochure'));
const OrganisationChart = lazy(() => import('./pages/OrganisationChart'));
const Consultant = lazy(() => import('./pages/Consultant'));
const Services = lazy(() => import('./pages/Services'));
const TurnkeyProjects = lazy(() => import('./pages/TurnkeyProjects'));
const ResidentialProjects = lazy(() => import('./pages/ResidentialProjects'));
const CommercialProjects = lazy(() => import('./pages/CommercialProjects'));
const InteriorExterior = lazy(() => import('./pages/InteriorExterior'));
const Remodelling = lazy(() => import('./pages/Remodelling'));
const PropertyDevelopment = lazy(() => import('./pages/PropertyDevelopment'));
const Consultancy = lazy(() => import('./pages/Consultancy'));
const ProjectPlanning = lazy(() => import('./pages/ProjectPlanning'));
const PropertyExperience = lazy(() => import('./pages/PropertyExperience'));
const OngoingProjects = lazy(() => import('./pages/OngoingProjects'));
const CompletedProjects = lazy(() => import('./pages/CompletedProjects'));
const LandToLandmark = lazy(() => import('./pages/LandToLandmark'));
const Blog = lazy(() => import('./pages/Blog'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Legal/Terms'));
const Privacy = lazy(() => import('./pages/Legal/Privacy'));
const Cookies = lazy(() => import('./pages/Legal/Cookies'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

// DB Access
import { getProperties, getBlogs } from './lib/db';
import type { Property } from './data/sampleData';
import type { Blog as BlogType } from './lib/db';

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-matte-black">
    <div className="w-7 h-7 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </HashRouter>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
