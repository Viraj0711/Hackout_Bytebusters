import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      // Try to fetch user profile from user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // If user_profiles table doesn't exist or user profile doesn't exist,
        // create a simple user object from auth data
        console.log('User profiles table not found or user profile missing, using auth data');
        const simpleUser: User = {
          id: authUser.id,
          email: authUser.email!,
          role: 'analyst', // Default role
          created_at: new Date().toISOString(),
        };
        setUser(simpleUser);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.log('Error fetching user profile, falling back to auth data:', error);
      // Fallback to simple user object from auth data
      const simpleUser: User = {
        id: authUser.id,
        email: authUser.email!,
        role: 'analyst', // Default role
        created_at: new Date().toISOString(),
      };
      setUser(simpleUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, role: User['role'] = 'analyst') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Try to create user profile, but don't fail if table doesn't exist
      try {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email,
          role,
        });
      } catch (profileError) {
        console.log('Could not create user profile (table may not exist):', profileError);
        // This is fine, we'll use the fallback user object
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}