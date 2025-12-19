// AboutSection.tsx (Updated for MBSkills)
import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface AboutSectionProps {
  language: Language;
  t: (key: string) => string;
}

const AboutSection: React.FC<AboutSectionProps> = memo(({ language, t }) => {
  const primaryColor = '#122138';
  const secondaryColor = '#04a3fe';
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

  return (
    <motion.section 
      ref={sectionRef}
      id="about" 
      aria-label="À propos de MBSkills"
      className="py-24 relative bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gradient pb-2"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t('aboutTitle')}
        </motion.h2>
        <motion.p 
          className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t('aboutText')}
        </motion.p>
      </div>
    </motion.section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;