// TechStackSection.tsx (Updated for translation)
import React, { memo, useRef, useEffect, useState } from 'react';
import { Code, Database, Cloud, Monitor, Smartphone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface TechStackSectionProps {
  language: Language;
  t: (key: string) => string;
}

const TechStackSection: React.FC<TechStackSectionProps> = memo(({ language, t }) => {
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

  // UPDATED: The tech stack array now uses the translation function for names
  const techStack = [
    { icon: <Code className="w-8 h-8" />, name: t('techReactNextjs') },
    { icon: <Database className="w-8 h-8" />, name: t('techNodeExpress') },
    { icon: <Cloud className="w-8 h-8" />, name: t('techAwsFirebase') },
    { icon: <Monitor className="w-8 h-8" />, name: t('techUiUxDesign') },
    { icon: <Smartphone className="w-8 h-8" />, name: t('techReactNative') },
    { icon: <Globe className="w-8 h-8" />, name: t('techWeb3Ai') },
  ];

  return (
    <motion.section 
      ref={sectionRef}
      id="tech-stack" 
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gradient pb-2"
            style={{ 
              background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {/* CHANGED: Now uses the translation function */}
            {t('techStackTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {/* CHANGED: Now uses the translation function */}
            {t('techStackSubtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex flex-col items-center hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
              >
                {tech.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">{tech.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

TechStackSection.displayName = 'TechStackSection';

export default TechStackSection;