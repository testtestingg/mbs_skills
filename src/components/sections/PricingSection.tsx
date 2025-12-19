// PricingSection.tsx (Updated with correct color scheme)
import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface PricingSectionProps {
  language: Language;
  t: (key: string) => string;
  handleContactOpen: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = memo(({ language, t, handleContactOpen }) => {
  const customPurple = '#682cda';
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleContactClick = useCallback(() => {
    handleContactOpen();
  }, [handleContactOpen]);

  return (
    <motion.section 
      ref={sectionRef}
      id="pricing" 
      aria-label="Pricing"
      className="py-24 relative bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gradient pb-2"
            style={{ 
              background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('pricingTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricingSubtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('basicPlan')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">200</span>
                <span className="text-gray-600"> TND</span>
              </div>
              <p className="text-gray-600 mb-6">{t('startingFrom')}</p>
              <ul className="text-gray-600 mb-8 space-y-2 flex-grow">
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('responsiveWebsite')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('basicSEO')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('oneYearSupport')}
                </li>
              </ul>
              <button 
                onClick={handleContactClick}
                className="mt-auto text-white px-6 py-3 rounded-full transition-colors w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {t('contactUs')}
              </button>
            </div>
          </motion.div>
          
          {/* Professional Plan */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 h-full transform scale-105"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="p-8 h-full flex flex-col">
              <div 
                className="text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
              >
                {t('popular')}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('professionalPlan')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">800</span>
                <span className="text-gray-600"> TND</span>
              </div>
              <p className="text-gray-600 mb-6">{t('startingFrom')}</p>
              <ul className="text-gray-600 mb-8 space-y-2 flex-grow">
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('advancedWebsite')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('premiumSEO')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('twoYearsSupport')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('contentManagement')}
                </li>
              </ul>
              <button 
                onClick={handleContactClick}
                className="mt-auto text-white px-6 py-3 rounded-full transition-colors w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {t('contactUs')}
              </button>
            </div>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('enterprisePlan')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">1500+</span>
                <span className="text-gray-600"> TND</span>
              </div>
              <p className="text-gray-600 mb-6">{t('startingFrom')}</p>
              <ul className="text-gray-600 mb-8 space-y-2 flex-grow">
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('customSolution')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('advancedSEO')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('lifetimeSupport')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2" style={{ color: customPurple }}>✓</span>
                  {t('mobileApp')}
                </li>
              </ul>
              <button 
                onClick={handleContactClick}
                className="mt-auto text-white px-6 py-3 rounded-full transition-colors w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {t('contactUs')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

PricingSection.displayName = 'PricingSection';

export default PricingSection;
