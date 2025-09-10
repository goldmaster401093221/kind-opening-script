import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export interface Message {
  id: number;
  sender: 'User' | 'Bot';
  content: string;
  time: string;
  isOwn: boolean;
  avatar: string;
}

export const useAIChat = (conversationType: 'shipment' | 'quotation' | 'equipment') => {
  const { user } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Welcome messages for different conversation types
  const getWelcomeMessage = (type: string): Message => {
    const welcomeMessages = {
      shipment: '👋 Hi, for what are you looking for shipment service today? Let me know so that I can help you.',
      quotation: '👋 Hi! I\'m here to help you with quotation services. What type of quote are you looking for today? I can assist with pricing, estimates, and quotation requests.',
      equipment: '👋 Hi! I\'m here to help you with equipment services. What type of equipment are you looking for today? I can assist with equipment rentals, purchases, maintenance, and technical specifications.'
    };

    return {
      id: 1,
      sender: 'Bot',
      content: welcomeMessages[type] || 'Hello! How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false,
      avatar: 'AI'
    };
  };

  // Load existing conversation or create new one
  const loadConversation = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Try to find existing conversation
      const { data: existingConversation, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('conversation_type', conversationType)
        .single();

      if (existingConversation && !error) {
        // Load existing conversation
        setConversationId(existingConversation.id);
        const savedMessages = Array.isArray(existingConversation.messages) 
          ? (existingConversation.messages as unknown as Message[])
          : [];
        setMessages(savedMessages);
      } else {
        // Create new conversation with welcome message
        const welcomeMessage = getWelcomeMessage(conversationType);
        const newMessages = [welcomeMessage];

        const { data: newConversation, error: createError } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            conversation_type: conversationType,
            messages: JSON.parse(JSON.stringify(newMessages))
          })
          .select()
          .single();

        if (createError) throw createError;

        setConversationId(newConversation.id);
        setMessages(newMessages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Fallback to welcome message
      const welcomeMessage = getWelcomeMessage(conversationType);
      setMessages([welcomeMessage]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, conversationType]);

  // Save messages to database
  const saveMessages = useCallback(async (updatedMessages: Message[]) => {
    if (!user?.id || !conversationId) return;

    try {
      await supabase
        .from('ai_conversations')
        .update({
          messages: JSON.parse(JSON.stringify(updatedMessages)),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [user?.id, conversationId]);

  // Add message to conversation
  const addMessage = useCallback(async (message: Omit<Message, 'id'>) => {
    const newMessage = {
      ...message,
      id: Date.now() + Math.random() // Generate unique ID
    };

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      // Save to database in the background
      saveMessages(updatedMessages);
      return updatedMessages;
    });

    return newMessage;
  }, [saveMessages]);

  // Clear conversation (create new one)
  const clearConversation = useCallback(async () => {
    if (!user?.id) return;

    try {
      const welcomeMessage = getWelcomeMessage(conversationType);
      const newMessages = [welcomeMessage];

      if (conversationId) {
        // Update existing conversation
        await supabase
          .from('ai_conversations')
          .update({
            messages: JSON.parse(JSON.stringify(newMessages)),
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      } else {
        // Create new conversation
        const { data: newConversation } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            conversation_type: conversationType,
            messages: JSON.parse(JSON.stringify(newMessages))
          })
          .select()
          .single();

        if (newConversation) {
          setConversationId(newConversation.id);
        }
      }

      setMessages(newMessages);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  }, [user?.id, conversationType, conversationId]);

  // Load conversation on mount
  useEffect(() => {
    if (user?.id) {
      loadConversation();
    }
  }, [user?.id, loadConversation]);

  return {
    messages,
    loading,
    addMessage,
    clearConversation,
    setMessages // For compatibility with existing code
  };
};