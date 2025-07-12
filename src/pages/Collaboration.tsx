
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { 
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';
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
  File,
  MessageCircle
} from 'lucide-react';

const AppSidebar = ({ navigate }: { navigate: any }) => {
  // Custom Icons Start
  const CustomHomeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.25 6.4375V0.25H6.4375V6.4375H0.25ZM0.25 13.75V7.5625H6.4375V13.75H0.25ZM7.5625 6.4375V0.25H13.75V6.4375H7.5625ZM7.5625 13.75V7.5625H13.75V13.75H7.5625ZM1.375 5.3125H5.3125V1.375H1.375V5.3125ZM8.6875 5.3125H12.625V1.375H8.6875V5.3125ZM8.6875 12.625H12.625V8.6875H8.6875V12.625ZM1.375 12.625H5.3125V8.6875H1.375V12.625Z" fill="currentColor"/>
    </svg>
  );

  const sidebarItems = [
    { icon: CustomHomeIcon, label: 'Home', active: false, route: '/' },
    { icon: Users, label: 'Dashboard', active: false, route: '/dashboard' },
    { icon: Users, label: 'Discover Collaborators', active: false, route: '/discover-collaborators' },
    { icon: Bookmark, label: 'Saved Collaborators', active: false, route: '/saved-collaborators' },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: true, route: '/collaboration' },
    { icon: MessageSquare, label: 'Chat', active: false, route: '/chat' },
    { icon: Database, label: 'Data Center', active: false, route: '/data-center' },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false, route: '/shipment' },
    { icon: FileText, label: 'Quotation', active: false, route: '/quotation' },
    { icon: Wrench, label: 'Equipment', active: false, route: '/equipment' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg">AIRCollab</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.route)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                      item.active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Collaborations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.route)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                      item.active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Supporting Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportingServices.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.route)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                      item.active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center space-x-3 px-3 py-2">
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
      </SidebarFooter>
    </Sidebar>
  );
};

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState('In Progress');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar navigate={navigate} />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold text-gray-900">Collaboration</h1>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-4 sm:space-x-8 border-b border-gray-200 overflow-x-auto">
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
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <h3 className="text-lg font-semibold">Collaboration Status</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 w-fit">
                          In Progress
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-6">
                        <span>From 2025-06-04</span>
                        <span>To 2025-06-25</span>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div className="mb-6 flex justify-center lg:justify-start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                      />
                    </div>

                    {/* Today's Activity */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-4">Jun 18th (Today) Activity</h4>
                      <div className="space-y-3">
                        {activities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                              <File className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                              </span>
                            </div>
                            <button className="text-blue-600 text-sm hover:underline flex-shrink-0">
                              {activity.link}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="text-blue-600 border-blue-600 flex-1" 
                        onClick={() => navigate('/data-center')}
                      >
                        Go to Data Center
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-blue-600 border-blue-600 flex-1" 
                        onClick={() => navigate('/chat')}
                      >
                        Go to Chat Room
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4 lg:space-y-6 lg:col-span-2 lg:col-start-4">
                {/* Collaborators */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">2 Collaborators</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <img 
                            src="/lovable-uploads/avatar2.jpg" 
                            alt="Bashair Mussa"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">Bashair Mussa (me)</div>
                          <div className="text-sm text-gray-500">Researcher Role</div>
                          <div className="flex flex-wrap gap-1 mt-2">
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
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <img 
                            src="/lovable-uploads/avatar1.jpg" 
                            alt="Anna Krylova"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">Anna Krylova</div>
                          <div className="text-sm text-gray-500">Researcher Role</div>
                          <div className="flex flex-wrap gap-1 mt-2">
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
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Supporting Services</h3>
                    
                    <div className="space-y-3">
                      {supportingServicesData.map((service, index) => (
                        <div key={index} className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                              <service.icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm truncate">{service.name}</span>
                          </div>
                          <button className="text-blue-600 text-sm hover:underline flex-shrink-0">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Collaboration;
