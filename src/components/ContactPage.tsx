import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, AlertCircle, Smartphone, Mail, Phone, MessageSquare, MapPin, Clock, User } from 'lucide-react';
import { analyticsService } from "./services/analyticsService";
import { supabase } from "./lib/supabaseClient";

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'en' | 'ar';
  translations: any;
}

const ContactPage = ({ isOpen, onClose, language, translations }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'info'>('form');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const customPurple = '#682cda'; // Purple color matching your brand

  const t = (key: string): string => translations[key]?.[language] || key;

  const services = [
    { value: 'website', label: t('websitesTitle') },
    { value: 'mobile', label: t('appsTitle') },
    { value: 'custom', label: t('customTitle') }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const serviceValue = formData.service;
      
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: serviceValue,
          message: formData.message,
          language: language,
          status: 'pending'
        }]);
      
      if (error) throw error;
      
      analyticsService.trackContactSubmission(formData, 'success', language);
      
      const message = `New contact request from TechyTak website:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${serviceValue}\nMessage: ${formData.message}`;
      const businessPhone = '21620497239';
      const apiKey = '9633088';
      const encodedMessage = encodeURIComponent(message);
      
      try {
        await fetch(`https://api.callmebot.com/whatsapp.php?phone=${businessPhone}&text=${encodedMessage}&apikey=${apiKey}`, {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
      }
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form',
          content_category: 'Lead Generation',
          service: serviceValue,
          language: language
        });
      }
      
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      analyticsService.trackContactSubmission(formData, 'error', language);
      setErrorMessage('Failed to send message. Please check your Network connection');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Facebook Pixel tracking
  useEffect(() => {
    if (isOpen && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: 'Contact Modal',
        content_category: 'Lead Generation'
      });
    }
  }, [isOpen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && 
          backdropRef.current && backdropRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRTL = language === 'ar';

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-lg"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative bg-white border border-purple-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ 
          transform: 'translateZ(0)', // Force GPU acceleration
          willChange: 'transform' 
        }}
      >
        {/* Close Button - Properly positioned for RTL */}
        <button 
          onClick={onClose}
          className={`absolute top-4 z-10 p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors ${
            isRTL ? 'left-4' : 'right-4'
          }`}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-purple-700" />
        </button>
        
        {/* Header */}
        <div className="p-6 border-b border-purple-100">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 text-center">{t('contact')}</h2>
          <p className="text-gray-600 text-center mt-2">
            {language === 'fr' ? "Nous vous répondrons dans les plus brefs délais" : 
             language === 'en' ? "We'll get back to you as soon as possible" : 
             "سنتواصل معك في أقرب وقت ممكن"}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-purple-100">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'form' 
                ? 'text-purple-700 border-b-2 border-purple-600' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setActiveTab('form')}
          >
            {language === 'fr' ? "Formulaire" : 
             language === 'en' ? "Contact Form" : 
             "نموذج الاتصال"}
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'info' 
                ? 'text-purple-700 border-b-2 border-purple-600' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setActiveTab('info')}
          >
            {language === 'fr' ? "Informations" : 
             language === 'en' ? "Contact Info" : 
             "معلومات الاتصال"}
          </button>
        </div>
        
        {/* Content with fixed height and scrolling */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'form' ? (
            <div className="p-6">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    {language === 'fr' ? "Message envoyé avec succès !" : 
                     language === 'en' ? "Message sent successfully!" : 
                     "تم إرسال الرسالة بنجاح!"}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'fr' ? "Nous vous contacterons bientôt." : 
                     language === 'en' ? "We'll contact you soon." : 
                     "سنتواصل معك قريبا ."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        {language === 'fr' ? "Nom complet" : 
                         language === 'en' ? "Full Name" : 
                         "الاسم الكامل"}
                      </label>
                      <div className="relative">
                        <User className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ${
                          isRTL ? 'right-3' : 'left-3'
                        }`} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white border border-purple-200 rounded-lg py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          }`}
                          placeholder={language === 'fr' ? "Votre nom" : 
                                      language === 'en' ? "Your name" : 
                                      "اسمك"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">
                        {language === 'fr' ? "Adresse e-mail" : 
                         language === 'en' ? "Email Address" : 
                         "البريد الإلكتروني"}
                      </label>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ${
                          isRTL ? 'right-3' : 'left-3'
                        }`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full bg-white border border-purple-200 rounded-lg py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          }`}
                          placeholder={language === 'fr' ? "votre@email.com" : 
                                      language === 'en' ? "your@email.com" : 
                                      "بريدك@الإلكتروني.com"}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {language === 'fr' ? "Numéro de téléphone" : 
                       language === 'en' ? "Phone Number" : 
                       "رقم الهاتف"}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full bg-white border border-purple-200 rounded-lg py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                        }`}
                        placeholder={language === 'fr' ? "+216 XX XXX XXX" : 
                                    language === 'en' ? "+216 XX XXX XXX" : 
                                    "+216 XX XXX XXX"}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {language === 'fr' ? "Service intéressé" : 
                       language === 'en' ? "Service of Interest" : 
                         "الخدمة المطلوبة"}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-purple-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'fr' ? "Sélectionnez un service" : 
                         language === 'en' ? "Select a service" : 
                         "اختر خدمة"}
                      </option>
                      {services.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {language === 'fr' ? "Message" : 
                         language === 'en' ? "Message" : 
                         "الرسالة"}
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute top-3 h-5 w-5 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={`w-full bg-white border border-purple-200 rounded-lg py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                        }`}
                        placeholder={language === 'fr' ? "Décrivez votre projet..." : 
                                    language === 'en' ? "Describe your project..." : 
                                    "صف مشروعك..."}
                      ></textarea>
                    </div>
                  </div>
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start">
                    <Smartphone className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-purple-700 text-sm">
                      {language === 'fr' 
                        ? "Ce formulaire vous permet de nous envoyer un message directement. Nous vous répondrons dans les plus brefs délais." 
                        : language === 'en' 
                          ? "This form allows you to send us a message directly. We'll reply as soon as possible." 
                          : "يتيح لك هذا النموذج إرسال رسالة إلينا مباشرة. سنرد عليك في أقرب وقت ممكن."}
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3, 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'fr' ? "Envoi en cours..." : 
                         language === 'en' ? "Sending..." : 
                         "جاري الإرسال..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {language === 'fr' ? "Envoyer" : 
                         language === 'en' ? "Send" : 
                         "إرسال"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">
                    {language === 'fr' ? "Informations de contact" : 
                     language === 'en' ? "Contact Information" : 
                     "معلومات الاتصال"}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          {language === 'fr' ? "Email" : 
                           language === 'en' ? "Email" : 
                           "البريد الإلكتروني"}
                        </p>
                        <a href="mailto:contact.techytak@gmail.com" className="text-purple-700 hover:text-purple-900 transition-colors">
                          contact.techytak@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          {language === 'fr' ? "Téléphone" : 
                           language === 'en' ? "Phone" : 
                           "الهاتف"}
                        </p>
                        <a href="tel:+21620497239" className="text-purple-700 hover:text-purple-900 transition-colors">
                          +216 20 497 239
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">
                          {language === 'fr' ? "Adresse" : 
                           language === 'en' ? "Address" : 
                           "العنوان"}
                        </p>
                        <p className="text-purple-700">
                          {language === 'fr' ? "Tunis, Tunisie" : 
                           language === 'en' ? "Tunis, Tunisia" : 
                           "تونس، تونس"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Working Hours */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-purple-600 mr-2" />
                    {language === 'fr' ? "Heures de travail" : 
                     language === 'en' ? "Working Hours" : 
                     "ساعات العمل"}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {language === 'fr' ? "Lundi - Vendredi" : 
                         language === 'en' ? "Monday - Friday" : 
                         "الإثنين - الجمعة"}
                      </span>
                      <span className="text-purple-700">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {language === 'fr' ? "Samedi" : 
                         language === 'en' ? "Saturday" : 
                         "السبت"}
                      </span>
                      <span className="text-purple-700">10:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {language === 'fr' ? "Dimanche" : 
                         language === 'en' ? "Sunday" : 
                         "الأحد"}
                      </span>
                      <span className="text-purple-700">
                        {language === 'fr' ? "Fermé" : 
                         language === 'en' ? "Closed" : 
                         "مغلق"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* WhatsApp Contact */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold text-green-800">
                      {language === 'fr' ? "Contactez-nous sur WhatsApp" : 
                       language === 'en' ? "Contact us on WhatsApp" : 
                       "تواصل معنا عبر واتساب"}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {language === 'fr' 
                      ? "Vous pouvez également nous contacter directement via WhatsApp pour une réponse plus rapide." 
                      : language === 'en' 
                        ? "You can also contact us directly via WhatsApp for a faster response." 
                        : "يمكنك أيضًا التواصل معنا مباشرة عبر واتساب للحصول على رد أسرع."}
                  </p>
                  
                  <a 
                    href="https://wa.me/21620497239" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {language === 'fr' ? "Ouvrir WhatsApp" : 
                     language === 'en' ? "Open WhatsApp" : 
                     "فتح واتساب"}
                  </a>
                </div>
                
                {/* Quick Contact Button */}
                <button
                  onClick={() => setActiveTab('form')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {language === 'fr' ? "Envoyer un message" : 
                   language === 'en' ? "Send a Message" : 
                   "إرسال رسالة"}
                </button>
              </div>
            </div>
          )}
        </div> 
        
        {/* Footer Note */}
        <div className="p-4 border-t border-purple-100 text-center text-gray-600 text-sm">
          {language === 'fr' ? "Nous vous répondrons dans les plus brefs délais." : 
           language === 'en' ? "We'll reply to you as soon as possible." : 
           "سنتواصل معك في أقرب وقت ممكن."}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
