import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { GlossaryItem } from '../types';

export const useGlossary = (type: 'MEDICINE' | 'PATHOLOGY' | 'PRE_OP_LIST') => {
  const [items, setItems] = useState<GlossaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('GlossaryItem')
          .select('*')
          .eq('type', type)
          .eq('status', 'PUBLISHED')
          .order('term');

        if (error) throw error;
        setItems(data || []);
      } catch (err: any) {
        console.error(`Error loading glossary ${type}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  return { items, loading, error };
};
