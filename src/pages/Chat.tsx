import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Menu,
  X
} from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('In Progress');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
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
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-200 ease-in-out`}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

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
            {sidebarItems.map((item, index) => (
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
                  setSidebarOpen(false);
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
                  setSidebarOpen(false);
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
                  setSidebarOpen(false);
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
            onClick={() => {
              navigate('/settings');
              setSidebarOpen(false);
            }}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-800 text-white text-sm">BM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Bashair Mussa</div>
              <div className="text-xs text-gray-500">Researcher Role</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Panel - Conversations */}
          <div className="w-full lg:w-100 bg-white border-r border-gray-200 flex flex-col">
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-2 py-2">
              <div className="flex bg-gray-200 rounded-lg py-2 px-2 overflow-x-auto">
                {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 lg:px-4 py-3 text-sm font-medium whitespace-nowrap ${
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
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <img 
                        src="/lovable-uploads/avatar1.jpg" 
                        alt={conversation.name}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                      />
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white">Online</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">{conversation.name}</div>
                      <div className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.time}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 truncate">{conversation.lastMessage}</div>
                      {conversation.unread > 0 && (
                        <div className="bg-gray-100 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Chat Messages */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <img 
                      src="/lovable-uploads/avatar1.jpg" 
                      alt="Anna Krylova"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-medium truncate">Anna Krylova</div>
                    <div className="text-sm text-green-600">Online</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
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
                <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
