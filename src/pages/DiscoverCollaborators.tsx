
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
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
  Eye
} from 'lucide-react';

const DiscoverCollaborators = () => {
  const [activeTab, setActiveTab] = useState('Best Matching');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', active: false, path: '/' },
    { icon: Users, label: 'Dashboard', active: false, path: '/dashboard' },
    { icon: Users, label: 'Discover Collaborators', active: true, path: '/discover-collaborators' },
    { icon: Bookmark, label: 'Saved Collaborators', active: false, path: '/saved-collaborators' },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false, path: '/collaboration' },
    { icon: MessageSquare, label: 'Chat', active: false, path: '/chat' },
    { icon: Database, label: 'Data Center', active: false, path: '/data-center' },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false, path: '/shipment' },
    { icon: FileText, label: 'Quotation', active: false, path: '/quotation' },
    { icon: Wrench, label: 'Equipment', active: false, path: '/equipment' },
  ];

  const collaborators = [
    {
      name: 'Kevin Rashy',
      role: 'Researcher Role',
      totalCollaborations: 12,
      rating: '4.8/5',
      skills: ['Idea', 'Proposal', 'Grant Application'],
      status: 'Best Match',
      contacted: true
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: false
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: false
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: true
    }
  ];

  const AppSidebar = () => (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg">AIRCollab</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={item.active}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Collaborations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collaborationItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={item.active}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Supporting Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportingServices.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={item.active}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/settings')}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <div className="p-4">
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
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Discover Collaborators</h1>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 space-y-6">
            {/* Filter Tabs */}
            <div className="w-full max-w-80">
              <div className="flex space-x-4 bg-gray-200 px-2 py-2 rounded-lg">
                {['Best Matching', 'Search More'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex-1 ${
                      activeTab === tab
                        ? 'bg-white text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort</span>
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
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Results per page</span>
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
                <span className="text-sm text-gray-600">Total Results: 15</span>
              </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-300">
                    <TableRow>
                      <TableHead className="min-w-[200px]">Researcher</TableHead>
                      <TableHead className="text-center min-w-[120px]">Total Collaborations</TableHead>
                      <TableHead className="text-center min-w-[100px]">Ratings</TableHead>
                      <TableHead className="min-w-[180px]">What I have</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborators.map((collaborator, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                              <img 
                                src="/lovable-uploads/avatar1.jpg" 
                                alt={collaborator.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm sm:text-base truncate">{collaborator.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate">{collaborator.role}</div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1">
                                  <svg width="12" height="12" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.2999 4.00016H10.5C11.0523 4.00016 11.5 4.44788 11.5 5.00015V6.05235C11.5 6.18295 11.4744 6.3123 11.4247 6.4331L9.8775 10.1905C9.80035 10.3779 9.61775 10.5001 9.41515 10.5001H1C0.72386 10.5001 0.5 10.2763 0.5 10.0001V5.00015C0.5 4.72402 0.72386 4.50016 1 4.50016H2.74092C2.90339 4.50016 3.05572 4.42123 3.14941 4.28851L5.8761 0.425678C5.94735 0.324743 6.08165 0.290989 6.19215 0.346242L7.0992 0.799755C7.625 1.06267 7.89655 1.65646 7.75155 2.22618L7.2999 4.00016ZM3.5 5.2939V9.50015H9.0803L10.5 6.05235V5.00015H7.2999C6.64755 5.00015 6.1699 4.38564 6.3308 3.75346L6.78245 1.97947C6.81145 1.86553 6.75715 1.74677 6.65195 1.69419L6.3214 1.5289L3.96638 4.86519C3.84143 5.0422 3.6817 5.1873 3.5 5.2939ZM2.5 5.50015H1.5V9.50015H2.5V5.50015Z" fill="white"/>
                                  </svg>
                                  {collaborator.status}
                                </Badge>
                                {collaborator.contacted && (
                                  <Badge variant="outline" className="text-blue-600 text-xs">
                                    Contacted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center bg-gray-100">
                          <span className="font-medium">{collaborator.totalCollaborations}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{collaborator.rating}</span>
                        </TableCell>
                        <TableCell className="bg-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {collaborator.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
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
              </div>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center">
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DiscoverCollaborators;
