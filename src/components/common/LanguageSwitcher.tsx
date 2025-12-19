import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSwitcherProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, changeLanguage }) => {
  return (
    <div className="glass-effect rounded-full p-2">
      <div className="flex space-x-1">
        {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              language === lang 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-purple-600/20'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;