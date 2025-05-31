import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Envelope, Lock } from 'phosphor-react';
import { supabase } from '../../lib/supabase';
import { useDispatch } from 'react-redux';
import { updateUser, updateProfile } from '../../store/slices/userSlice';
import LanguageSwitch from './LanguageSwitch';

export default function Inscription() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setError(signInError.message || t('auth.loginError'));
        return;
      }

      if (!authData?.user?.id) {
        console.error('No user data returned from sign in');
        setError(t('auth.loginError'));
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError(userError.message || t('auth.loginError'));
        return;
      }

      if (userData) {
        setUserInfo({
          id: userData.id,
          email: userData.email,
          name: userData.full_name,
          role: userData.role,
          avatar: userData.avatar
        });
      }

      dispatch(updateUser({ role: userData.role }));
      dispatch(updateProfile({
        name: userData.full_name,
        email: userData.email,
        avatar: userData.avatar
      }));

      localStorage.setItem('isAuthenticated', 'true');

      await new Promise(resolve => setTimeout(resolve, 100));

      if (userData.role === 'doctor') {
        navigate('/tableau-de-bord', { replace: true });
      } else {
        navigate('/agenda', { replace: true });
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowRegister = (e) => {
    e.preventDefault();
    navigate('/inscription/patient');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('auth.login')}
          </h2>
          <LanguageSwitch />
        </div>
        <p className="text-center text-sm text-gray-600">
          {t('auth.loginMessage')}
        </p>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Envelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: t('auth.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('auth.invalidEmail')
                    }
                  })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="exemple@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-800" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: t('auth.passwordRequired'),
                    minLength: {
                      value: 6,
                      message: t('auth.passwordTooShort')
                    }
                  })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleShowRegister}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              {t('auth.register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 