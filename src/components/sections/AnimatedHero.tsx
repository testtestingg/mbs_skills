// AnimatedHero.tsx (Updated with correct color scheme)
import React, { Suspense, lazy, useRef, useEffect, useState, useCallback, memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types';
 
// --- Utility Functions/Components defined inline ---

// 1. Simple implementation of 'cn' (Class Name utility)
const cn = (...classes: (string | boolean | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// 2. Spline Scene Component (Lazy Loaded)
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: () => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const handleLoad = useCallback(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <span className="text-gray-600 text-sm">Loading 3D experience...</span>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        events-target="global"
        onLoad={handleLoad}
      />
    </Suspense>
  )
}

// --- Main Animated Hero Component ---
interface AnimatedHeroProps {
  handleContactOpen: () => void;
  language: Language;
  t: (key: string) => string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = memo(({ handleContactOpen, language, t }) => {
  const customColor = '#682cda';
  const containerRef = useRef<HTMLDivElement>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Optimized mouse position tracking with throttling
  useEffect(() => {
    if (!splineLoaded || !isInView) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // Set a new timeout to update the mouse position
      timeoutId = setTimeout(() => {
        // Access the Spline instance and update mouse position
        const splineApp = (window as any).spline;
        if (splineApp && splineApp.setMousePosition) {
          splineApp.setMousePosition(event.clientX, event.clientY);
        }
      }, 16); // ~60fps
    };

    // Add event listener to the entire document
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [splineLoaded, isInView]);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Callback to handle Spline load
  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-[600px] lg:min-h-[700px] bg-white relative overflow-hidden"
    >
      {/* Background - kept white as requested */}
      <div className="absolute inset-0 bg-white z-0"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row h-full">
        {/* Left content - with more space to prevent squeezing */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 flex flex-col justify-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="block text-gray-900">
                {language === 'fr' ? 'Élevez Votre Marque.' : 
                 language === 'en' ? 'Elevate Your Brand.' : 
                 'ارفع علامتك التجارية.'}
              </span>
              <span className="block" style={{ color: customColor }}>
                {language === 'fr' ? 'Maîtrisez l\'Avenir Numérique.' : 
                 language === 'en' ? 'Master the Digital Future.' : 
                 'أتقن المستقبل الرقمي.'}
              </span>
            </h1>
          </motion.div>
          
          <motion.p
            className="mt-6 text-lg text-gray-600 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={handleContactOpen}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="mr-2">{t('heroButton')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right content - Spline with optimized loading */}
        <div className="flex-1 relative h-[400px] lg:h-auto min-w-[400px]">
          {isInView && (
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                onLoad={handleSplineLoad}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});

AnimatedHero.displayName = 'AnimatedHero';

export default AnimatedHero;
