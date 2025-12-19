// src/components/SupabaseProvider.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Simple health check
        const { data, error } = await supabase.from('your_table_name').select('count').limit(1);
        
        if (error) {
          setError('Failed to connect to Supabase');
        } else {
          setIsSupabaseReady(true);
        }
      } catch (err) {
        setError('Supabase connection error');
      }
    };

    checkSupabaseConnection();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Service Unavailable</h1>
          <p className="mb-6">We're having trouble connecting to our database. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-full transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isSupabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}