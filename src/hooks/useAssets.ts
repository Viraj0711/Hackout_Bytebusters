import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Asset, FilterState } from '../types';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async (filters?: FilterState) => {
    try {
      setLoading(true);
      let query = supabase.from('assets').select('*');

      if (filters?.assetTypes.length) {
        query = query.in('type', filters.assetTypes);
      }

      if (filters?.statuses.length) {
        query = query.in('status', filters.statuses);
      }

      if (filters?.regions.length) {
        query = query.in('regulatory_zone', filters.regions);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,owner.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(asset)
        .select()
        .single();

      if (error) throw error;
      
      setAssets(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error };
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, error };
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAssets(prev => prev.filter(asset => asset.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      return { error };
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
}