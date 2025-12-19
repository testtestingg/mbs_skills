// FAQSection.tsx (Updated for MBSkills)
import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface FAQSectionProps {
  language: Language;
  t: (key: string) => string;
}

const FAQSection: React.FC<FAQSectionProps> = memo(({ language, t }) => {
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

  const faqData = {
    fr: [
      {
        question: "Quelles sont les prérequis pour vos formations ?",
        answer: "Nos formations sont accessibles à tous niveaux. Certains programmes avancés peuvent nécessiter des connaissances de base en informatique."
      },
      {
        question: "Proposez-vous des certifications reconnues ?", 
        answer: "Oui, nous préparons nos étudiants à des certifications reconnues dans l'industrie, comme celles de Microsoft, Google et Amazon Web Services."
      },
      {
        question: "Quelles sont les perspectives d'emploi après formation ?",
        answer: "Nos formations sont conçues pour répondre aux besoins du marché. 85% de nos diplômés trouvent un emploi dans les 6 mois suivant la fin de leur formation."
      },
      {
        question: "Proposez-vous des formations en ligne ou en présentiel ?",
        answer: "Nous offrons les deux options avec des cours hybrides pour s'adapter à tous les emplois du temps et préférences d'apprentissage."
      },
      {
        question: "Y a-t-il un accompagnement pour la recherche d'emploi ?",
        answer: "Oui, nous avons un service d'orientation professionnelle qui aide nos étudiants à préparer leur CV, à se préparer aux entretiens et à trouver des opportunités d'emploi."
      }
    ],
    en: [
      {
        question: "What are the prerequisites for your training programs?",
        answer: "Our training programs are accessible to all levels. Some advanced programs may require basic computer knowledge."
      },
      {
        question: "Do you offer recognized certifications?", 
        answer: "Yes, we prepare our students for industry-recognized certifications, such as those from Microsoft, Google, and Amazon Web Services."
      },
      {
        question: "What are the job prospects after training?",
        answer: "Our programs are designed to meet market needs. 85% of our graduates find a job within 6 months of completing their training."
      },
      {
        question: "Do you offer online or in-person training?",
        answer: "We offer both options with hybrid courses to accommodate all schedules and learning preferences."
      },
      {
        question: "Is there job search assistance?",
        answer: "Yes, we have a career guidance service that helps our students prepare their CVs, prepare for interviews, and find job opportunities."
      }
    ],
    ar: [
      {
        question: "ما هي المتطلبات الأساسية لبرامج التدريب الخاصة بكم؟",
        answer: "برامج التدريب الخاصة بنا متاحة لجميع المستويات. قد تتطلب بعض البرامج المتقدمة معرفة أساسية بالكمبيوتر."
      },
      {
        question: "هل تقدمون شهادات معترف بها؟", 
        answer: "نعم، نعد طلابنا للحصول على شهادات معترف بها في الصناعة، مثل تلك من Microsoft و Google و Amazon Web Services."
      },
      {
        question: "ما هي آ prospectives للعمل بعد التدريب؟",
        answer: "تم تصميم برامجنا لتلبية احتياجات السوق. 85% من خريجينا يجدون وظيفة في غضون 6 أشهر بعد إكمال تدريبهم."
      },
      {
        question: "هل تقدمون تدريباً عبر الإنترنت أو شخصياً؟",
        answer: "نحن نقدم الخيارين مع دورات هجينة لتلبية جميع الجداول الزمنية وتفضيلات التعلم."
      },
      {
        question: "هل هناك مساعدة في البحث عن عمل؟",
        answer: "نعم، لدينا خدمة إرشاد مهني تساعد طلابنا على إعداد سيرتهم الذاتية، والتحضير للمقابلات، والعثور على فرص عمل."
      }
    ]
  };

  return (
    <motion.section 
      ref={sectionRef}
      id="faq" 
      aria-label="Questions Fréquemment Posées"
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>{faq.question}</h3>
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