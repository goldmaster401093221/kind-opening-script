import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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
  Phone,
  MoreVertical,
  Mic,
  Video,
  PhoneOff,
  MicOff,
  Expand,
  Monitor,
  MicIcon,
  Minimize2
} from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('In Progress');
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [showExpandedCalling, setShowExpandedCalling] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handlePhoneClick = () => {
    setShowCallingModal(true);
    setShowExpandedCalling(false);
  };

  const handleEndCall = () => {
    setShowCallingModal(false);
    setShowExpandedCalling(false);
  };

  const handleExpandCall = () => {
    setShowExpandedCalling(true);
  };

  const handleMinimizeCall = () => {
    setShowExpandedCalling(false);
  };

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  const conversations = [
    {
      name: 'Anna Krylova',
      lastMessage: 'im ipsum dolor sit amet,consectetur adipiscing',
      time: '12:00 pm',
      unread: 2,
      avatar: 'AK',
      online: true
    },
    {
      name: 'Kevin Rashy',
      lastMessage: '👋 Lorem ipsum dolor sit amet,consectetur adipiscing',
      time: '12:00 pm',
      unread: 0,
      avatar: 'KR',
      online: false
    },
    {
      name: 'Group Members',
      lastMessage: '👋 Lorem ipsum dolor sit amet,consectetur adipiscing',
      time: '12:00 pm',
      unread: 0,
      avatar: 'GM',
      online: false
    }
  ];

  const messages = [
    {
      sender: 'Anna Krylova',
      content: '👋 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: false
    },
    {
      sender: 'You',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: true
    },
    {
      sender: 'You',
      content: '👋 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: true
    },
    {
      sender: 'You',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: true
    },
    {
      sender: 'You',
      content: '👋 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: true
    },
    {
      sender: 'You',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '12 : 00 pm',
      isOwn: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
        <div className="flex-1 p-4 space-y-6">
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
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
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
              <AvatarFallback className="bg-gray-800 text-white text-sm">
                {getInitials()}
              </AvatarFallback>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Conversations */}
          <div className="w-100 bg-white border-r border-gray-200 flex flex-col">
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-2 py-2">
              <div className="flex bg-gray-200 rounded-lg py-2 px-2">
                {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 text-blue-600 bg-white rounded-lg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <Input
                placeholder="Search"
                className="w-full"
              />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <img 
                        src="/lovable-uploads/avatar1.jpg" 
                        alt={conversation.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">{conversation.name}</div>
                      <div className="text-xs text-gray-500">{conversation.time}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 truncate">{conversation.lastMessage}</div>
                      {conversation.unread > 0 && (
                        <div className="bg-gray-100 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Small Calling Card - Only show when not expanded */}
            {showCallingModal && !showExpandedCalling && (
              <div className="p-4">
                <div className="bg-gray-100 rounded-2xl p-6 relative">
                  {/* Header with Calling text and expand icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-medium text-gray-800">Calling...</div>
                    <button 
                      onClick={handleExpandCall}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Expand className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Avatars */}
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <img 
                          src="/lovable-uploads/avatar1.jpg" 
                          alt="Anna Krylova"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-100"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="bg-gray-800 rounded-2xl w-20 h-20 flex items-center justify-center">
                        <div className="text-xl font-bold text-white">BM</div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-100"></div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 rounded-2xl p-3 w-12 h-12"
                    >
                      <MicIcon className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 rounded-2xl p-3 w-12 h-12"
                    >
                      <Video className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 rounded-2xl p-3 w-12 h-12"
                    >
                      <Monitor className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 rounded-2xl p-3 w-12 h-12"
                      onClick={handleEndCall}
                    >
                      <PhoneOff className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Chat Messages */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <img 
                        src="/lovable-uploads/avatar1.jpg" 
                        alt="Anna Krylova"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-medium">Anna Krylova</div>
                    <div className="text-sm text-green-600">Online</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handlePhoneClick}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isOwn
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Calling Modal */}
      {showExpandedCalling && (
        <Dialog open={showExpandedCalling} onOpenChange={setShowExpandedCalling}>
          <DialogContent className="max-w-2xl">
            <div className="bg-gray-100 rounded-2xl p-8">
              {/* Header with Calling text and minimize icon */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-2xl font-medium text-gray-800">Calling...</div>
                <button 
                  onClick={handleMinimizeCall}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Minimize2 className="w-6 h-6" />
                </button>
              </div>
              
              {/* Large Avatars */}
              <div className="flex items-center justify-center space-x-16 mb-12">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <img 
                      src="/lovable-uploads/avatar1.jpg" 
                      alt="Anna Krylova"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Avatar>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-100"></div>
                </div>
                
                <div className="relative">
                  <div className="bg-gray-800 rounded-3xl w-32 h-32 flex items-center justify-center">
                    <div className="text-3xl font-bold text-white">BM</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-100"></div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-6">
                <Button
                  variant="ghost" 
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 rounded-3xl p-4 w-16 h-16"
                >
                  <MicIcon className="w-8 h-8 text-white" />
                </Button>
                
                <Button
                  variant="ghost" 
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 rounded-3xl p-4 w-16 h-16"
                >
                  <Video className="w-8 h-8 text-white" />
                </Button>
                
                <Button
                  variant="ghost" 
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 rounded-3xl p-4 w-16 h-16"
                >
                  <Monitor className="w-8 h-8 text-white" />
                </Button>
                
                <Button
                  variant="ghost" 
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 rounded-3xl p-4 w-16 h-16"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Chat;
