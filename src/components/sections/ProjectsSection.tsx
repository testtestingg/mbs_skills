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
  // Updated Purple Color
  const customPurple = '#8030E3';

  const projectsData: Project[] = [
    // GAME PROJECT - Added at the beginning
    {
      title: "NEON BLAST GAME",
      description:
        language === "fr"
          ? "Un jeu d'action au style néon développé avec HTML5, CSS3 et JavaScript."
          : language === "en"
          ? "A neon-styled action game built with HTML5, CSS3 and JavaScript."
          : "لعبة أكشن بأسلوب نيون مبنية باستخدام HTML5 و CSS3 و JavaScript.",
      image: "https://i.ibb.co/353PrMdM/Screen-Recording2025-12-14at1-56-35-PM-ezgif-com-video-to-gif-converter.gif",
      tags: ["HTML5", "Canvas API", "JavaScript", "CSS3"],
      link: "https://www.techytak.tn/game/index.html",
    },
    // REAL PROJECTS ----------------------------
    {
      title:
        language === "fr"
          ? "Automobile"
          : language === "en"
          ? "Auto Marketplace"
          : "أرغوس أوتوموبيل",
      description:
        language === "fr"
          ? "Achat/Vente avec estimation IA."
          : language === "en"
          ? "Buy/Sell with AI price estimation."
          : "بيع وشراء مع تقدير الأسعار بالذكاء الاصطناعي.",
      image: "https://i.ibb.co/C5xM7MPx/2.png",
      tags: ["AI", "Supabase"],
    },
    {
      title:
        language === "fr"
          ? "Mobilier & Décoration"
          : language === "en"
          ? "Furniture & Home"
          : "الأثاث وديكور المنزل",
      description:
        language === "fr"
          ? "E-commerce haut de gamme avec interface élégante."
          : language === "en"
          ? "Premium e-commerce with elegant interface."
          : "تجارة إلكترونية راقية بواجهة أنيقة.",
      image: "https://i.ibb.co/h1M0XzSj/3.png",
      tags: ["Shop UI", "UX Design"],
    },
    {
      title:
        language === "fr"
          ? "Tableau de Bord"
          : language === "en"
          ? "Analytics Dashboard"
          : "لوحة التحكم",
      description:
        language === "fr"
          ? "Visualisation de données et gestion interne."
          : language === "en"
          ? "Data visualization and internal management."
          : "تصور البيانات والإدارة الداخلية.",
      image: "https://i.ibb.co/WNbVhYPG/202512112151-2.gif",
      tags: ["Next.js", "PostgreSQL"],
    },
    {
      title:
        language === "fr"
          ? "Éducation"
          : language === "en"
          ? "Learning Platform"
          : "منصة تعليمية",
      description:
        language === "fr"
          ? "Gestion des cours, examens et espace étudiant."
          : language === "en"
          ? "Course management, exams, and student portal."
          : "إدارة الدروس والامتحانات ومساحة الطالب.",
      image: "https://i.ibb.co/ds8KrndC/4.png",
      tags: ["React", "Supabase"],
    },
    {
      title:
        language === "fr"
          ? "Site Officiel"
          : language === "en"
          ? "Official Website"
          : "الموقع الرسمي",
      description:
        language === "fr"
          ? "Site vitrine optimisé SEO et performance."
          : language === "en"
          ? "Showcase site optimized for SEO/Performance."
          : "موقع تعريفي محسن لمحركات البحث والأداء.",
      image: "https://i.ibb.co/wZRsW0wJ/5.png",
      tags: ["Next.js", "SEO"],
    },
    // FILLER PROJECTS -----------------------------
    {
      title:
        language === "fr"
          ? "Tableau de bord + Conception créative"
          : language === "en"
          ? "Dashboard + Creative Design"
          : "لوحة التحكم + تصميم إبداعي",
      description:
        language === "fr"
          ? "Plateforme tout-en-un d'outils créatifs, d'apprentissage et de collaboration"
          : language === "en"
          ? "All-in-one creative tools, learning, collaboration hub."
          : "مركز متكامل للأدوات الإبداعية والتعلم والتعاون.",
      image: "https://i.ibb.co/hJVdx8Dk/Screenshot-2025-12-13-at-1-42-32-AM.png",
      tags: ["Node.js", "MongoDB"],
    },
    {
      title:
        language === "fr"
          ? "Landing Page – Studio de Tatouage"
          : language === "en"
          ? "Tattoo Studio Landing Page"
          : "صفحة هبوط – ستوديو وشم",
      description:
        language === "fr"
          ? "Landing page moderne pour tatoueur avec galerie, prise de rendez-vous et CTA clair."
          : language === "en"
          ? "Modern landing page for a tattoo artist featuring gallery, booking section, and clear CTAs."
          : "صفحة هبوط عصرية لستوديو وشم مع معرض أعمال ونظام حجز ودعوات واضحة للإجراء.",
      image: "https://i.ibb.co/2YLSRMYY/1.png",
      tags: ["Landing Page", "UI Design", "Branding"],
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
              background: `linear-gradient(135deg, #111827 0%, ${customPurple} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {language === 'fr' ? 'Nos Réalisations' :
             language === 'en' ? 'Featured Work' :
             'أعمالنا المميزة'}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            {language === 'fr' ? "Une sélection de projets numériques innovants et performants." :
             language === 'en' ? "A selection of innovative and high-performance digital projects." :
             "مجموعة مختارة من المشاريع الرقمية المبتكرة وذات الأداء العالي."}
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
                        ['--hover-color' as any]: customPurple 
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
                            backgroundColor: '#f5f3ff',
                            color: customPurple,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* *** CHANGE: Only show the button for the NEON BLAST GAME *** */}
                    {project.title === "NEON BLAST GAME" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:text-white transition-all duration-300"
                        style={{ 
                          color: '#1f2937' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = customPurple;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.color = '#1f2937';
                        }}
                        aria-label="Play Game"
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
