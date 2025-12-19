// FooterSection.tsx (Updated for MBSkills)
import React from 'react';
import { Instagram, Globe } from 'lucide-react';
import { Language } from '../../types';

interface FooterSectionProps {
  language: Language;
  t: (key: string) => string;
}

const FooterSection: React.FC<FooterSectionProps> = ({ language, t }) => {
  const primaryColor = '#122138';
  const secondaryColor = '#04a3fe';

  return (
    <footer id="contact" className="bg-gradient-to-t from-blue-50 to-white border-t border-gray-200 py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <img 
                  src="https://i.ibb.co/ZzHk1Xzt/logo.png" 
                  alt="MBSkills Logo" 
                  className="relative h-16 w-auto object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
              <span className="text-2xl font-bold" style={{ color: primaryColor }}>MBSkills</span>
            </div>
            <p className="text-gray-600 mb-6">
              {t('footerDesc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-1" style={{ color: primaryColor }}>{t('contactInfo')}</h3>
            <div className="space-y-4 text-gray-600">
              <p>📧 contact@mbskills.tn</p>
              <p>📞 +216 20 497 239</p>
              <p>📍 Tunis, Tunisia</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-1" style={{ color: primaryColor }}>{t('connectWith')}</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/mbskills/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:scale-110 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
                aria-label="Suivez-nous sur Instagram"
              >
                <Instagram className="h-6 w-6 text-white" />
              </a>
              <a 
                href="https://www.facebook.com/mbskills/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:scale-110 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
                aria-label="Suivez-nous sur Facebook"
              >
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/mbskills/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:scale-110 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
                aria-label="Suivez-nous sur LinkedIn"
              >
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <p className="text-gray-500 mt-4 text-sm">
              {t('followUs')}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;