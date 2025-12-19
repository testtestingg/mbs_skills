// App.tsx (Updated with correct color scheme)
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, Star } from 'lucide-react';
import SEO from './components/SEO';
import PageViewTracker from './components/PageViewTracker';
import { analyticsService } from "./services/analyticsService";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Analytics } from '@vercel/analytics/react';

// Import all section components
import Navigation from './components/Navigation';
import AnimatedHero from './components/sections/AnimatedHero';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import TechStackSection from './components/sections/TechStackSection';
import ProjectsSection from './components/sections/ProjectsSection';
import PricingSection from './components/sections/PricingSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import FAQSection from './components/sections/FAQSection';
import FooterSection from './components/sections/FooterSection';
import LanguageBanner from './components/LanguageBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ContactPage from "./ContactPage";

// Import the new GamePage component
import GamePage from './components/GamePage';

import { Translations, Language } from './types';
import translations from './translations';

function GlobalStyles() {
  return (
    <style>
      {`
        :root {
          --z-index-dropdown: 1000;
          --z-index-sticky: 1020;
          --z-index-fixed: 1030;
          --z-index-modal: 1040;
          --z-index-popover: 1050;
          --z-index-tooltip: 1060;
          --z-index-robot: 1;
          --z-index-content: 10;
          --z-index-navigation: 1000;
          --z-index-mobile-menu: 1001;
          --z-index-admin-button: 9999;
          --z-index-contact-modal: 9999;
          
          /* Corporate color palette - Purple theme */
          --primary-color: #682cda;
          --secondary-color: #9333ea;
          --accent-color: #8b5cf6;
          --background-color: #FFFFFF;
          --text-color: #1F2937;
          --light-gray: #F9FAFB;
          --medium-gray: #F3F4F6;
          --border-color: #E5E7EB;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: var(--background-color);
          color: var(--text-color);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        
        .language-transition {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          z-index: 40;
          transition: all 0.5s ease;
          pointer-events: none;
        }
        
        .language-transition > div {
          position: absolute;
          inset: 0;
          background: linear-gradient(to-r, rgba(104, 44, 218, 0.1), rgba(147, 51, 234, 0.1));
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(3deg) scale(1.05); }
          50% { transform: translateY(-35px) rotate(0deg) scale(1.1); }
          75% { transform: translateY(-20px) rotate(-3deg) scale(1.05); }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, var(--text-color) 0%, var(--primary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        h1, h2, h3, h4, h5, h6 {
          line-height: 1.2;
          padding-bottom: 0.1em;
          margin-bottom: 0.5em;
          color: var(--primary-color);
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 1em;
          color: var(--text-color);
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        .hardware-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .mobile-menu-glass {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          border: 1px solid var(--border-color) !important;
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-10px);
        }
          
        /* Hardware acceleration for better performance */
        .hardware-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
      `}
    </style>
  );
}

// Utility function for RTL styling
const getDirectionStyle = (isRTL: boolean) => {
  return isRTL ? {
    direction: 'rtl',
    fontFamily: "'Tajawal', sans-serif"
  } : {
    direction: 'ltr'
  };
};

function App() {
  // *** CHANGE: Add state for language banner visibility ***
  // Initialize based on whether a language has been selected before
  const [isLanguageBannerVisible, setIsLanguageBannerVisible] = useState(
    !localStorage.getItem('languageSelected')
  );

  // Use custom hook for language detection
  const [language, setLanguage] = useState<Language>('en');
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage('admin_authenticated', false);
  const [adminError, setAdminError] = useState('');
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');
  
  // Add a new state to track when the game page is active
  const [isGamePageActive, setIsGamePageActive] = useState(false);
  
  const isRTL = language === 'ar';

  // Manual scroll tracking for hero section
  const [heroProgress, setHeroProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  
  const scrollSectionRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    // Calculate hero scroll progress with validation
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const heightDiff = rect.height - window.innerHeight;
      
      // Prevent division by zero or invalid values
      if (heightDiff !== 0 && !isNaN(heightDiff) && !isNaN(rect.top)) {
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / heightDiff));
        setHeroProgress(scrollProgress);
      }
    }
    
    // Track active section for breadcrumb
    const sections = ['hero', 'scroll-section', 'about', 'services', 'projects', 'tech-stack', 'pricing', 'testimonials', 'faq'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, []);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    // Initial calculation
    handleScroll();
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    console.log('App state changed:', {
      isAdminAuthenticated,
      showAdmin,
      adminError
    });
  }, [isAdminAuthenticated, showAdmin, adminError]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Track page view
    analyticsService.trackPageView('home', language);
    
    // Secret admin access: Press Ctrl+Shift+A
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminButton(true);
        setTimeout(() => setShowAdminButton(false), 5000); // Hide after 5 seconds
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [language, isRTL]);

  // Translation helper
  const t = useCallback((key: string): string => translations[key]?.[language] || key, [language]);

  // *** CHANGE: Update changeLanguage to save user's choice ***
  const changeLanguage = useCallback((newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setIsLanguageChanging(true);
    
    setTimeout(() => {
      setLanguage(newLanguage);
      // Save the user's choice to localStorage so the banner doesn't show again
      localStorage.setItem('languageSelected', 'true');
      
      setTimeout(() => {
        setIsLanguageChanging(false);
      }, 500);
    }, 250);
  }, [language]);

  const handleContactOpen = useCallback(() => {
    setShowContactModal(true);
    setCurrentPage('contact');
    analyticsService.trackUserInteraction('contact_modal_open', currentPage, language);
  }, [currentPage, language]);

  const handleAdminLogin = useCallback((success: boolean) => {
    console.log('handleAdminLogin called with:', success);
    
    if (success) {
      console.log('Setting admin authenticated to true');
      setIsAdminAuthenticated(true);
      setShowAdmin(false);
      setAdminError('');
    } else {  
      console.log('Setting admin error');
      setAdminError('Invalid password. Please try again.');
    }
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    setShowAdmin(false);
    setAdminError('');
  }, []);

  // Update scrollToSection to track navigation
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Track navigation
      analyticsService.trackUserInteraction('navigation_click', currentPage, language, { target_section: sectionId });
      setCurrentPage(sectionId);
      // Update URL with anchor for better SEO
      window.history.pushState(null, '', `#${sectionId}`);
    }
  }, [currentPage, language]);

  // If admin is authenticated, show dashboard
  if (isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // If showing admin login
  if (showAdmin) {
    return <AdminLogin onLogin={handleAdminLogin} error={adminError} />;
  }

  // If game page is active, show the game
  if (isGamePageActive) {
    return <GamePage onBack={() => setIsGamePageActive(false)} />;
  }

  return (
    <>
      <GlobalStyles />
      <SEO language={language} />
      <PageViewTracker language={language} />
      {process.env.NODE_ENV === 'production' && <Analytics />}
      
        <div 
          style={getDirectionStyle(isRTL)}
          className="min-h-screen bg-white text-gray-800"
        >
          {/* Language Change Overlay */}
          <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-40 transition-all duration-500 pointer-events-none ${
            isLanguageChanging ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 animate-pulse" />
          </div> 

          {/* Language Detection Banner */}
          <LanguageBanner 
            language={language}
            changeLanguage={changeLanguage}
            onClose={() => {
              setIsLanguageBannerVisible(false);
              // *** CHANGE: Also save the user's choice when they close the banner ***
              localStorage.setItem('languageSelected', 'true');
            }}
            onPrivacyPolicyOpen={() => setIsPrivacyPolicyOpen(true)}
            t={t}
            // *** CHANGE: Add the isVisible prop ***
            isVisible={isLanguageBannerVisible}
          />
          
          {/* Navigation */}
          <Navigation 
            currentPage={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              if (page === 'home') scrollToSection('hero');
              if (page === 'services') scrollToSection('services');
              if (page === 'projects') scrollToSection('projects');
              if (page === 'reference') scrollToSection('testimonials');
              if (page === 'contact') handleContactOpen();
              if (page === 'game') setIsGamePageActive(true); // Add navigation to game page
            }}
            language={language}
            changeLanguage={changeLanguage}
            scrollToSection={scrollToSection}
            handleContactOpen={handleContactOpen}
            t={t}
          />

          {/* Secret Admin Button */}
          {showAdminButton && (
            <motion.button
              onClick={() => setShowAdmin(true)}
              className="fixed bottom-4 right-4 p-3 bg-red-600 hover:bg-red-700 rounded-full z-[9999]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              title="Admin Access"
            >
              <Settings className="h-5 w-5 text-white" />
            </motion.button>
          )}

          {/* Main Content with Semantic HTML */}
          <main role="main">
            {/* Hero Section with Animated Robot Component */}
            <section ref={heroRef} id="hero" aria-label="Hero section" className="min-h-screen flex items-center justify-center relative pt-32 pb-16 bg-white">
              <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedHero language={language} handleContactOpen={handleContactOpen} t={t} />
              </div>

              {/* Scroll Indicator */}
              <div
                className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
                  window.scrollY > 50 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="flex flex-col items-center space-y-2 animate-bounce">
                  <ChevronDown className="h-6 w-6" style={{ color: 'var(--primary-color)' }} />
                  <ChevronDown className="h-6 w-6" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
            </section>

{/* Animation Section */}
<section ref={scrollSectionRef} id="scroll-section" className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
  <div className="text-center relative w-full max-w-5xl mx-auto z-10 py-32">
    {/* Use AnimatePresence for smoother transitions */}
    <AnimatePresence mode="wait">
      {currentStep === 0 && (
        <motion.div
          key="step-0"
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 pb-2"
            style={{ 
              background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('modernWebsites')}
          </h2>
        </motion.div>
      )}
      
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 pb-2"
            style={{ 
              background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('mobileApps')}
          </h2>
        </motion.div>
      )}
      
      {currentStep === 2 && (
        <motion.div
          key="step-2"
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 pb-2"
            style={{ 
              background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('finalMessage')}
          </h2>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>

            {/* About Section */}
            <AboutSection ref={aboutRef} language={language} t={t} />

            {/* Services Section */}
            <ServicesSection ref={servicesRef} language={language} t={t} />

            {/* Projects Section - New */}
            <ProjectsSection ref={projectsRef} language={language} t={t} />

            {/* Tech Stack Section */}
            <TechStackSection language={language} t={t} />

            {/* Pricing Section */}
            <PricingSection ref={pricingRef} language={language} t={t} handleContactOpen={handleContactOpen} />

            {/* Testimonials Section */}
            <TestimonialsSection ref={testimonialsRef} language={language} t={t} />

            {/* FAQ Section */}
            <FAQSection ref={faqRef} language={language} t={t} />
          </main>

          {/* Footer */}
          <FooterSection language={language} t={t} />
        </div>      
      {/* Contact Modal */}
      <ContactPage 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        language={language}
        translations={translations}
      />
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicy
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
        language={language}
      />
    </>
  );
}

export default App;
