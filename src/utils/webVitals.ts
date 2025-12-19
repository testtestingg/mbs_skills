// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

interface WebVitalMetric extends Metric {
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Rating thresholds based on Google's recommendations
const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 }
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Send metrics to analytics
const sendToAnalytics = (metric: Metric) => {
  const webVitalMetric: WebVitalMetric = {
    ...metric,
    rating: getMetricRating(metric.name, metric.value)
  };

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      custom_map: {
        metric_rating: webVitalMetric.rating,
        metric_delta: Math.round(metric.delta)
      }
    });
  }

  // Send to your own analytics endpoint (optional)
  if (typeof window !== 'undefined') {
    fetch('/api/web-vitals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: webVitalMetric.rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(err => {
      // Silently fail - don't break the user experience
      if (process.env.NODE_ENV === 'development') {
        console.warn('Web Vitals analytics send failed:', err);
      }
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${metric.name}: ${metric.value}ms (${webVitalMetric.rating})`);
  }
};

// Initialize Web Vitals monitoring
export const initWebVitals = () => {
  try {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  } catch (error) {
    console.warn('Web Vitals initialization failed:', error);
  }
};

// src/main.tsx - Add this to your existing main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initWebVitals } from './utils/webVitals'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Initialize Web Vitals monitoring after the app renders
if (typeof window !== 'undefined') {
  // Delay to ensure the app is fully loaded
  setTimeout(() => {
    initWebVitals();
  }, 1000);
}

// src/components/GoogleAnalytics.tsx - Enhanced version
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
  language: 'fr' | 'en' | 'ar';
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId, language }) => {
  useEffect(() => {
    // Only load in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.VITE_ENABLE_ANALYTICS) {
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: true,
        custom_map: {
          'custom_parameter_1': 'language',
          'custom_parameter_2': 'user_type'
        }
      });
      
      // Track language
      gtag('event', 'page_view', {
        language: '${language}',
        user_type: 'visitor'
      });
    `;
    document.head.appendChild(script2);

    return () => {
      try {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
      } catch (error) {
        // Scripts may have already been removed
      }
    };
  }, [measurementId, language]);

  return null;
};

export default GoogleAnalytics;

// src/components/OptimizedImage.tsx - Performance optimized image component
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate responsive image URLs for Unsplash
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.includes('unsplash.com')) {
      return `
        ${baseSrc}&w=400&q=${quality} 400w,
        ${baseSrc}&w=800&q=${quality} 800w,
        ${baseSrc}&w=1200&q=${quality} 1200w
      `;
    }
    return undefined;
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        minHeight: height ? `${height}px` : undefined
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"
          style={{ 
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image failed to load</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default OptimizedImage;