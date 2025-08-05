import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DataCenterFile {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  file_type: string;
  uploader_id: string;
  created_at: string;
  updated_at: string;
  views: number;
  comment_count?: number;
  description?: string;
  uploader?: {
    first_name?: string;
    last_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export interface DataCenterComment {
  id: string;
  file_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    first_name?: string;
    last_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export const useDataCenter = () => {
  const [files, setFiles] = useState<DataCenterFile[]>([]);
  const [comments, setComments] = useState<DataCenterComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      const { data: filesData, error: filesError } = await supabase
        .from('data_center_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (filesError) throw filesError;

      // Fetch uploader profiles separately
      const uploaderIds = [...new Set(filesData?.map(f => f.uploader_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username, avatar_url')
        .in('id', uploaderIds);

      if (profilesError) throw profilesError;

      // Fetch comment counts for each file
      const commentCounts = await Promise.all(
        (filesData || []).map(async (file) => {
          const { count, error } = await supabase
            .from('data_center_comments')
            .select('*', { count: 'exact', head: true })
            .eq('file_id', file.id);
          
          if (error) {
            console.error('Error fetching comment count:', error);
            return { id: file.id, count: 0 };
          }
          
          return { id: file.id, count: count || 0 };
        })
      );

      // Combine data
      const filesWithUploaders = filesData?.map(file => ({
        ...file,
        uploader: profiles?.find(p => p.id === file.uploader_id),
        comment_count: commentCounts.find(c => c.id === file.id)?.count || 0
      })) || [];

      setFiles(filesWithUploaders);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (fileId: string) => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('data_center_comments')
        .select('*')
        .eq('file_id', fileId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch user profiles separately
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const commentsWithUsers = commentsData?.map(comment => ({
        ...comment,
        user: profiles?.find(p => p.id === comment.user_id)
      })) || [];

      setComments(commentsWithUsers);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File, description?: string) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('data-center')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert file record
      const { data, error } = await supabase
        .from('data_center_files')
        .insert({
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploader_id: user.id,
          description,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      await fetchFiles();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addComment = async (fileId: string, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('data_center_comments')
        .insert({
          file_id: fileId,
          user_id: user.id,
          comment,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      await fetchComments(fileId);
      await fetchFiles(); // Refresh file data to update comment count
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const incrementViews = async (fileId: string) => {
    try {
      await supabase.rpc('increment_file_views', { file_id: fileId });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('data-center')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    comments,
    loading,
    uploading,
    fetchFiles,
    fetchComments,
    uploadFile,
    addComment,
    incrementViews,
    getFileUrl,
  };
};