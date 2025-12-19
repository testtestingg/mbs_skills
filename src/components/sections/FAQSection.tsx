// FAQSection.tsx (Updated with correct color scheme)
import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface FAQSectionProps {
  language: Language;
  t: (key: string) => string;
}

const FAQSection: React.FC<FAQSectionProps> = memo(({ language, t }) => {
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

  const faqData = {
    fr: [
      {
        question: "Combien coûte un site web en Tunisie ?",
        answer: "Nos sites web commencent à partir de 200 TND. Le prix final dépend de vos besoins spécifiques."
      },
      {
        question: "Développez-vous des applications mobiles ?",
        answer: "Oui, nous développons des applications iOS et Android avec React Native et Flutter."
      },
      {
        question: "Où êtes-vous basés en Tunisie ?",
        answer: "Nous sommes basés à Tunis et servons toute la Tunisie."
      }
    ],
    en: [
      {
        question: "How much does a website cost?",
        answer: "Our websites start from 200 TND ≈ 60 EUR. The final price depends on your specific needs."
      },
      {
        question: "Do you develop mobile applications?", 
        answer: "Yes, we develop iOS and Android applications using React Native and Flutter."
      },
      {
        question: "Where are you based in Tunisia?",
        answer: "We are based in Tunis and serve worldwide."
      }
    ],
    ar: [
      {
        question: "كم تكلفة موقع الويب في تونس؟",
        answer: "تبدأ مواقعنا من 200 دينار تونسي. السعر النهائي يعتمد على احتياجاتك المحددة."
      },
      {
        question: "هل تطورون تطبيقات الهاتف المحمول؟",
        answer: "نعم، نطور تطبيقات iOS و Android باستخدام React Native و Flutter."
      },
      {
        question: "أين تقع قاعدتكم في تونس؟",
        answer: "نحن نقع في تونس ونخدم جميع أنحاء تونس."
      }
    ]
  };

  return (
    <motion.section 
      ref={sectionRef}
      id="faq" 
      aria-label="Frequently Asked Questions"
      className="py-24 relative bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gradient pb-2"
          style={{ 
            background: `linear-gradient(135deg, #682cda 0%, #9333ea 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t('faqTitle')}
        </motion.h2>
        <div className="space-y-6">
          {faqData[language].map((faq, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;
