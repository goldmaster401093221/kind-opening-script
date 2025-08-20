import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export const usePendingRequests = () => {
  const { user } = useProfile();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPendingRequests = async () => {
    if (!user) {
      setPendingCount(0);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select('id')
        .eq('collaborator_id', user.id)
        .eq('status', 'contacted');

      if (error) {
        console.error('Error fetching pending requests:', error);
        setPendingCount(0);
      } else {
        setPendingCount(data?.length || 0);
      }
    } catch (error) {
      console.error('Error in fetchPendingRequests:', error);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();

    // Set up real-time subscription for collaboration requests
    const channel = supabase
      .channel('collaboration_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaborations',
          filter: `collaborator_id=eq.${user?.id}`,
        },
        () => {
          // Refetch pending requests when there are changes
          fetchPendingRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    pendingCount,
    loading,
    refetch: fetchPendingRequests,
  };
};
