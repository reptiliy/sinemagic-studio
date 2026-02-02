import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import BentoGrid from './components/BentoGrid';
import CTA from './components/CTA';
import About from './components/About';
import Help from './components/Help';
import Price from './components/Price';
import VideoSection from './components/VideoSection';
import StoreSection from './components/StoreSection';
import Footer from './components/Footer';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { ContentProvider, useSection } from './ContentContext';
import Login from './components/auth/Login';
import UserProfile from './components/user/UserProfile';
import RequireAuth from './components/auth/RequireAuth';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminContent from './components/admin/AdminContent';
import AdminStore from './components/admin/AdminStore';
import AdminSettings from './components/admin/AdminSettings';
import CustomPage from './components/CustomPage';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'help' | 'price' | 'store' | 'custom'>('home');
  const location = useLocation();

  // Handle navigation from other pages (like CustomPage)
  useEffect(() => {
    if (location.state && (location.state as any).view) {
      setCurrentView((location.state as any).view);
      // Clear state to avoid stuck navigation on refresh? 
      // Actually replacing state is better but standard navigate is fine.
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Section visibility
  const showHome = useSection('home');
  const showShowcase = useSection('showcase');
  const showBento = useSection('bento');
  const showCta = useSection('cta');
  const showAbout = useSection('about');
  const showHelp = useSection('help');
  const showPrice = useSection('price');
  const showVideo = useSection('video');
  const showStore = useSection('store');
  const showHeader = useSection('header');
  const showFooter = useSection('footer');

  useEffect(() => {
    const initLucide = () => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    };
    initLucide();
    const timeout = setTimeout(initLucide, 100);
    return () => clearTimeout(timeout);
  }, [currentView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050508]">
      {showHeader && <Header onNavigate={setCurrentView} currentView={currentView} />}
      
      <main className="flex-grow">
        {currentView === 'home' ? (
          <div className="animate-in fade-in duration-700">
            {showHome && <Hero />}
            {showShowcase && <Showcase />}
            {showStore && <StoreSection />}
            {showVideo && <VideoSection />}
            {showBento && <BentoGrid />}
            {showCta && <CTA />}
          </div>
        ) : currentView === 'store' ? (
          <div className="pt-20 animate-in slide-in-from-bottom-4 duration-700 min-h-screen">
             {showStore && <StoreSection />}
          </div>
        ) : currentView === 'about' ? (
          <div className="pt-20 animate-in slide-in-from-bottom-4 duration-700">
            {showAbout && <About />}
          </div>
        ) : currentView === 'price' ? (
          <div className="pt-20 animate-in slide-in-from-bottom-4 duration-700">
            {showPrice && <Price />}
          </div>
        ) : (
          <div className="pt-20 animate-in slide-in-from-bottom-4 duration-700">
            {showHelp && <Help />}
          </div>
        )}
      </main>

      {showFooter && <Footer onNavigate={setCurrentView} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ContentProvider>
        <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppContent />} />
            <Route path="/p/:slug" element={<CustomPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* User Routes */}
            <Route path="/profile" element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="store" element={<AdminStore />} />
              <Route path="media" element={<div className="text-white">Media Gallery (Coming Soon)</div>} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </LanguageProvider>
      </ContentProvider>
    </AuthProvider>
  );
};

export default App;
