import { useState } from 'react';

export function useAuth() {
  const [user] = useState(null);
  const [loading] = useState(false);

  const signIn = async () => {
    console.log('Demo sign in');
    return { error: null };
  };

  const signUp = async () => {
    console.log('Demo sign up');
    return { data: null, error: null };
  };

  const signOut = async () => {
    console.log('Demo sign out');
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
