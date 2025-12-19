// ServicesSection.tsx (Updated for MBSkills)
import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { Globe, Smartphone, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ServicesSectionProps {
  language: Language;
  t: (key: string) => string;
}

const ServicesSection: React.FC<ServicesSectionProps> = memo(({ language, t }) => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const primaryColor = '#122138';
  const secondaryColor = '#04a3fe';

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

  const services: Service[] = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('webDevelopmentTitle'),
      description: t('webDevelopmentDesc')
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('mobileDevelopmentTitle'),
      description: t('mobileDevelopmentDesc')
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: t('dataScienceTitle'),
      description: t('dataScienceDesc')
    }
  ];

  const handleServiceHover = useCallback((index: number | null) => {
    setActiveService(index);
  }, []);

  return (
    <motion.section 
      ref={sectionRef}
      id="services" 
      aria-label="Nos services de formation"
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
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('servicesTitle')}
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 h-full transition-all duration-300 ${
                activeService === index ? 'transform -translate-y-2 shadow-lg' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => handleServiceHover(index)}
              onMouseLeave={() => handleServiceHover(null)}
            >
              <div className="p-6 h-full flex flex-col">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    activeService === index 
                      ? 'text-white scale-110' 
                      : 'text-blue-600'
                  }`}
                  style={{
                    backgroundColor: activeService === index ? secondaryColor : '#f0f9ff'
                  }}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 pb-1" style={{ color: primaryColor }}>
                  {service.title}
                </h3>
                <p className="text-gray-600 flex-grow">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;