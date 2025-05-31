import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { updateUser, clearUser } from '../store/slices/userSlice';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            dispatch(clearUser());
            return;
          }

          if (userData) {
            dispatch(updateUser({
              id: userData.id,
              email: userData.email,
              name: userData.full_name,
              role: userData.role,
              avatar: userData.avatar,
              language: userData.language || 'fr',
              isAuthenticated: true
            }));
          }
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Error checking session:', error);
        dispatch(clearUser());
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          dispatch(clearUser());
          return;
        }

        if (userData) {
          dispatch(updateUser({
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            role: userData.role,
            avatar: userData.avatar,
            language: userData.language || 'fr',
            isAuthenticated: true
          }));
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
} 