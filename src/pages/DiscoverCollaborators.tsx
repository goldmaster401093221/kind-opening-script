
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
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
  Star
} from 'lucide-react';

const AppSidebar = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();

  const home = [
    { icon: Users, label: 'Dashboard', path: '/dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', path: '/discover-collaborators', active: true },
    { icon: Bookmark, label: 'Saved Collaborators', path: '/saved-collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', path: '/collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', path: '/chat', active: false },
    { icon: Database, label: 'Data Center', path: '/data-center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', path: '/shipment', active: false },
    { icon: FileText, label: 'Quotation', path: '/quotation', active: false },
    { icon: Wrench, label: 'Equipment', path: '/equipment', active: false },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AIRCollab</span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Home
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {home.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                        item.active 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {state === 'expanded' && <span className="text-sm">{item.label}</span>}
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
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                        item.active 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {state === 'expanded' && <span className="text-sm">{item.label}</span>}
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
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                        item.active 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {state === 'expanded' && <span className="text-sm">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                {state === 'expanded' && <span className="text-sm">Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-800 text-white text-sm">BM</AvatarFallback>
            </Avatar>
            {state === 'expanded' && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">Bashair Mussa</div>
                  <div className="text-xs text-gray-500">Researcher Role</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const DiscoverCollaborators = () => {
  const [activeTab, setActiveTab] = useState('Best Matching');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
      contacted: true,
      profile: {
        linkedin: 'https://linkedin.com/in/kevin-rashy-0234c12',
        phone: '+1 (229) 690-9308',
        researchGate: 'https://www.researchgate.info/kevinrashy',
        googleScholar: 'https://www.googlescholar.info/kevinrashy',
        institution: 'Institution name',
        collage: 'Collage name',
        department: 'Department name',
        country: 'United States',
        city: 'Los Angeles, CA',
        postNumber: '98500',
        researchExperience: '12',
        primaryResearchField: 'Primary Research Field',
        secondaryResearchField: 'Secondary Research Field',
        keywords: ['Keyword1', 'Keyword2', 'Keyword3', 'Keyword4'],
        whatIHave: ['Idea', 'Proposal', 'Grant Application'],
        whatINeed: ['Equipment', 'Experiment']
      }
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: false,
      profile: {
        linkedin: 'https://linkedin.com/in/anna-krylova-1234c12',
        phone: '+1 (555) 123-4567',
        researchGate: 'https://www.researchgate.info/annakrylova',
        googleScholar: 'https://www.googlescholar.info/annakrylova',
        institution: 'University name',
        collage: 'Science Collage',
        department: 'Physics Department',
        country: 'United States',
        city: 'New York, NY',
        postNumber: '10001',
        researchExperience: '15',
        primaryResearchField: 'Quantum Physics',
        secondaryResearchField: 'Materials Science',
        keywords: ['Quantum', 'Materials', 'Physics', 'Research'],
        whatIHave: ['Equipment', 'Experiment'],
        whatINeed: ['Funding', 'Collaboration']
      }
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: false,
      profile: {
        linkedin: 'https://linkedin.com/in/anna-krylova-1234c12',
        phone: '+1 (555) 123-4567',
        researchGate: 'https://www.researchgate.info/annakrylova',
        googleScholar: 'https://www.googlescholar.info/annakrylova',
        institution: 'University name',
        collage: 'Science Collage',
        department: 'Physics Department',
        country: 'United States',
        city: 'New York, NY',
        postNumber: '10001',
        researchExperience: '15',
        primaryResearchField: 'Quantum Physics',
        secondaryResearchField: 'Materials Science',
        keywords: ['Quantum', 'Materials', 'Physics', 'Research'],
        whatIHave: ['Equipment', 'Experiment'],
        whatINeed: ['Funding', 'Collaboration']
      }
    },
    {
      name: 'Anna Krylova',
      role: 'Researcher Role',
      totalCollaborations: 24,
      rating: '4.9/5',
      skills: ['Equipment', 'Experiment'],
      status: 'Best Match',
      contacted: true,
      profile: {
        linkedin: 'https://linkedin.com/in/anna-krylova-1234c12',
        phone: '+1 (555) 123-4567',
        researchGate: 'https://www.researchgate.info/annakrylova',
        googleScholar: 'https://www.googlescholar.info/annakrylova',
        institution: 'University name',
        collage: 'Science Collage',
        department: 'Physics Department',
        country: 'United States',
        city: 'New York, NY',
        postNumber: '10001',
        researchExperience: '15',
        primaryResearchField: 'Quantum Physics',
        secondaryResearchField: 'Materials Science',
        keywords: ['Quantum', 'Materials', 'Physics', 'Research'],
        whatIHave: ['Equipment', 'Experiment'],
        whatINeed: ['Funding', 'Collaboration']
      }
    }
  ];

  const handleViewProfile = (collaborator) => {
    setSelectedProfile(collaborator);
    setIsProfileModalOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold text-gray-900">Discover Collaborators</h1>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-4 bg-gray-200 px-2 py-2 rounded-lg w-fit">
                {['Best Matching', 'Search More'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              {/* Left side - Sort (only shown when Best Matching is active) */}
              {activeTab === 'Best Matching' && (
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
              )}
              
              {/* Right side - Results controls */}
              <div className="flex flex-col item-center sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Sort field when in Search More mode */}
                {activeTab === 'Search More' && (
                  <>
                    <div className="flex item-center w-80">
                      <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                      />
                    </div>

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
                  </>
                )}
                
                <span className="text-sm text-gray-600">Total Results: 15</span>
                
                <div className="flex items-center space-x-2">
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
              </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-300">
                    <TableRow>
                      <TableHead className="min-w-[200px]">Researcher</TableHead>
                      <TableHead className="text-center min-w-[150px]">Total Collaborations</TableHead>
                      <TableHead className="text-center min-w-[100px]">Ratings</TableHead>
                      <TableHead className="min-w-[200px]">What I have</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborators.map((collaborator, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-14 h-14 flex-shrink-0">
                              <img 
                                src="/lovable-uploads/avatar1.jpg" 
                                alt={collaborator.name}
                                className="max-w-full h-auto rounded-lg shadow-lg"
                              />
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{collaborator.name}</div>
                              <div className="text-sm text-gray-500 truncate">{collaborator.role}</div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1">
                                  <svg width="16" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <button 
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => handleViewProfile(collaborator)}
                            >
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
        </div>

        {/* Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            
            {selectedProfile && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <img 
                      src="/lovable-uploads/avatar1.jpg" 
                      alt={selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedProfile.name}</h3>
                    <p className="text-gray-600">{selectedProfile.role}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className="bg-blue-500 text-white">
                        👍 Best Match
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedProfile.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                      <p className="text-sm text-blue-600 break-all">{selectedProfile.profile.linkedin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-sm">{selectedProfile.profile.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Research Gate Link</label>
                      <p className="text-sm text-blue-600 break-all">{selectedProfile.profile.researchGate}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Google Scholar Link</label>
                    <p className="text-sm text-blue-600 break-all">{selectedProfile.profile.googleScholar}</p>
                  </div>
                </div>

                {/* Institution Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Institution</label>
                      <p className="text-sm">{selectedProfile.profile.institution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Collage</label>
                      <p className="text-sm">{selectedProfile.profile.collage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-sm">{selectedProfile.profile.department}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-sm">{selectedProfile.profile.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-sm">{selectedProfile.profile.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Post Number</label>
                      <p className="text-sm">{selectedProfile.profile.postNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Research Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Research Experience in Years</label>
                      <p className="text-sm font-semibold">{selectedProfile.profile.researchExperience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Primary Research Field</label>
                      <p className="text-sm">{selectedProfile.profile.primaryResearchField}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Secondary Research Field</label>
                      <p className="text-sm">{selectedProfile.profile.secondaryResearchField}</p>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Specialization/Key words</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.profile.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* What I have */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">What I have</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.profile.whatIHave.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* What I need */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">What I need</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.profile.whatINeed.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Send Collaboration Request
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default DiscoverCollaborators;
