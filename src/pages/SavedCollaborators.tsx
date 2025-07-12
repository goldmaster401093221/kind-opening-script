
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  Heart,
  Copy,
  Eye,
  Search
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
    { icon: Bookmark, label: 'Saved Collaborators', active: true, route: '/saved-collaborators' },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false, route: '/collaboration' },
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

const SavedCollaborators = () => {
  const [activeTab, setActiveTab] = useState('Saved');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const collaborators = [
    {
      name: 'Kevin Rashy',
      role: 'Researcher Role',
      totalCollaborations: 12,
      rating: '4.8/5',
      skills: ['Idea', 'Proposal', 'Grant Application'],
      status: 'Best Match',
      statusType: 'contacted',
      collaborated: false
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      statusType: 'collaborated',
      collaborated: true
    },
    {
      name: 'Kevin Rashy',
      role: 'Researcher Role',
      totalCollaborations: 12,
      rating: '4.8/5',
      skills: ['Idea', 'Proposal', 'Grant Application'],
      status: '',
      statusType: 'contacted',
      collaborated: false
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: '',
      statusType: 'none',
      collaborated: false
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: '',
      statusType: 'none',
      collaborated: false
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
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Saved Collaborators</h1>
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
              <div className="flex space-x-8 border-b border-gray-200">
                {['Saved', 'Contacted'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-gray-900 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Controls */}
            <div className="mb-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>Results per page</span>
                    <Select value={resultsPerPage} onValueChange={setResultsPerPage}>
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="hidden sm:inline">Total Results: 15</span>
                  <div className="flex items-center space-x-2">
                    <span>Sort</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Relevant">Relevant</SelectItem>
                        <SelectItem value="Rating">Rating</SelectItem>
                        <SelectItem value="Collaborations">Collaborations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Cards View (hidden on md and up) */}
            <div className="block md:hidden space-y-4">
              {collaborators.map((collaborator, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <img 
                        src="/lovable-uploads/avatar2.jpg" 
                        alt={collaborator.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{collaborator.name}</div>
                      <div className="text-sm text-gray-500">{collaborator.role}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Collaborations</span>
                      <span className="font-medium">{collaborator.totalCollaborations}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{collaborator.rating}</span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Research Areas</div>
                      <div className="flex flex-wrap gap-1">
                        {collaborator.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {collaborator.status && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          <svg width="16" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.2999 4.00016H10.5C11.0523 4.00016 11.5 4.44788 11.5 5.00015V6.05235C11.5 6.18295 11.4744 6.3123 11.4247 6.4331L9.8775 10.1905C9.80035 10.3779 9.61775 10.5001 9.41515 10.5001H1C0.72386 10.5001 0.5 10.2763 0.5 10.0001V5.00015C0.5 4.72402 0.72386 4.50016 1 4.50016H2.74092C2.90339 4.50016 3.05572 4.42123 3.14941 4.28851L5.8761 0.425678C5.94735 0.324743 6.08165 0.290989 6.19215 0.346242L7.0992 0.799755C7.625 1.06267 7.89655 1.65646 7.75155 2.22618L7.2999 4.00016ZM3.5 5.2939V9.50015H9.0803L10.5 6.05235V5.00015H7.2999C6.64755 5.00015 6.1699 4.38564 6.3308 3.75346L6.78245 1.97947C6.81145 1.86553 6.75715 1.74677 6.65195 1.69419L6.3214 1.5289L3.96638 4.86519C3.84143 5.0422 3.6817 5.1873 3.5 5.2939ZM2.5 5.50015H1.5V9.50015H2.5V5.50015Z" fill="white"/>
                          </svg>
                          {collaborator.status}
                        </Badge>
                      )}
                      {collaborator.statusType === 'contacted' && (
                        <Badge className="bg-blue-200 text-blue-600 text-xs px-2 py-1 rounded-lg">
                          Contacted
                        </Badge>
                      )}
                      {collaborator.statusType === 'collaborated' && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                          Collaborated
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 pt-2 border-t">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Copy className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View (hidden on mobile) */}
            <Card className="border border-gray-200 hidden md:block">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="text-gray-700 font-medium">Researcher</TableHead>
                    <TableHead className="text-center text-gray-700 font-medium">Total Collaborations</TableHead>
                    <TableHead className="text-center text-gray-700 font-medium">Ratings</TableHead>
                    <TableHead className="text-gray-700 font-medium">Research</TableHead>
                    <TableHead className="text-center text-gray-700 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators.map((collaborator, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-14 h-14">
                            <img 
                              src="/lovable-uploads/avatar2.jpg" 
                              alt={collaborator.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{collaborator.name}</div>
                            <div className="text-sm text-gray-500">{collaborator.role}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {collaborator.status && (
                                <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  <svg width="16" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.2999 4.00016H10.5C11.0523 4.00016 11.5 4.44788 11.5 5.00015V6.05235C11.5 6.18295 11.4744 6.3123 11.4247 6.4331L9.8775 10.1905C9.80035 10.3779 9.61775 10.5001 9.41515 10.5001H1C0.72386 10.5001 0.5 10.2763 0.5 10.0001V5.00015C0.5 4.72402 0.72386 4.50016 1 4.50016H2.74092C2.90339 4.50016 3.05572 4.42123 3.14941 4.28851L5.8761 0.425678C5.94735 0.324743 6.08165 0.290989 6.19215 0.346242L7.0992 0.799755C7.625 1.06267 7.89655 1.65646 7.75155 2.22618L7.2999 4.00016ZM3.5 5.2939V9.50015H9.0803L10.5 6.05235V5.00015H7.2999C6.64755 5.00015 6.1699 4.38564 6.3308 3.75346L6.78245 1.97947C6.81145 1.86553 6.75715 1.74677 6.65195 1.69419L6.3214 1.5289L3.96638 4.86519C3.84143 5.0422 3.6817 5.1873 3.5 5.2939ZM2.5 5.50015H1.5V9.50015H2.5V5.50015Z" fill="white"/>
                                  </svg>
                                  {collaborator.status}
                                </Badge>
                              )}
                              {collaborator.statusType === 'contacted' && (
                                <Badge className="bg-blue-200 text-blue-600 text-xs px-2 py-1 rounded-lg">
                                  Contacted
                                </Badge>
                              )}
                              {collaborator.statusType === 'collaborated' && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                  Collaborated
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{collaborator.totalCollaborations}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{collaborator.rating}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {collaborator.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Heart className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 py-2">...</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SavedCollaborators;
