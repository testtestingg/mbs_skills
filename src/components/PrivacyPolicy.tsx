import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Language } from '../types';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose, language }) => {
  const privacyContent = {
    fr: {
      title: "Politique de Confidentialité",
      sections: [
        {
          title: "Collecte des données",
          content: "Nous collectons des informations lorsque vous nous contactez via notre formulaire de contact ou lorsque vous utilisez nos services. Ces informations peuvent inclure votre nom, adresse e-mail, numéro de téléphone et d'autres détails pertinents pour répondre à votre demande."
        },
        {
          title: "Utilisation des données",
          content: "Les informations que nous collectons sont utilisées pour fournir nos services, communiquer avec vous concernant nos offres, et améliorer l'expérience utilisateur sur notre site web."
        },
        {
          title: "Partage des données",
          content: "Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf si cela est nécessaire pour fournir nos services ou si nous y sommes légalement tenus."
        },
        {
          title: "Sécurité des données",
          content: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction."
        },
        {
          title: "Cookies",
          content: "Notre site web utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez choisir de désactiver les cookies dans les paramètres de votre navigateur."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      sections: [
        {
          title: "Data Collection",
          content: "We collect information when you contact us through our contact form or when you use our services. This information may include your name, email address, phone number, and other relevant details to respond to your inquiry."
        },
        {
          title: "Data Usage",
          content: "The information we collect is used to provide our services, communicate with you about our offerings, and improve user experience on our website."
        },
        {
          title: "Data Sharing",
          content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services or as required by law."
        },
        {
          title: "Data Security",
          content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          title: "Cookies",
          content: "Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings."
        }
      ]
    },
    ar: {
      title: "سياسة الخصوصية",
      sections: [
        {
          title: "جمع البيانات",
          content: "نجمع المعلومات عندما تتصل بنا عبر نموذج الاتصال الخاص بنا أو عند استخدام خدماتنا. قد تشمل هذه المعلومات اسمك وعنوان البريد الإلكتروني ورقم الهاتف وتفاصيل أخرى ذات صلة للرد على استفسارك."
        },
        {
          title: "استخدام البيانات",
          content: "يتم استخدام المعلومات التي نجمعها لتقديم خدماتنا والتواصل معك حول عروضنا وتحسين تجربة المستخدم على موقعنا الإلكتروني."
        },
        {
          title: "مشاركة البيانات",
          content: "لا نبيع أو نتجادل أو ننقل معلوماتك الشخصية إلى أطراف ثالثة دون موافقتك، إلا كما هو ضروري لتقديم خدماتنا أو كما يقتضي القانون."
        },
        {
          title: "أمان البيانات",
          content: "نحن نطبق تدابير أمنية مناسبة لحماية معلوماتك الشخصية ضد الوصول غير المصرح به أو التعديل أو الكشف أو التدمير."
        },
        {
          title: "ملفات تعريف الارتباط (الكوكيز)",
          content: "يستخدم موقعنا الإلكتروني ملفات تعريف الارتباط (الكوكيز) لتعزيز تجربة التصفح الخاصة بك. يمكنك اختيار تعطيل ملفات تعريف الارتباط في إعدادات المتصفح الخاص بك."
        }
      ]
    }
  };

  const content = privacyContent[language];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            {content.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                {language === 'fr' 
                  ? "Cette politique de confidentialité est susceptible d'être modifiée. Toute modification sera publiée sur cette page."
                  : language === 'en'
                  ? "This privacy policy is subject to change. Any changes will be posted on this page."
                  : "هذه سياسة الخصوصية عرضة للتغيير. سيتم نشر أي تغييرات على هذه الصفحة."
                }
              </p>
              <p className="text-sm text-gray-500">
                {language === 'fr' 
                  ? `Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}`
                  : language === 'en'
                  ? `Last updated: ${new Date().toLocaleDateString('en-US')}`
                  : `آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicy;