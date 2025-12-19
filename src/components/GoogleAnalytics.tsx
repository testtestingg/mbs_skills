// src/components/GoogleAnalytics.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = 'G-N3MN1NQCT7'; // Replace with your actual GA4 ID

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        send_page_view: false // We'll send page views manually
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
      
      // Custom event for SPA page views
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Enhanced index.html additions (add these to your existing index.html)
const indexHtmlAdditions = `
<!-- Add these to your index.html <head> section -->

<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE" />

<!-- Enhanced Meta Tags for Search Console -->
<meta name="application-name" content="TechyTak" />
<meta name="msapplication-tooltip" content="TechyTak - Agence Web Tunisie" />
<meta name="msapplication-starturl" content="/" />

<!-- Structured Data for Local Business (replace existing) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "TechyTak",
  "image": "https://techytak.tn/logo.png",
  "description": "Agence web tunisienne spécialisée développement web, applications mobile, UI/UX design et solutions e-commerce",
  "url": "https://techytak.tn",
  "telephone": "+216-20-497-239",
  "email": "hello@techytak.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tunis",
    "addressLocality": "Tunis",
    "postalCode": "1000",
    "addressRegion": "Tunis",
    "addressCountry": "TN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.8065,
    "longitude": 10.1815
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday", 
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://www.facebook.com/techytak",
    "https://www.instagram.com/techytak"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Tunisia"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "TechyTak Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Développement Web",
          "description": "Création de sites web modernes et responsifs"
        },
        "price": "200",
        "priceCurrency": "TND"
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Applications Mobile",
          "description": "Développement d'applications iOS et Android"
        },
        "price": "500",
        "priceCurrency": "TND"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "UI/UX Design",
          "description": "Design d'interfaces utilisateur modernes"
        },
        "price": "300",
        "priceCurrency": "TND"
      }
    ]
  }
}
</script>

<!-- Core Web Vitals Optimization -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"></noscript>

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://images.unsplash.com">

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">

<!-- Critical CSS Inlining (move your most important CSS here) -->
<style>
/* Critical Above-the-fold CSS - add your most important styles here */
.text-gradient {
  background: linear-gradient(135deg, #8B5FFF 0%, #A855F7 30%, #6366F1 70%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
`;

export default GoogleAnalytics;