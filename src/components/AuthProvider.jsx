import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { updateUser, clearUser } from '../store/slices/userSlice';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // Get user info from infoUtilisateur table
          const { data: userData, error: userError } = await supabase
            .from('infoUtilisateur')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          // Update Redux store with user info
          dispatch(updateUser({
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            role: userData.role,
            avatar: userData.avatar,
            language: userData.language || 'fr',
            isAuthenticated: true
          }));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Error checking session:', error);
        dispatch(clearUser());
      }
    };

    // Initial check
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user info from infoUtilisateur table
        const { data: userData, error: userError } = await supabase
          .from('infoUtilisateur')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          dispatch(clearUser());
          return;
        }

        // Update Redux store with user info
        dispatch(updateUser({
          id: userData.id,
          email: userData.email,
          name: userData.full_name,
          role: userData.role,
          avatar: userData.avatar,
          language: userData.language || 'fr',
          isAuthenticated: true
        }));
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
} 