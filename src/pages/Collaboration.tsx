import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  ChevronLeft,
  ChevronRight,
  File,
  MessageCircle
} from 'lucide-react';

const Collaboration = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const [activeTab, setActiveTab] = useState('In Progress');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showEndCollaborationModal, setShowEndCollaborationModal] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleEndCollaboration = () => {
    setShowEndCollaborationModal(false);
    // Add logic to end collaboration here
  };

  const home = [
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

  const renderTabContent = () => {
    if (activeTab === 'Upcoming') {
      return (
        <div className="grid grid-cols-6 gap-4">
          {/* Main Collaboration Content */}
          <div className="col-span-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Collaboration Status</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                      Upcoming
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <span>From 2025-06-04</span>
                    <span>To 2025-06-25</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-4">2 Collaborators</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <img 
                          src="/lovable-uploads/avatar2.jpg" 
                          className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Bashair Mussa (me)</div>
                        <div className="text-sm text-gray-500">Researcher Role</div>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">Idea</Badge>
                          <Badge variant="outline" className="text-xs">Proposal</Badge>
                          <Badge variant="outline" className="text-xs">Grant Application</Badge>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <img 
                          src="/lovable-uploads/avatar1.jpg" 
                          className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Anna Krylova</div>
                        <div className="text-sm text-gray-500">Researcher Role</div>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">Equipment</Badge>
                          <Badge variant="outline" className="text-xs">Experiment</Badge>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Invite More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (activeTab === 'Requests') {
      return (
        <div className="grid grid-cols-6 gap-4">
          {/* Main Collaboration Content */}
          <div className="col-span-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Collaboration Status</h3>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                      Incoming Request
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <span>From 2025-06-04</span>
                    <span>To 2025-06-25</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-4">Collaborator</h4>
                  
                  <div className="flex items-start space-x-3 mb-6">
                    <Avatar className="w-12 h-12">
                      <img 
                        src="/lovable-uploads/avatar1.jpg" 
                        className="max-w-full h-auto rounded-lg shadow-lg"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">Anna Krylova</div>
                      <div className="text-sm text-gray-500">Researcher Role</div>
                      <div className="flex space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">Equipment</Badge>
                        <Badge variant="outline" className="text-xs">Experiment</Badge>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-4">Terms of Collaboration</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="term1" defaultChecked />
                        <label htmlFor="term1" className="text-sm">Term of collaboration</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="term2" />
                        <label htmlFor="term2" className="text-sm">Term of collaboration</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="term3" defaultChecked />
                        <label htmlFor="term3" className="text-sm">Term of collaboration</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Accept Request
                    </Button>
                    <Button variant="outline" className="text-blue-600 border-blue-600">
                      Reject Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Default "In Progress" content
    return (
      <div className="grid grid-cols-6 gap-4">
        {/* Main Collaboration Content */}
        <div className="col-span-2 ">
          <Card>
            <CardContent className="p-6">
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
                  className="rounded-md  flex"
                />
              </div>

              {/* Today's Activity */}
              <div className="mb-6">
                <h4 className="font-medium mb-4">Jun 18th (Today) Activity</h4>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <File className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm flex-1">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </span>
                      <button className="text-blue-600 text-sm hover:underline">
                        {activity.link}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
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
        <div className="space-y-6 col-span-2 col-start-4">
          {/* Collaborators */}
          <Card className="">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">2 Collaborators</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <img 
                      src="/lovable-uploads/avatar2.jpg" 
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Bashair Mussa (me)</div>
                    <div className="text-sm text-gray-500">Researcher Role</div>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">Idea</Badge>
                      <Badge variant="outline" className="text-xs">Proposal</Badge>
                      <Badge variant="outline" className="text-xs">Grant Application</Badge>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <img 
                      src="/lovable-uploads/avatar1.jpg" 
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Anna Krylova</div>
                    <div className="text-sm text-gray-500">Researcher Role</div>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">Equipment</Badge>
                      <Badge variant="outline" className="text-xs">Experiment</Badge>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowEndCollaborationModal(true)}
              >
                End Collaboration
              </Button>
            </CardContent>
          </Card>

          {/* Supporting Services */}
          <Card className="">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Supporting Services</h3>
              
              <div className="space-y-3">
                {supportingServicesData.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <service.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <button className="text-blue-600 text-sm hover:underline">
                      {service.link}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

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
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Collaboration</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-8 border-b border-gray-200">
              {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium ${
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

          {renderTabContent()}
        </div>
      </div>

      {/* End Collaboration Modal */}
      <Dialog open={showEndCollaborationModal} onOpenChange={setShowEndCollaborationModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">End Collaboration</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-600 mt-4">
            Your collaboration has 2 days remaining, are you still going to end this collaboration?
          </DialogDescription>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEndCollaborationModal(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEndCollaboration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Yes, End Collaboration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Collaboration;
