import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useToast } from '@/hooks/use-toast';

export interface CollaboratorProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  title: string | null;
  institution: string | null;
  college: string | null;
  department: string | null;
  country: string | null;
  state_city: string | null;
  zip_code: string | null;
  phone: string | null;
  linkedin_url: string | null;
  researchgate_url: string | null;
  google_scholar_url: string | null;
  primary_research_area: string | null;
  secondary_research_area: string | null;
  experience: string | null;
  keywords: string[] | null;
  specialization_keywords: string[] | null;
  research_roles: string[] | null;
  what_i_have: string[] | null;
  what_i_need: string[] | null;
  rating: number | null;
  collaboration_count: number | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const useCollaborators = () => {
  const { profile, user } = useProfile();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all collaborators from database
  const fetchCollaborators = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '') // Exclude current user
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCollaborators: CollaboratorProfile[] = (data || []).map(item => ({
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        username: item.username,
        email: item.email,
        avatar_url: item.avatar_url,
        title: item.title,
        institution: item.institution,
        college: item.college,
        department: item.department,
        country: item.country,
        state_city: item.state_city,
        zip_code: item.zip_code,
        phone: item.phone,
        linkedin_url: item.linkedin_url,
        researchgate_url: item.researchgate_url,
        google_scholar_url: item.google_scholar_url,
        primary_research_area: item.primary_research_area,
        secondary_research_area: item.secondary_research_area,
        experience: item.experience,
        keywords: item.keywords,
        specialization_keywords: item.specialization_keywords,
        research_roles: item.research_roles,
        what_i_have: item.what_i_have,
        what_i_need: item.what_i_need,
        rating: item.rating,
        collaboration_count: item.collaboration_count,
        bio: item.bio,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setCollaborators(transformedCollaborators);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if a collaborator is in the user's favorites
  const isFavorite = (collaboratorId: string) => {
    return profile?.favorite?.includes(collaboratorId) || false;
  };

  // Check if a collaborator is contacted
  const isContacted = (collaboratorId: string) => {
    return profile?.contacted?.includes(collaboratorId) || false;
  };

  // Check if a collaborator is collaborated
  const isCollaborated = (collaboratorId: string) => {
    return profile?.collaborated?.includes(collaboratorId) || false;
  };

  // Check if a collaborator is best match
  const isBestMatch = (collaboratorId: string) => {
    return profile?.best_match?.includes(collaboratorId) || false;
  };

  // Toggle favorite status
  const toggleFavorite = async (collaboratorId: string) => {
    if (!user || !profile) return;

    try {
      const currentFavorites = profile.favorite || [];
      const isFav = currentFavorites.includes(collaboratorId);
      
      let newFavorites: string[];
      if (isFav) {
        newFavorites = currentFavorites.filter(id => id !== collaboratorId);
      } else {
        newFavorites = [...currentFavorites, collaboratorId];
      }

      const { error } = await supabase
        .from('profiles')
        .update({ favorite: newFavorites } as any)
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      profile.favorite = newFavorites;

      toast({
        title: isFav ? "Removed from favorites" : "Added to favorites",
        description: isFav ? "Collaborator removed from your favorites" : "Collaborator added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  // Initialize random data for new fields
  const initializeRandomData = async () => {
    if (!user || !profile) return;

    try {
      // Get some random collaborator IDs for demo data
      if (collaborators.length > 0) {
        const randomCollaborators = collaborators.slice(0, Math.min(3, collaborators.length)).map(c => c.id);
        
        const updates: any = {};
        
        // Only update if the field is empty
        if (!profile.contacted || profile.contacted.length === 0) {
          updates.contacted = randomCollaborators.slice(0, 1);
        }
        if (!profile.collaborated || profile.collaborated.length === 0) {
          updates.collaborated = randomCollaborators.slice(0, 2);
        }
        if (!profile.best_match || profile.best_match.length === 0) {
          updates.best_match = randomCollaborators;
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(updates as any)
            .eq('id', user.id);

          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error initializing random data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCollaborators();
    }
  }, [user]);

  useEffect(() => {
    if (collaborators.length > 0 && profile) {
      initializeRandomData();
    }
  }, [collaborators.length, profile?.id]);

  const getDisplayName = (collaborator: CollaboratorProfile) => {
    if (collaborator.first_name && collaborator.last_name) {
      return `${collaborator.first_name} ${collaborator.last_name}`;
    }
    if (collaborator.username) {
      return collaborator.username;
    }
    if (collaborator.email) {
      return collaborator.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = (collaborator: CollaboratorProfile) => {
    if (collaborator.first_name && collaborator.last_name) {
      return `${collaborator.first_name.charAt(0)}${collaborator.last_name.charAt(0)}`.toUpperCase();
    }
    if (collaborator.username) {
      return collaborator.username.substring(0, 2).toUpperCase();
    }
    if (collaborator.email) {
      return collaborator.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserRole = (collaborator: CollaboratorProfile) => {
    if (collaborator.title) return collaborator.title;
    if (collaborator.experience === 'Undergraduate') return 'Undergraduate Student';
    if (collaborator.experience === 'Graduate') return 'Graduate Student';
    if (collaborator.experience === 'Postdoc') return 'Postdoctoral Researcher';
    if (collaborator.experience === 'Faculty') return 'Faculty Member';
    return 'Researcher';
  };

  return {
    collaborators,
    loading,
    fetchCollaborators,
    isFavorite,
    isContacted,
    isCollaborated,
    isBestMatch,
    toggleFavorite,
    getDisplayName,
    getInitials,
    getUserRole,
  };
};