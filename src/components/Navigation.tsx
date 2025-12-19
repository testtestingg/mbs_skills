// Navigation.tsx (Updated with correct color scheme)
import React, { useState, memo, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import LanguageSwitcher from './common/LanguageSwitcher';

interface NavigationProps {
  currentPage: 'home' | 'services' | 'reference' | 'contact' | 'projects';
  onNavigate: (page: 'home' | 'services' | 'reference' | 'contact' | 'projects') => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  scrollToSection: (sectionId: string) => void;
  handleContactOpen: () => void;
  t: (key: string) => string;
}

const Navigation: React.FC<NavigationProps> = memo(({
  currentPage,
  onNavigate,
  language,
  changeLanguage,
  scrollToSection,
  handleContactOpen,
  t
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageSwitcher = <LanguageSwitcher language={language} changeLanguage={changeLanguage} />;
  const customPurple = '#682cda'; // Purple color matching your brand

  // Get navigation text based on language
  const getNavText = useCallback((key: string) => {
    const navTexts = {
      en: {
        navHome: 'Home',
        navServices: 'Services',
        navProjects: 'Projects',
        navReference: 'Testimonials',
        navContact: 'Contact'
      },
      fr: {
        navHome: 'Accueil',
        navServices: 'Services',
        navProjects: 'Projets',
        navReference: 'Témoignages',
        navContact: 'Contact'
      },
      ar: {
        navHome: 'الرئيسية',
        navServices: 'الخدمات',
        navProjects: 'المشاريع',
        navReference: 'شهادات',
        navContact: 'اتصل بنا'
      }
    };
    return navTexts[language]?.[key] || key;
  }, [language]);

  const handleNavClick = useCallback((page: 'home' | 'services' | 'reference' | 'contact' | 'projects') => {
    onNavigate(page);
    if (page === 'contact') {
      handleContactOpen();
    }
    setIsMobileMenuOpen(false);
  }, [onNavigate, handleContactOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-pointer flex items-center"
            onClick={() => handleNavClick('home')}
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src="https://i.ibb.co/ZzHk1Xzt/logo.png"
              alt="TechyTak Logo"
              className="h-10 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center gap-6"
          >
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentPage === 'home'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              {getNavText('navHome')}
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentPage === 'services'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              {getNavText('navServices')}
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentPage === 'projects'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              {getNavText('navProjects')}
            </button>
            <button
              onClick={() => handleNavClick('reference')}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentPage === 'reference'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              {getNavText('navReference')}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                currentPage === 'contact'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              {getNavText('navContact')}
            </button>
            <div className="ml-4">
              {languageSwitcher}
            </div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {languageSwitcher}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-purple-600 hover:bg-purple-50 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-2 space-y-1">
                {['home', 'services', 'projects', 'reference', 'contact'].map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => handleNavClick(item as any)}
                    whileTap={{ scale: 0.98 }}
                    className={`block w-full text-left px-4 py-3 rounded-md transition-colors text-sm ${
                      currentPage === item
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-purple-100'
                    }`}
                  >
                    {item === 'home' && getNavText('navHome')}
                    {item === 'services' && getNavText('navServices')}
                    {item === 'projects' && getNavText('navProjects')}
                    {item === 'reference' && getNavText('navReference')}
                    {item === 'contact' && getNavText('navContact')}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
