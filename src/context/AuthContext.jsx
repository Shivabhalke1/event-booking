import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { isSupabaseConfigured } from '../api/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLiveSupabase(isSupabaseConfigured());
        const sessionData = await authService.getCurrentSession();
        if (sessionData) {
          setUser(sessionData.user);
          setProfile(sessionData.profile);
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signIn({ email, password });
      setUser(loggedUser);
      setProfile(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, fullName, role }) => {
    setLoading(true);
    try {
      const newUser = await authService.signUp({ email, password, fullName, role });
      setUser(newUser);
      setProfile(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = async (roleOrId) => {
    setLoading(true);
    try {
      const switched = await authService.switchDemoAccount(roleOrId);
      setUser(switched);
      setProfile(switched);
      return switched;
    } finally {
      setLoading(false);
    }
  };

  const isOrganizer = profile?.role === 'organizer' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    isOrganizer,
    isAdmin,
    isLiveSupabase,
    login,
    register,
    logout,
    switchDemoRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
