import React from 'react';
import { Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface LanguageBannerProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  onClose: () => void;
  onPrivacyPolicyOpen: () => void;
  t: (key: string) => string;
  isVisible: boolean;
}

const LanguageBanner: React.FC<LanguageBannerProps> = ({ 
  language, 
  changeLanguage, 
  onClose, 
  onPrivacyPolicyOpen, 
  t,
  isVisible
}) => {
  // Determine if we're in RTL mode
  const isRTL = language === 'ar';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-2 sm:left-1/3 sm:ml-10 z-50 w-11/12 sm:w-[28rem] glass-effect rounded-xl shadow-xl bg-white/80 backdrop-blur-lg border border-white/30"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <span className="text-gray-800 text-sm font-medium">
                {t('languageDetected')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    changeLanguage(lang);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    language === lang 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-purple-100'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="px-4 pb-3">
            <button
              onClick={onPrivacyPolicyOpen}
              className="text-gray-500 hover:text-purple-600 transition-colors text-xs underline-offset-2 underline"
            >
              {language === 'fr' ? 'Politique de confidentialité' : 
               language === 'en' ? 'Privacy Policy' : 
               'سياسة الخصوصية'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageBanner;
