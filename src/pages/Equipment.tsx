import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAIChat } from '@/hooks/useAIChat';
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
  const { messages, loading: chatLoading, addMessage } = useAIChat('equipment');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/auth');
    }
  };

  const sendMessageToOpenAI = async (userMessage) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'your-api-key-here'}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant specializing in equipment services. You help users with:
              - Equipment rentals and purchases
              - Technical specifications and requirements
              - Equipment maintenance and repair
              - Installation and setup guidance
              - Equipment comparison and selection
              - Safety protocols and training
              - Warranty and service information
              - Troubleshooting and support
              
              Always be professional, helpful, and provide accurate equipment-related information.`
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

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      sender: 'User' as const,
      content: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: getInitials()
    };

    await addMessage(userMessage);
    const currentMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToOpenAI(currentMessage);
      const botMessage = {
        sender: 'Bot' as const,
        content: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        avatar: 'AI'
      };
      await addMessage(botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'Bot' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        avatar: 'AI'
      };
      await addMessage(errorMessage);
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

  if (profileLoading || chatLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MessageSquare, label: 'Collaborations', path: '/collaboration' },
    { 
      icon: MoreHorizontal, 
      label: 'Supporting Services',
      subItems: [
        { icon: Database, label: 'Data Center', path: '/data-center' },
        { icon: Ship, label: 'Shipment', path: '/shipment' },
        { icon: FileText, label: 'Quotation', path: '/quotation' },
        { icon: Wrench, label: 'Equipment', path: '/equipment', isActive: true }
      ]
    }
  ];

  const renderNavigationItem = (item, index) => {
    if (item.subItems) {
      return (
        <div key={index} className="space-y-2">
          <div className="flex items-center space-x-3 px-4 py-2 text-muted-foreground">
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <div className="ml-6 space-y-1">
            {item.subItems.map((subItem, subIndex) => (
              <button
                key={subIndex}
                onClick={() => navigate(subItem.path)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg w-full text-left transition-colors ${
                  subItem.isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <subItem.icon className="h-4 w-4" />
                <span className="text-sm">{subItem.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <button
        key={index}
        onClick={() => navigate(item.path)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg w-full text-left text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <item.icon className="h-5 w-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={getDisplayName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {getDisplayName()}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {profile?.title || 'Research Collaborator'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map(renderNavigationItem)}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg w-full text-left text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-foreground">Equipment</h1>
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            className="text-sm"
          >
            Sign Out
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[70%] ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.avatar === 'AI' ? '' : profile?.avatar_url} />
                  <AvatarFallback>
                    {msg.avatar === 'AI' ? 'AI' : msg.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  msg.isOwn 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[70%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about equipment services..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !message.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;