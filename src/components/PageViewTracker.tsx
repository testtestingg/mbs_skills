// components/PageViewTracker.tsx
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PageViewTrackerProps {
  language: string;
}

const PageViewTracker = ({ language }: PageViewTrackerProps) => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Simple insert to the new simple_page_views table
        const { data, error } = await supabase
          .from('simple_page_views')
          .insert({
            page: window.location.pathname,
            language: language
          })
          .select();
        
        if (error) {
          console.error('Error tracking page view:', error);
        } else {
          console.log('Page view tracked successfully:', data);
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [language]);

  return null;
};

export default PageViewTracker;