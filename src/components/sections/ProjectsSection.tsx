// ProjectsSection.tsx (Updated for MBSkills)
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../../types';

interface Course {
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

  const coursesData: Course[] = [
    // WEB DEVELOPMENT COURSE
    {
      title: "DÉVELOPPEMENT WEB FULL STACK",
      description:
        language === "fr"
          ? "Formation complète en développement web front-end et back-end avec HTML5, CSS3, JavaScript, React et Node.js."
          : language === "en"
          ? "Complete training in front-end and back-end web development with HTML5, CSS3, JavaScript, React and Node.js."
          : "تدريب شامل في تطوير الواجهة الأمامية والخلفية للويب باستخدام HTML5 و CSS3 و JavaScript و React و Node.js.",
      image: "https://i.ibb.co/353PrMdM/Screen-Recording2025-12-14at1-56-35-PM-ezgif-com-video-to-gif-converter.gif",
      tags: ["HTML5", "CSS3", "JavaScript", "React", "Node.js"],
      link: "https://www.mbskills.tn/courses/web-development",
    },
    // OTHER COURSES ----------------------------
    {
      title:
        language === "fr"
          ? "DÉVELOPPEMENT D'APPLICATIONS MOBILES"
          : language === "en"
          ? "MOBILE APPLICATION DEVELOPMENT"
          : "تطوير تطبيقات الجوال",
      description:
        language === "fr"
          ? "Apprenez à créer des applications mobiles natives et multiplateformes avec React Native et Flutter."
          : language === "en"
          ? "Learn to create native and cross-platform mobile applications with React Native and Flutter."
          : "تعلم كيفية إنشاء تطبيقات جوال أصلية ومتعددة المنصات باستخدام React Native و Flutter.",
      image: "https://i.ibb.co/C5xM7MPx/2.png",
      tags: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      title:
        language === "fr"
          ? "DATA SCIENCE ET INTELLIGENCE ARTIFICIELLE"
          : language === "en"
          ? "DATA SCIENCE AND ARTIFICIAL INTELLIGENCE"
          : "علم البيانات والذكاء الاصطناعي",
      description:
        language === "fr"
          ? "Maîtrisez l'analyse de données, le machine learning et le deep learning avec Python et TensorFlow."
          : language === "en"
          ? "Master data analysis, machine learning and deep learning with Python and TensorFlow."
          : "أتقن تحليل البيانات والتعلم الآلي والتعلم العميق باستخدام Python و TensorFlow.",
      image: "https://i.ibb.co/h1M0XzSj/3.png",
      tags: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"],
    },
    {
      title:
        language === "fr"
          ? "DÉVELOPPEMENT LOGICIEL ET INGÉNIERIE"
          : language === "en"
          ? "SOFTWARE DEVELOPMENT AND ENGINEERING"
          : "تطوير البرمجيات والهندسة",
      description:
        language === "fr"
          ? "Apprenez les principes de l'ingénierie logicielle, la conception d'architecture et la gestion de projet."
          : language === "en"
          ? "Learn software engineering principles, architecture design and project management."
          : "تعلم مبادئ هندسة البرمجيات وتصميم البنية وإدارة المشاريع.",
      image: "https://i.ibb.co/WNbVhYPG/202512112151-2.gif",
      tags: ["Software Architecture", "Agile", "DevOps", "Testing"],
    },
    {
      title:
        language === "fr"
          ? "COMPÉTENCES NUMÉRIQUES ET TRANSFORMATION DIGITALE"
          : language === "en"
          ? "DIGITAL SKILLS AND DIGITAL TRANSFORMATION"
          : "المهارات الرقمية والتحول الرقمي",
      description:
        language === "fr"
          ? "Développez vos compétences numériques pour réussir dans l'économie moderne."
          : language === "en"
          : "طور مهاراتك الرقمية للنجاح في الاقتصاد الحديث.",
      image: "https://i.ibb.co/ds8KrndC/4.png",
      tags: ["Digital Marketing", "SEO", "Social Media", "E-commerce"],
    },
    {
      title:
        language === "fr"
          ? "CYBERSÉCURITÉ ET SÉCURITÉ DES RÉSEAUX"
          : language === "en"
          ? "CYBERSECURITY AND NETWORK SECURITY"
          : "الأمن السيبراني وأمن الشبكات",
      description:
        language === "fr"
          ? "Apprenez à protéger les systèmes, les réseaux et les données contre les menaces numériques."
          : language === "en"
          : "تعلم كيفية حماية الأنظمة والشبكات والبيانات من التهديدات الرقمية.",
      image: "https://i.ibb.co/wZRsW0wJ/5.png",
      tags: ["Network Security", "Ethical Hacking", "Cryptography", "Risk Management"],
    },
    // ADDITIONAL COURSES -----------------------------
    {
      title:
        language === "fr"
          ? "UI/UX DESIGN ET EXPÉRIENCE UTILISATEUR"
          : language === "en"
          : "تصميم واجهة وتجربة المستخدم",
      description:
        language === "fr"
          ? "Créez des interfaces utilisateur attrayantes et des expériences utilisateur optimales."
          : language === "en"
          : "إنشاء واجهات مستخدم جذابة وتجارب مستخدم مثالية.",
      image: "https://i.ibb.co/hJVdx8Dk/Screenshot-2025-12-13-at-1-42-32-AM.png",
      tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    },
    {
      title:
        language === "fr"
          ? "BLOCKCHAIN ET DÉVELOPPEMENT WEB3"
          : language === "en"
          : "بلوك تشين وتطوير Web3",
      description:
        language === "fr"
          : "تعلم كيفية بناء تطبيقات لامركزية و استخدام تقنيات blockchain.",
      image: "https://i.ibb.co/2YLSRMYY/1.png",
      tags: ["Smart Contracts", "Solidity", "DeFi", "NFTs"],
    },
  ];

  const marqueeCourses = [...coursesData, ...coursesData];

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
            {language === 'fr' ? 'Nos Formations' :
             language === 'en' ? 'Our Training Programs' :
             'برامجنا التدريبية'}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            {language === 'fr' ? "Découvrez nos programmes de formation spécialisés dans les technologies de l'information." :
             language === 'en' ? "Discover our specialized training programs in information technology." :
             "اكتشف برامجنا التدريبية المتخصصة في تكنولوجيا المعلومات."}
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
          {marqueeCourses.map((course, index) => (
            <div
              key={`${index}-${course.title}`}
              className="flex-shrink-0 w-[350px] md:w-[400px] group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
                  <img
                    src={course.image}
                    alt={course.title}
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
                      {course.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 flex-grow">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 2).map((tag, i) => (
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

                    {/* Only show the button for the WEB DEVELOPMENT COURSE */}
                    {course.title === "DÉVELOPPEMENT WEB FULL STACK" && (
                      <a
                        href={course.link}
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
                        aria-label="Voir la formation"
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