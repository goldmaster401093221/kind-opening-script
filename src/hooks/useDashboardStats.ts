import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

interface DashboardStats {
  totalCollaborations: number;
  totalCollaborators: number;
  totalCollaborationDays: number;
  totalMeetings: number;
}

export const useDashboardStats = () => {
  const { user } = useProfile();
  const [stats, setStats] = useState<DashboardStats>({
    totalCollaborations: 0,
    totalCollaborators: 0,
    totalCollaborationDays: 0,
    totalMeetings: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!user) {
      setStats({
        totalCollaborations: 0,
        totalCollaborators: 0,
        totalCollaborationDays: 0,
        totalMeetings: 0,
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch total collaborations
      const { data: collaborations, error: collabError } = await supabase
        .from('collaborations')
        .select('id, start_date, end_date, status')
        .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
        .eq('status', 'collaborated');

      if (collabError) throw collabError;

      const totalCollaborations = collaborations?.length || 0;

      // Get unique collaborators
      const { data: allCollaborations, error: allCollabError } = await supabase
        .from('collaborations')
        .select('requester_id, collaborator_id')
        .or(`requester_id.eq.${user.id},collaborator_id.eq.${user.id}`)
        .eq('status', 'collaborated');

      if (allCollabError) throw allCollabError;

      const uniqueCollaborators = new Set<string>();
      allCollaborations?.forEach(collab => {
        if (collab.requester_id !== user.id) {
          uniqueCollaborators.add(collab.requester_id);
        }
        if (collab.collaborator_id !== user.id) {
          uniqueCollaborators.add(collab.collaborator_id);
        }
      });

      const totalCollaborators = uniqueCollaborators.size;

      // Calculate total collaboration days
      let totalDays = 0;
      collaborations?.forEach(collab => {
        if (collab.start_date && collab.end_date) {
          const startDate = new Date(collab.start_date);
          const endDate = new Date(collab.end_date);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDays += diffDays;
        }
      });

      // Fetch total calls/meetings
      const { data: calls, error: callsError } = await supabase
        .from('calls')
        .select('id')
        .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
        .eq('status', 'ended');

      if (callsError) throw callsError;

      const totalMeetings = calls?.length || 0;

      setStats({
        totalCollaborations,
        totalCollaborators,
        totalCollaborationDays: totalDays,
        totalMeetings,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalCollaborations: 0,
        totalCollaborators: 0,
        totalCollaborationDays: 0,
        totalMeetings: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions for updates
    const collaborationChannel = supabase
      .channel('collaboration_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaborations',
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(collaborationChannel);
    };
  }, [user?.id]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};