import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: 'user' | 'admin' | 'moderator';
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithDemo: (email?: string) => void;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        setProfile(data as Profile);
      } else {
        // Fallback if profile doesn't exist yet (should be created by trigger, but just in case)
        setProfile({
          id: userId,
          username: null,
          full_name: null,
          avatar_url: null,
          website: null,
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // 1. Check for demo user
    const demoUserStr = localStorage.getItem('demo_user');
    if (demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr);
        setUser(demoUser);
        setProfile({
          id: demoUser.id,
          username: 'Demo User',
          full_name: 'Demo Admin',
          avatar_url: null,
          website: null,
          role: 'admin'
        });
        setSession({ user: demoUser, access_token: 'demo', refresh_token: 'demo', expires_in: 3600, token_type: 'bearer' } as Session);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('demo_user');
      }
    }

    // 2. Get initial session from Supabase
    const initSession = async () => {
      // Safety timeout to ensure loading doesn't stick forever
      const timeoutId = setTimeout(() => {
        console.warn("Auth initialization timed out, forcing loading=false");
        setLoading(false);
      }, 3000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        // Fallback to no session on error
        setSession(null);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initSession();

    // 3. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Only update if not in demo mode
      if (!localStorage.getItem('demo_user')) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('SignOut initiated');
    setLoading(true);
    
    try {
      // Clear local state immediately for UI feedback
      setUser(null);
      setSession(null);
      setProfile(null);

      if (localStorage.getItem('demo_user')) {
        console.log('Removing demo user');
        localStorage.removeItem('demo_user');
      } else {
        console.log('Calling supabase.auth.signOut()');
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Supabase signOut error:', error);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      console.log('SignOut finally block - cleaning up storage');
      
      // FORCE CLEAR: Manually remove Supabase tokens from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
        }
      });

      setLoading(false);
      console.log('Redirecting to /');
      window.location.href = '/';
    }
  };

  const signInWithDemo = (email: string = 'admin@sinemagic.com') => {
    const demoUser = { 
      id: 'demo-user-123', 
      email: email, 
      aud: 'authenticated', 
      created_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: {},
      role: 'authenticated'
    } as User;
    
    const demoProfile: Profile = {
      id: 'demo-user-123',
      username: 'Demo User',
      full_name: 'Demo Admin',
      avatar_url: null,
      website: null,
      role: 'admin'
    };

    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setProfile(demoProfile);
    setSession({ user: demoUser, access_token: 'demo', refresh_token: 'demo', expires_in: 3600, token_type: 'bearer' } as Session);
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific error codes
      if (error?.message?.includes('Unsupported provider') || error?.code === 400) {
        throw new Error('Вход через Google временно недоступен. Пожалуйста, используйте Email или Демо-вход.');
      }
      
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, signInWithDemo, signInWithGoogle, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
