
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Users, 
  Bookmark, 
  MessageSquare, 
  Database, 
  Ship, 
  FileText, 
  Wrench, 
  Settings,
  MoreHorizontal,
  Send,
  Copy
} from 'lucide-react';

const Equipment = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing conversation or create new one
  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;

      try {
        // Try to find existing conversation
        const { data: existingConversations, error: fetchError } = await supabase
          .from('ai_conversations' as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('conversation_type', 'equipment')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error('Error fetching conversation:', fetchError);
          return;
        }

        if (existingConversations && existingConversations.length > 0) {
          // Load existing conversation
          const conversation = existingConversations[0] as any;
          setConversationId(conversation.id);
          setMessages(conversation.messages || []);
        } else {
          // Create new conversation with welcome message
          const welcomeMessage = {
            id: 1,
            sender: 'Bot',
            content: '👋 Hi! I\'m here to help you with equipment services. What type of equipment are you looking for today? I can assist with equipment rentals, purchases, maintenance, and technical specifications.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false,
            avatar: 'AI'
          };

          const { data: newConversation, error: createError } = await supabase
            .from('ai_conversations' as any)
            .insert({
              user_id: user.id,
              conversation_type: 'equipment',
              messages: [welcomeMessage]
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating conversation:', createError);
            setMessages([welcomeMessage]);
          } else {
            setConversationId((newConversation as any).id);
            setMessages([welcomeMessage]);
          }
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
        // Fallback to local welcome message
        setMessages([{
          id: 1,
          sender: 'Bot',
          content: '👋 Hi! I\'m here to help you with equipment services. What type of equipment are you looking for today? I can assist with equipment rentals, purchases, maintenance, and technical specifications.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
          avatar: 'AI'
        }]);
      }
    };

    loadConversation();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const sendMessageToOpenAI = async (userMessage) => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful equipment service assistant. You help users with equipment inquiries, provide information about different types of equipment, assist with rental and purchase decisions, and offer guidance on maintenance and technical specifications. Be friendly, professional, and provide practical advice for equipment-related questions.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'User',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: profile?.avatar_url || null,
      initials: getInitials()
    };

    // Add user message to chat
    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);
    setMessage('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await sendMessageToOpenAI(message);
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'Bot',
        content: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        avatar: 'AI'
      };

      // Add AI response to chat
      const finalMessages = [...updatedMessagesWithUser, aiMessage];
      setMessages(finalMessages);

      // Save to database
      if (conversationId) {
        await supabase
          .from('ai_conversations' as any)
          .update({ 
            messages: finalMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Bot',
        content: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        avatar: 'AI'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: true },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AIRCollab</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Home
            </div>
            {home.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Dashboard') {
                    navigate('/dashboard');
                  } else if (item.label === 'Discover Collaborators') {
                    navigate('/discover-collaborators');
                  } else if (item.label === 'Saved Collaborators') {
                    navigate('/saved-collaborators');
                  } else if (item.label === 'Home') {
                    navigate('/');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Collaborations
            </div>
            {collaborationItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Collaboration') {
                    navigate('/collaboration');
                  } else if (item.label === 'Chat') {
                    navigate('/chat');
                  } else if (item.label === 'Data Center') {
                    navigate('/data-center');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Supporting Services
            </div>
            {supportingServices.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (item.label === 'Shipment') {
                    navigate('/shipment');
                  } else if (item.label === 'Quotation') {
                    navigate('/quotation');
                  } else if (item.label === 'Equipment') {
                    navigate('/equipment');
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <div 
            className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile avatar" />
              ) : (
                <AvatarFallback className="bg-gray-800 text-white text-sm">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName()}
              </div>
              <div className="text-xs text-gray-500">{profile?.email}</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Equipment</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.isService ? (
                  <div className="flex justify-start">
                    <div className="max-w-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-800 text-white text-sm">
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-gray-900">{msg.content}</div>
                      </div>
                      <div className="ml-10">
                        <a href={msg.serviceInfo?.website} className="text-blue-600 hover:underline text-sm">
                          {msg.serviceInfo?.website}
                        </a>
                        <div className="mt-2 space-y-1">
                          {msg.serviceInfo?.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <span className="text-gray-600 mt-1">•</span>
                              <span className="text-sm text-gray-700">{feature}</span>
                              {idx === 0 && (
                                <button className="ml-2 text-gray-400 hover:text-gray-600">
                                  <Copy className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                    {!msg.isOwn && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {msg.avatar && msg.avatar !== 'AI' && msg.avatar !== 'AL' ? (
                          <AvatarImage src={msg.avatar} alt="Bot avatar" />
                        ) : (
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {msg.avatar}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    <div className="max-w-xs lg:max-w-md">
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.isOwn
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">{msg.content}</div>
                        {msg.time && (
                          <div className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.time}
                          </div>
                        )}
                      </div>
                    </div>
                    {msg.isOwn && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {msg.avatar ? (
                          <AvatarImage src={msg.avatar} alt="User avatar" />
                        ) : (
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {msg.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
