import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCollaboratorActions = () => {
  const [loading, setLoading] = useState(false);

  const saveCollaborator = async (collaboratorId: string) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to save collaborators');
        return false;
      }

      // Insert or update collaboration status
      const { error } = await supabase
        .from('collaborations')
        .upsert({
          requester_id: user.id,
          collaborator_id: collaboratorId,
          status: 'saved'
        }, {
          onConflict: 'requester_id,collaborator_id'
        });

      if (error) throw error;

      toast.success('Collaborator saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving collaborator:', error);
      toast.error('Failed to save collaborator');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsaveCollaborator = async (collaboratorId: string) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      const { error } = await supabase
        .from('collaborations')
        .delete()
        .eq('requester_id', user.id)
        .eq('collaborator_id', collaboratorId);

      if (error) throw error;

      toast.success('Collaborator removed from saved list');
      return true;
    } catch (error) {
      console.error('Error unsaving collaborator:', error);
      toast.error('Failed to remove collaborator');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contactCollaborator = async (collaboratorId: string) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to contact collaborators');
        return false;
      }

      // Update collaboration status to contacted
      const { error } = await supabase
        .from('collaborations')
        .upsert({
          requester_id: user.id,
          collaborator_id: collaboratorId,
          status: 'contacted'
        }, {
          onConflict: 'requester_id,collaborator_id'
        });

      if (error) throw error;

      toast.success('Collaborator contacted successfully!');
      return true;
    } catch (error) {
      console.error('Error contacting collaborator:', error);
      toast.error('Failed to contact collaborator');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsCollaborated = async (collaboratorId: string) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      // Update collaboration status to collaborated
      const { error } = await supabase
        .from('collaborations')
        .upsert({
          requester_id: user.id,
          collaborator_id: collaboratorId,
          status: 'collaborated'
        }, {
          onConflict: 'requester_id,collaborator_id'
        });

      if (error) throw error;

      toast.success('Marked as collaborated!');
      return true;
    } catch (error) {
      console.error('Error marking as collaborated:', error);
      toast.error('Failed to update collaboration status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveCollaborator = async (collaboratorId: string, currentlySaved: boolean) => {
    if (currentlySaved) {
      return await unsaveCollaborator(collaboratorId);
    } else {
      return await saveCollaborator(collaboratorId);
    }
  };

  return {
    loading,
    saveCollaborator,
    unsaveCollaborator,
    contactCollaborator,
    markAsCollaborated,
    toggleSaveCollaborator,
  };
};