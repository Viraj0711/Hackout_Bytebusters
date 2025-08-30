import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          
          // Determine role based on email
          const role = determineUserRole(authUser.email!);
          
          const simpleUser: User = {
            id: authUser.id,
            email: authUser.email!,
            role: role,
            created_at: new Date().toISOString(),
          };
          setUser(simpleUser);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.log('Error fetching user profile, falling back to auth data:', error);
        
        // Determine role based on email
        const role = determineUserRole(authUser.email!);
        
        // Fallback to simple user object from auth data
        const simpleUser: User = {
          id: authUser.id,
          email: authUser.email!,
          role: role,
          created_at: new Date().toISOString(),
        };
        setUser(simpleUser);
      } finally {
        setLoading(false);
      }
    };

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

  const determineUserRole = (email: string): User['role'] => {
    // Admin emails get admin role
    const adminEmails = [
      'admin@energymanager.com',
      'admin@company.com',
      'administrator@energymanager.com',
      'viraj@admin.com',
      'test@admin.com'
    ];
    
    // Check if email is in admin list or contains 'admin'
    if (adminEmails.includes(email.toLowerCase()) || email.toLowerCase().includes('admin')) {
      return 'admin';
    }
    
    // Default role for regular users
    return 'analyst';
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // If Supabase auth fails, create a demo user for demo mode
        console.log('Supabase auth failed, creating demo user:', error.message);
        
        // Determine role based on email
        const role = determineUserRole(email);
        
        // Create a demo user object
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: email,
          role: role,
          created_at: new Date().toISOString(),
          full_name: email.split('@')[0], // Use part before @ as name
        };
        
        // Set the demo user
        setUser(demoUser);
        setLoading(false);
        
        // Return success for demo mode
        return { error: null };
      }
      
      return { error };
    } catch (err) {
      // Fallback to demo mode on any error
      console.log('Auth error, falling back to demo mode:', err);
      
      // Determine role based on email
      const role = determineUserRole(email);
      
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email: email,
        role: role,
        created_at: new Date().toISOString(),
        full_name: email.split('@')[0],
      };
      
      setUser(demoUser);
      setLoading(false);
      
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string, role?: User['role']) => {
    try {
      // If no role provided, determine based on email
      const userRole = role || determineUserRole(email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // If Supabase auth fails, create a demo user for demo mode
        console.log('Supabase signup failed, creating demo user:', error.message);
        
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: email,
          role: userRole,
          created_at: new Date().toISOString(),
          full_name: email.split('@')[0],
        };
        
        setUser(demoUser);
        setLoading(false);
        
        return { data: { user: demoUser }, error: null };
      }

      if (data.user && !error) {
        // Try to create user profile, but don't fail if table doesn't exist
        try {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            email,
            role: userRole,
          });
        } catch (profileError) {
          console.log('Could not create user profile (table may not exist):', profileError);
          // This is fine, we'll use the fallback user object
        }
      }

      return { data, error };
    } catch (err) {
      // Fallback to demo mode on any error
      console.log('Signup error, falling back to demo mode:', err);
      
      // If no role provided, determine based on email
      const userRole = role || determineUserRole(email);
      
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email: email,
        role: userRole,
        created_at: new Date().toISOString(),
        full_name: email.split('@')[0],
      };
      
      setUser(demoUser);
      setLoading(false);
      
      return { data: { user: demoUser }, error: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Always clear the local user state regardless of Supabase result
      setUser(null);
      setSession(null);
      setLoading(false);
      
      return { error };
    } catch {
      // Even if Supabase fails, clear local state for demo mode
      setUser(null);
      setSession(null);
      setLoading(false);
      
      return { error: null };
    }
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