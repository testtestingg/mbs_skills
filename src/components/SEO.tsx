import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  language: 'fr' | 'en' | 'ar';
}

const SEO: React.FC<SEOProps> = ({ language }) => {
  const titles = {
    fr: 'TechyTak - Agence Web Tunisie | Développement Web & Applications Mobile dès 200 TND',
    en: 'TechyTak - Tunisia Web Agency | Web Development & Mobile Apps from 200 TND',
    ar: 'تيكيتاك - وكالة الويب تونس | تطوير الويب وتطبيقات الجوال من 200 دينار'
  };
  
  const descriptions = {
    fr: 'TechyTak - Agence web tunisienne spécialisée développement sites web, applications mobile React Native/Flutter, UI/UX design, e-commerce. Solutions digitales abordables startups entreprises Tunis.',
    en: 'TechyTak - Tunisian web agency specialized in website development, React Native/Flutter mobile apps, UI/UX design, e-commerce. Affordable digital solutions for startups and businesses in Tunisia.',
    ar: 'تيكيتاك - وكالة ويب تونسية متخصصة في تطوير المواقع، تطبيقات الجوال React Native/Flutter، تصميم UI/UX، التجارة الإلكترونية. حلول رقمية بأسعار معقولة للشركات الناشئة والمؤسسات في تونس.'
  };
  
  const keywords = {
    fr: 'agence web tunisie, développement web tunis, création site web tunisie, application mobile tunisie, react native tunisia, flutter tunisie, ui ux design tunisie, e-commerce tunisie, développeur web tunis, startup technology tunisia, sites web modernes tunisie, développement frontend backend tunis',
    en: 'tunisia web agency, web development tunis, website creation tunisia, mobile app tunisia, react native tunisia, flutter tunisia, ui ux design tunisia, ecommerce tunisia, web developer tunis, startup technology tunisia, modern websites tunisia, frontend backend development tunis',
    ar: 'وكالة ويب تونس, تطوير الويب تونس, إنشاء موقع ويب تونس, تطبيق الجوال تونس, react native تونس, flutter تونس, تصميم ui ux تونس, التجارة الإلكترونية تونس, مطور ويب تونس, تكنولوجيا الشركات الناشئة تونس'
  };
  
  const ogLocale = {
    fr: 'fr_TN',
    en: 'en_US', 
    ar: 'ar_TN'
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{titles[language]}</title>
      <meta name="description" content={descriptions[language]} />
      <meta name="keywords" content={keywords[language]} />
      <meta name="author" content="TechyTak" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geographic Targeting */}
      <meta name="geo.region" content="TN" />
      <meta name="geo.placename" content="Tunisia" />
      <meta name="geo.position" content="36.8065;10.1815" />
      <meta name="ICBM" content="36.8065, 10.1815" />
      
      {/* Language and Hreflang */}
      <html lang={language} />
      <link rel="alternate" hrefLang="fr" href="https://techytak.tn/?lang=fr" />
      <link rel="alternate" hrefLang="en" href="https://techytak.tn/?lang=en" />
      <link rel="alternate" hrefLang="ar" href="https://techytak.tn/?lang=ar" />
      <link rel="alternate" hrefLang="x-default" href="https://techytak.tn/" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://techytak.tn/" />
      <meta property="og:title" content={titles[language]} />
      <meta property="og:description" content={descriptions[language]} />
      <meta property="og:image" content="https://techytak.tn/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="TechyTak - Agence Web Tunisie" />
      <meta property="og:locale" content={ogLocale[language]} />
      <meta property="og:site_name" content="TechyTak" />
      
      {/* Instagram Meta Tags */}
      <meta property="instagram:title" content={titles[language]} />
      <meta property="instagram:description" content={descriptions[language]} />
      
      {/* Additional SEO Tags */}
      <link rel="canonical" href="https://techytak.tn/" />
      <meta name="theme-color" content="#8B5FFF" />
      <meta name="msapplication-TileColor" content="#8B5FFF" />
      
      {/* Performance & Technical */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon and Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="https://i.ibb.co/0RHzk9th/Techytak-logo.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="https://i.ibb.co/0RHzk9th/Techytak-logo.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Fonts Optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TechyTak",
          "url": "https://techytak.tn",
          "logo": "https://techytak.tn/logo.png",
          "description": descriptions[language],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "TN",
            "addressRegion": "Tunis",
            "addressLocality": "Tunis"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+216-20-497-239",
            "contactType": "customer service",
            "email": "hello@techytak.com",
            "areaServed": "TN",
            "availableLanguage": ["French", "English", "Arabic"]
          },
          "sameAs": [
            "https://www.facebook.com/techytak",
            "https://www.instagram.com/techy_tak"
          ],
          "priceRange": "$$",
          "foundingDate": "2024",
          "founder": {
            "@type": "Organization",
            "name": "TechyTak Team"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Tunisia"
          },
          "knowsAbout": [
            "Web Development",
            "Mobile App Development", 
            "React",
            "React Native",
            "Vue.js",
            "Node.js",
            "Python",
            "Flutter",
            "UI/UX Design",
            "E-commerce Development",
            "Digital Transformation"
          ],
          "offers": {
            "@type": "Offer",
            "name": "Web Development Services",
            "description": "Professional web development and mobile app services",
            "priceCurrency": "TND",
            "price": "200",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": 200,
              "priceCurrency": "TND"
            }
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;