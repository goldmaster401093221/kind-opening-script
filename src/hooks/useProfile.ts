import { useState, useEffect } from 'react';
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
  contacted: string[] | null;
  collaborated: string[] | null;
  best_match: string[] | null;
  favorite: string[] | null;
  keywords: string[] | null;
  research_roles: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Transform database response to match our Profile interface
    if (profileData) {
      const data = profileData as any; // Type assertion for new fields
      const transformedProfile: Profile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url,
        title: data.title,
        institution: data.institution,
        primary_research_area: data.primary_research_area,
        experience: data.experience,
        contacted: data.contacted || [],
        collaborated: data.collaborated || [],
        best_match: data.best_match || [],
        favorite: data.favorite || [],
        keywords: data.specialization_keywords || [],
        research_roles: data.research_roles || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      setProfile(transformedProfile);
      return transformedProfile;
    }
    
    setProfile(null);
    return null;
  };

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);
      
      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      // Transform database response to match our Profile interface
      if (profileData) {
        const data = profileData as any; // Type assertion for new fields
        const transformedProfile: Profile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          email: data.email,
          avatar_url: data.avatar_url,
          title: data.title,
          institution: data.institution,
          primary_research_area: data.primary_research_area,
          experience: data.experience,
          contacted: data.contacted || [],
          collaborated: data.collaborated || [],
          best_match: data.best_match || [],
          favorite: data.favorite || [],
          keywords: data.specialization_keywords || [],
          research_roles: data.research_roles || [],
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setProfile(transformedProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Refetch profile when auth state changes
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                const profileData = data as any; // Type assertion for new fields
                const transformedProfile: Profile = {
                  id: profileData.id,
                  first_name: profileData.first_name,
                  last_name: profileData.last_name,
                  username: profileData.username,
                  email: profileData.email,
                  avatar_url: profileData.avatar_url,
                  title: profileData.title,
                  institution: profileData.institution,
                  primary_research_area: profileData.primary_research_area,
                  experience: profileData.experience,
                  contacted: profileData.contacted || [],
                  collaborated: profileData.collaborated || [],
                  best_match: profileData.best_match || [],
                  favorite: profileData.favorite || [],
                  keywords: profileData.specialization_keywords || [],
                  research_roles: profileData.research_roles || [],
                  created_at: profileData.created_at,
                  updated_at: profileData.updated_at,
                };
                setProfile(transformedProfile);
              } else {
                setProfile(null);
              }
            });
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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