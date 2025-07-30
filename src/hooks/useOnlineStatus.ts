import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

interface OnlineUser {
  id: string;
  is_online: boolean;
  last_seen: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export const useOnlineStatus = () => {
  const { user } = useProfile();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Update current user's online status
  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }, [user?.id]);

  // Fetch online users
  const fetchOnlineUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, is_online, last_seen, first_name, last_name, avatar_url')
        .eq('is_online', true)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setOnlineUsers(data || []);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  }, []);

  // Check if a specific user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.some(user => user.id === userId);
  }, [onlineUsers]);

  // Get online status for a specific user
  const getUserOnlineStatus = useCallback((userId: string) => {
    return onlineUsers.find(user => user.id === userId);
  }, [onlineUsers]);

  // Set up real-time subscriptions for online status changes
  useEffect(() => {
    if (!user?.id) return;

    // Mark user as online when component mounts
    updateOnlineStatus(true);

    // Subscribe to profile changes for online status
    const onlineStatusChannel = supabase
      .channel('online_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'is_online=eq.true'
        },
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    // Initial fetch
    fetchOnlineUsers().finally(() => setLoading(false));

    // Set up heartbeat to keep user online
    const heartbeatInterval = setInterval(() => {
      updateOnlineStatus(true);
    }, 30000); // Update every 30 seconds

    // Cleanup function
    return () => {
      clearInterval(heartbeatInterval);
      updateOnlineStatus(false);
      supabase.removeChannel(onlineStatusChannel);
    };
  }, [user?.id, updateOnlineStatus, fetchOnlineUsers]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateOnlineStatus(false);
      } else {
        updateOnlineStatus(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateOnlineStatus]);

  // Handle beforeunload to mark user as offline
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updateOnlineStatus]);

  return {
    onlineUsers,
    isUserOnline,
    getUserOnlineStatus,
    loading,
    updateOnlineStatus
  };
}; 