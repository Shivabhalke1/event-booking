import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { INITIAL_PROFILES, getLocalData, setLocalData } from './mockData';

const CURRENT_USER_KEY = 'current_user';
const PROFILES_KEY = 'profiles';

// Ensure mock profiles are initialized in localStorage
const getProfiles = () => getLocalData(PROFILES_KEY, INITIAL_PROFILES);
const saveProfiles = (profiles) => setLocalData(PROFILES_KEY, profiles);

export const authService = {
  /**
   * Register a new user
   */
  async signUp({ email, password, fullName, role = 'customer' }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) throw error;

      // Ensure profile row exists in public.profiles
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: role
        });
      }
      return data.user;
    }

    // Demo/Mock Fallback Mode
    const profiles = getProfiles();
    const existing = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      full_name: fullName,
      email: email,
      role: role,
      created_at: new Date().toISOString()
    };

    profiles.push(newUser);
    saveProfiles(profiles);
    setLocalData(CURRENT_USER_KEY, newUser);
    return newUser;
  },

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data.user;
    }

    // Demo/Mock Fallback Mode
    const profiles = getProfiles();
    const matched = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      // For ease of demo testing, auto-create a user if none exists
      const fallbackUser = {
        id: `user-${Date.now()}`,
        full_name: email.split('@')[0],
        email: email,
        role: 'customer',
        created_at: new Date().toISOString()
      };
      profiles.push(fallbackUser);
      saveProfiles(profiles);
      setLocalData(CURRENT_USER_KEY, fallbackUser);
      return fallbackUser;
    }

    setLocalData(CURRENT_USER_KEY, matched);
    return matched;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setLocalData(CURRENT_USER_KEY, null);
  },

  /**
   * Get current session and profile
   */
  async getCurrentSession() {
    if (isSupabaseConfigured()) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      const profile = await this.getUserProfile(session.user.id);
      return {
        user: session.user,
        profile: profile || {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          role: session.user.user_metadata?.role || 'customer'
        }
      };
    }

    // Demo/Mock Fallback Mode
    let currentUser = getLocalData(CURRENT_USER_KEY, null);
    if (!currentUser) {
      // Default to Shreya (Customer) for immediate browsing experience
      currentUser = INITIAL_PROFILES[0];
      setLocalData(CURRENT_USER_KEY, currentUser);
    }

    return {
      user: currentUser,
      profile: currentUser
    };
  },

  /**
   * Fetch user profile from Supabase or mock store
   */
  async getUserProfile(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) return null;
      return data;
    }

    const profiles = getProfiles();
    return profiles.find((p) => p.id === userId) || null;
  },

  /**
   * Quick role-switch / mock account selector for demonstration purposes
   */
  async switchDemoAccount(roleOrId) {
    const profiles = getProfiles();
    let account = profiles.find((p) => p.id === roleOrId || p.role === roleOrId);
    if (!account) {
      account = profiles[0];
    }
    setLocalData(CURRENT_USER_KEY, account);
    return account;
  }
};

export default authService;
