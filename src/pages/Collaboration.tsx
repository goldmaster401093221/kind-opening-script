import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
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
  ChevronLeft,
  ChevronRight,
  File,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState('In Progress');
  const [date, setDate] = useState<Date | undefined>(new Date());
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
    { icon: MessageSquare, label: 'Collaboration', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  const activities = [
    {
      user: 'Bashair Mussa',
      action: 'attached 1 file',
      link: 'View'
    },
    {
      user: 'Anna Krylova',
      action: 'attached 2 files',
      link: 'View'
    },
    {
      user: 'Kevin Rashy',
      action: 'has left 3 comments',
      link: 'View'
    },
    {
      user: 'Anna Krylova',
      action: 'attached 2 files',
      link: 'View'
    },
    {
      user: 'Kevin Rashy',
      action: 'has left 3 comments',
      link: 'View'
    }
  ];

  const supportingServicesData = [
    {
      name: '1 Shipment ( In progress )',
      link: 'View',
      icon: Ship
    },
    {
      name: '1 Quotation ( Completed )',
      link: 'View',
      icon: FileText
    },
    {
      name: '1 Experiment ( In progress )',
      link: 'View',
      icon: Wrench
    },
    {
      name: '1 Identify ( Completed )',
      link: 'View',
      icon: Database
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
      <div className="flex-1 flex flex-col bg-white min-w-0">
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
              <h1 className="text-xl font-semibold text-gray-900">Collaboration</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 lg:space-x-8 border-b border-gray-200 overflow-x-auto">
              {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6">
            {/* Main Collaboration Content */}
            <div className="lg:col-span-2 order-1">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Collaboration Status</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                        In Progress
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                      <span>From 2025-06-04</span>
                      <span>To 2025-06-25</span>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md flex justify-center"
                    />
                  </div>

                  {/* Today's Activity */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-4">Jun 18th (Today) Activity</h4>
                    <div className="space-y-3">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <File className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm flex-1 min-w-0">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </span>
                          <button className="text-blue-600 text-sm hover:underline flex-shrink-0">
                            {activity.link}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                    <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => navigate('/data-center')}>
                      Go to Data Center
                    </Button>
                    <Button variant="outline" className="text-blue-600 border-blue-600" onClick={() => navigate('/chat')}>
                      Go to Chat Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 lg:col-span-2 lg:col-start-4 order-2">
              {/* Collaborators */}
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <h3 className="text-lg font-semibold mb-4">2 Collaborators</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <img 
                          src="/lovable-uploads/avatar2.jpg" 
                          alt="Bashair Mussa"
                          className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">Bashair Mussa (me)</div>
                        <div className="text-sm text-gray-500">Researcher Role</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Idea</Badge>
                          <Badge variant="outline" className="text-xs">Proposal</Badge>
                          <Badge variant="outline" className="text-xs">Grant Application</Badge>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-1 rounded flex-shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <img 
                          src="/lovable-uploads/avatar1.jpg" 
                          alt="Anna Krylova"
                          className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">Anna Krylova</div>
                        <div className="text-sm text-gray-500">Researcher Role</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Equipment</Badge>
                          <Badge variant="outline" className="text-xs">Experiment</Badge>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-1 rounded flex-shrink-0">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    End Collaboration
                  </Button>
                </CardContent>
              </Card>

              {/* Supporting Services */}
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <h3 className="text-lg font-semibold mb-4">Supporting Services</h3>
                  
                  <div className="space-y-3">
                    {supportingServicesData.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <service.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm truncate">{service.name}</span>
                        </div>
                        <button className="text-blue-600 text-sm hover:underline flex-shrink-0 ml-2">
                          {service.link}
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
