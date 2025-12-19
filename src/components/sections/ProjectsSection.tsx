// ProjectsSection.tsx (Updated for MBSkills)
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

interface ProjectsSectionProps {
  language: Language;
  t: (key: string) => string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ language, t }) => {
  // Updated Colors
  const primaryColor = '#122138';
  const secondaryColor = '#04a3fe';

  const projectsData: Project[] = [
    // WEB DEVELOPMENT PROJECT
    {
      title: "PORTFOLIO WEB DÉVELOPPEUR",
      description:
        language === "fr"
          ? "Projet final de formation en développement web, utilisant HTML5, CSS3 et JavaScript moderne."
          : language === "en"
          ? "Final project of web development training, using HTML5, CSS3 and modern JavaScript."
          : "مشروع نهائي لتدريب تطوير الويب، باستخدام HTML5 و CSS3 و JavaScript الحديث.",
      image: "https://i.ibb.co/353PrMdM/Screen-Recording2025-12-14at1-56-35-PM-ezgif-com-video-to-gif-converter.gif",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      link: "https://www.mbskills.tn/projects/web-portfolio",
    },
    // REAL PROJECTS ----------------------------
    {
      title:
        language === "fr"
          ? "Application E-commerce"
          : language === "en"
          ? "E-commerce Application"
          : "تطبيق التجارة الإلكترونية",
      description:
        language === "fr"
          ? "Plateforme de vente en ligne complète avec panier d'achat et système de paiement."
          : language === "en"
          ? "Complete online sales platform with shopping cart and payment system."
          : "منصة مبيعات عبر الإنترنت كاملة مع سلة تسوق ونظام دفع.",
      image: "https://i.ibb.co/C5xM7MPx/2.png",
      tags: ["React", "Node.js", "MongoDB"],
    },
    {
      title:
        language === "fr"
          ? "Tableau de Bord Analytique"
          : language === "en"
          ? "Analytics Dashboard"
          : "لوحة تحليلية",
      description:
        language === "fr"
          ? "Interface de visualisation de données pour l'analyse des performances commerciales."
          : language === "en"
          ? "Data visualization interface for business performance analysis."
          : "واجهة تصور البيانات لتحليل أداء الأعمال.",
      image: "https://i.ibb.co/h1M0XzSj/3.png",
      tags: ["React", "D3.js", "Python"],
    },
    {
      title:
        language === "fr"
          ? "Application Mobile de Fitness"
          : language === "en"
          ? "Fitness Mobile App"
          : "تطبيق لياقة بدنية",
      description:
        language === "fr"
          ? "Application mobile pour suivre les entraînements et la progression physique."
          : language === "en"
          ? "Mobile application to track workouts and physical progress."
          : "تطبيق جوال لتتبع التدريبات والتقدم البدني.",
      image: "https://i.ibb.co/WNbVhYPG/202512112151-2.gif",
      tags: ["React Native", "Firebase"],
    },
    {
      title:
        language === "fr"
          ? "Plateforme d'Apprentissage en Ligne"
          : language === "en"
          ? "Online Learning Platform"
          : "منصة تعلم عبر الإنترنت",
      description:
        language === "fr"
          ? "Système complet de gestion de cours avec suivi de progression et évaluations."
          : language === "en"
          ? "Complete course management system with progress tracking and assessments."
          : "نظام إدارة دورات كامل مع تتبع التقدم والتقييمات.",
      image: "https://i.ibb.co/ds8KrndC/4.png",
      tags: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    },
    {
      title:
        language === "fr"
          ? "Chatbot avec Intelligence Artificielle"
          : language === "en"
          : "ذكاء اصطناعي",
      description:
        language === "fr"
          ? "Chatbot intelligent pour service client avec traitement du langage naturel."
          : language === "en"
          ? "Intelligent chatbot for customer service with natural language processing."
          : "روبوت دردشة ذكي لخدمة العملاء مع معالجة اللغة الطبيعية.",
      image: "https://i.ibb.co/wZRsW0wJ/5.png",
      tags: ["Python", "NLP", "TensorFlow"],
    },
    // FILLER PROJECTS -----------------------------
    {
      title:
        language === "fr"
          ? "Application de Gestion de Projet"
          : language === "en"
          : "تطبيق إدارة المشروع",
      description:
        language === "fr"
          ? "Outil collaboratif pour la gestion de tâches et le suivi de projets d'équipe."
          : language === "en"
          : "أداة تعاونية لإدارة المهام وتتبع مشاريع الفريق.",
      image: "https://i.ibb.co/hJVdx8Dk/Screenshot-2025-12-13-at-1-42-32-AM.png",
      tags: ["Vue.js", "Node.js", "Express"],
    },
    {
      title:
        language === "fr"
          ? "Site Web Restaurant"
          : language === "en"
          : "موقع مطعم",
      description:
        language === "fr"
          ? "Site web moderne pour restaurant avec système de réservation en ligne."
          : language === "en"
          : "Modern restaurant website with online reservation system."
          : "موقع مطعم حديث مع نظام حجز عبر الإنترنت.",
      image: "https://i.ibb.co/2YLSRMYY/1.png",
      tags: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    },
  ];

  const marqueeProjects = [...projectsData, ...projectsData];

  return (
    <section className="py-24 relative bg-white overflow-hidden">
      {/* Inline Styles for the Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: fit-content;
          animation: marquee 75s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'fr' ? 'Projets des Étudiants' :
             language === 'en' ? 'Student Projects' :
             'مشاريع الطلاب'}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            {language === 'fr' ? "Une sélection de projets réalisés par nos étudiants durant leur formation." :
             language === 'en' ? "A selection of projects completed by our students during their training." :
             "مجموعة مختارة من المشاريع التي أكملها طلابنا أثناء تدريبهم."}
          </p>
        </motion.div>
      </div>

      <div 
        className="marquee-container relative w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="marquee-track flex gap-8 py-8 px-4">
          {marqueeProjects.map((project, index) => (
            <div
              key={`${index}-${project.title}`}
              className="flex-shrink-0 w-[350px] md:w-[400px] group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                     <h3 
                      className="text-xl font-bold text-gray-900 leading-snug transition-colors line-clamp-1 group-hover:text-[var(--hover-color)]"
                      style={{ 
                        ['--hover-color' as any]: secondaryColor 
                      }}
                     >
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 flex-grow">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase"
                          style={{
                            backgroundColor: '#f0f9ff',
                            color: secondaryColor,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* *** CHANGE: Only show the button for the WEB DEVELOPMENT PROJECT *** */}
                    {project.title === "PORTFOLIO WEB DÉVELOPPEUR" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:text-white transition-all duration-300"
                        style={{ 
                          color: '#1f2937' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = secondaryColor;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.color = '#1f2937';
                        }}
                        aria-label="Voir le projet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;