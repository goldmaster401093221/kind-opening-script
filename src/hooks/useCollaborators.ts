import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  keywords: string[] | null;
  research_roles: string[] | null;
  experience: string | null;
  rating: number | null;
  collaboration_count: number | null;
  bio: string | null;
  what_i_have: string[] | null;
  what_i_need: string[] | null;
}

export interface CollaborationStatus {
  id: string;
  status: 'saved' | 'contacted' | 'collaborated' | 'declined';
  created_at: string;
}

export const useCollaborators = (searchQuery?: string, sortBy?: string, filters?: any) => {
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [collaborationStatuses, setCollaborationStatuses] = useState<Map<string, CollaborationStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Build query for collaborators (exclude current user)
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      // Apply search filter
      if (searchQuery && searchQuery.trim()) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,institution.ilike.%${searchQuery}%,primary_research_area.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'Rating':
          query = query.order('rating', { ascending: false, nullsFirst: false });
          break;
        case 'Collaborations':
          query = query.order('collaboration_count', { ascending: false, nullsFirst: false });
          break;
        default: // 'Relevant'
          query = query.order('created_at', { ascending: false });
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Get collaboration statuses for current user
      const { data: collaborations, error: collaborationsError } = await supabase
        .from('collaborations')
        .select('collaborator_id, status, created_at, id')
        .eq('requester_id', user.id);

      if (collaborationsError) throw collaborationsError;

      // Create status map
      const statusMap = new Map<string, CollaborationStatus>();
      collaborations?.forEach(collab => {
        statusMap.set(collab.collaborator_id, {
          id: collab.id,
          status: collab.status as 'saved' | 'contacted' | 'collaborated' | 'declined',
          created_at: collab.created_at
        });
      });

      setCollaborators(profiles || []);
      setCollaborationStatuses(statusMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching collaborators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collaborators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, [searchQuery, sortBy, filters]);

  const getDisplayName = (profile: CollaboratorProfile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.username) {
      return profile.username;
    }
    if (profile.email) {
      return profile.email.split('@')[0];
    }
    return 'Unknown User';
  };

  const getInitials = (profile: CollaboratorProfile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (profile.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserRole = (profile: CollaboratorProfile) => {
    if (profile.title) return profile.title;
    if (profile.experience === 'Undergraduate') return 'Undergraduate Student';
    if (profile.experience === 'Graduate') return 'Graduate Student';
    if (profile.experience === 'Postdoc') return 'Postdoctoral Researcher';
    if (profile.experience === 'Faculty') return 'Faculty Member';
    return 'Researcher';
  };

  const getCollaborationStatus = (collaboratorId: string) => {
    return collaborationStatuses.get(collaboratorId);
  };

  const isCollaboratorSaved = (collaboratorId: string) => {
    const status = getCollaborationStatus(collaboratorId);
    return status?.status === 'saved';
  };

  const isCollaboratorContacted = (collaboratorId: string) => {
    const status = getCollaborationStatus(collaboratorId);
    return status?.status === 'contacted';
  };

  const hasCollaborated = (collaboratorId: string) => {
    const status = getCollaborationStatus(collaboratorId);
    return status?.status === 'collaborated';
  };

  return {
    collaborators,
    loading,
    error,
    refetch: fetchCollaborators,
    getDisplayName,
    getInitials,
    getUserRole,
    getCollaborationStatus,
    isCollaboratorSaved,
    isCollaboratorContacted,
    hasCollaborated,
  };
};

export const useSavedCollaborators = (activeTab: 'Saved' | 'Contacted') => {
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedCollaborators = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Get collaborations based on active tab
      const statusFilter = activeTab === 'Saved' ? 'saved' : 'contacted';
      
      const { data: collaborations, error: collaborationsError } = await supabase
        .from('collaborations')
        .select(`
          *,
          profiles!collaborations_collaborator_id_fkey (*)
        `)
        .eq('requester_id', user.id)
        .eq('status', statusFilter)
        .order('created_at', { ascending: false });

      if (collaborationsError) throw collaborationsError;

      // Extract collaborator profiles
      const profiles = (collaborations?.map(collab => (collab as any).profiles).filter(Boolean) || []) as CollaboratorProfile[];
      
      setCollaborators(profiles);
      setError(null);
    } catch (err) {
      console.error('Error fetching saved collaborators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch saved collaborators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCollaborators();
  }, [activeTab]);

  return {
    collaborators,
    loading,
    error,
    refetch: fetchSavedCollaborators,
  };
};