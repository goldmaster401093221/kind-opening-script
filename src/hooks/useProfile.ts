import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  title: string | null;
  institution: string | null;
  primary_research_area: string | null;
  experience: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(session.user);
      
      // Get fresh user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      setProfile(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Refresh profile when auth state changes
        refreshProfile();
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.username) {
      return profile.username;
    }
    if (profile?.email) {
      return profile.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserRole = () => {
    if (profile?.title) return profile.title;
    if (profile?.experience === 'Undergraduate') return 'Undergraduate Student';
    if (profile?.experience === 'Graduate') return 'Graduate Student';
    if (profile?.experience === 'Postdoc') return 'Postdoctoral Researcher';
    if (profile?.experience === 'Faculty') return 'Faculty Member';
    return 'Researcher';
  };

  return {
    user,
    profile,
    loading,
    getDisplayName,
    getInitials,
    getUserRole,
    refreshProfile,
  };
};