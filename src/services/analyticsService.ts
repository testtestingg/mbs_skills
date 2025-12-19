// services/analyticsService.ts
import { supabase } from '../lib/supabaseClient';

export const analyticsService = {
  trackPageView: async (page: string, language: string) => {
    try {
      // Simple insert to the new simple_page_views table
      const { data, error } = await supabase
        .from('simple_page_views')
        .insert({
          page,
          language
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
  },

  trackUserInteraction: async (
    interactionType: string, 
    page: string, 
    language: string, 
    metadata?: any
  ) => {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .insert({
          interaction_type: interactionType,
          page,
          language,
          metadata: metadata || {}
        })
        .select();
      
      if (error) {
        console.error('Error tracking user interaction:', error);
      } else {
        console.log('User interaction tracked successfully:', data);
      }
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  },

  trackContactSubmission: async (
    formData: any, 
    status: 'success' | 'error', 
    language: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .insert({
          interaction_type: 'contact_submission',
          page: 'contact',
          language,
          metadata: {
            form_data: formData,
            status
          }
        })
        .select();
      
      if (error) {
        console.error('Error tracking contact submission:', error);
      } else {
        console.log('Contact submission tracked successfully:', data);
      }
    } catch (error) {
      console.error('Error tracking contact submission:', error);
    }
  }
};