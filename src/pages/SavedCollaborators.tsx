import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCollaborators } from '@/hooks/useCollaborators';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
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
  Search,
  Star,
  X
} from 'lucide-react';

const SavedCollaborators = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const { collaborators: allCollaborators, loading: collaboratorsLoading, isFavorite, isContacted, isCollaborated, isBestMatch, toggleFavorite, getDisplayName: getCollaboratorDisplayName, getInitials: getCollaboratorInitials, getUserRole } = useCollaborators();
  const [activeTab, setActiveTab] = useState('Saved');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [term1, setTerm1] = useState(true);
  const [term2, setTerm2] = useState(false);
  const [term3, setTerm3] = useState(true);
  const { toast } = useToast();

  // Filter collaborators to only show favorites
  const favoriteCollaborators = allCollaborators.filter(collaborator => isFavorite(collaborator.id));
  
  // Debug logging
  console.log('SavedCollaborators Debug:', {
    allCollaboratorsCount: allCollaborators.length,
    favoriteCollaboratorsCount: favoriteCollaborators.length,
    searchQuery,
    sortBy,
    profile: profile ? 'exists' : 'missing',
    user: user ? 'exists' : 'missing'
  });

  // Error handling for data processing
  try {
    // This will help catch any errors in the filtering/sorting logic
    if (!Array.isArray(allCollaborators)) {
      console.error('allCollaborators is not an array:', allCollaborators);
      throw new Error('Invalid collaborators data');
    }
  } catch (error) {
    console.error('Error in SavedCollaborators data processing:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading saved collaborators. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
  
  // Filter based on search query
  const filteredCollaborators = favoriteCollaborators.filter(collaborator => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const displayName = getCollaboratorDisplayName(collaborator).toLowerCase();
    const role = getUserRole(collaborator).toLowerCase();
    const institution = collaborator.institution?.toLowerCase() || '';
    const department = collaborator.department?.toLowerCase() || '';
    const primaryResearch = collaborator.primary_research_area?.toLowerCase() || '';
    const secondaryResearch = collaborator.secondary_research_area?.toLowerCase() || '';
    const keywords = collaborator.keywords?.join(' ').toLowerCase() || '';
    const specializationKeywords = collaborator.specialization_keywords?.join(' ').toLowerCase() || '';
    const bio = collaborator.career_description?.toLowerCase() || '';
    
    return displayName.includes(searchLower) || 
           role.includes(searchLower) || 
           institution.includes(searchLower) ||
           department.includes(searchLower) ||
           primaryResearch.includes(searchLower) ||
           secondaryResearch.includes(searchLower) ||
           keywords.includes(searchLower) ||
           specializationKeywords.includes(searchLower) ||
           bio.includes(searchLower);
  });

  // Sort collaborators based on selected sort option
  const sortedCollaborators = [...filteredCollaborators].sort((a, b) => {
    switch (sortBy) {
      case 'Rating':
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      case 'Collaborations':
        const collabA = a.collaboration_count || 0;
        const collabB = b.collaboration_count || 0;
        return collabB - collabA;
      case 'Relevant':
      default:
        // For relevant sorting, prioritize best matches, then contacted, then collaborated
        const aIsBestMatch = isBestMatch(a.id);
        const bIsBestMatch = isBestMatch(b.id);
        if (aIsBestMatch && !bIsBestMatch) return -1;
        if (!aIsBestMatch && bIsBestMatch) return 1;
        
        const aIsContacted = isContacted(a.id);
        const bIsContacted = isContacted(b.id);
        if (aIsContacted && !bIsContacted) return -1;
        if (!aIsContacted && bIsContacted) return 1;
        
        const aIsCollaborated = isCollaborated(a.id);
        const bIsCollaborated = isCollaborated(b.id);
        if (aIsCollaborated && !bIsCollaborated) return -1;
        if (!aIsCollaborated && bIsCollaborated) return 1;
        
        return 0;
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: true },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  // Get collaborators to display based on active tab
  const getDisplayedCollaborators = () => {
    if (activeTab === 'Saved') {
      return sortedCollaborators;
    }
    // For contacted tab, show collaborators that are contacted (you can implement this logic)
    return sortedCollaborators;
  };

  const displayedCollaborators = getDisplayedCollaborators();

  const handleViewProfile = (collaborator) => {
    setSelectedProfile(collaborator);
    setIsProfileModalOpen(true);
  };

  const handleToggleFavorite = async (collaboratorId: string) => {
    await toggleFavorite(collaboratorId);
  };

  const handleSendRequest = async () => {
    if (!requestOpen) {
      setRequestOpen(true);
      return;
    }
    if (!user || !selectedProfile) {
      toast({ title: 'Please sign in', description: 'You must be logged in to send a collaboration request.' });
      return;
    }
    if (!startDate || !endDate) {
      toast({ title: 'Missing dates', description: 'Please select both start and end dates.' });
      return;
    }
    const terms: string[] = [];
    if (term1) terms.push('Term of collaboration 1');
    if (term2) terms.push('Term of collaboration 2');
    if (term3) terms.push('Term of collaboration 3');

    const payload: any = {
      requester_id: user.id,
      collaborator_id: (selectedProfile as any).id,
      status: 'contacted',
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      terms,
    };

    const { error } = await supabase.from('collaborations').insert([payload as any]);
    if (error) {
      toast({ title: 'Failed to send request', description: error.message });
    } else {
      toast({ title: 'Request sent', description: 'Your collaboration request was sent successfully.' });
      setIsProfileModalOpen(false);
      setRequestOpen(false);
      setStartDate(undefined);
      setEndDate(undefined);
      setTerm1(true);
      setTerm2(false);
      setTerm3(true);
    }
  };

  // Add loading and error handling
  if (profileLoading || collaboratorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved collaborators...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view saved collaborators.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Saved Collaborators</h1>
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
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search saved collaborators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-700">
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
                <span>Total Results: {displayedCollaborators.length}</span>
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

          {/* Table */}
          <Card className="border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-300">
                <TableRow>
                  <TableHead className="text-gray-700 font-medium">Researcher</TableHead>
                  <TableHead className="text-center text-gray-700 font-medium">Total Collaborations</TableHead>
                  <TableHead className="text-center text-gray-700 font-medium">Ratings</TableHead>
                  <TableHead className="text-gray-700 font-medium">Research</TableHead>
                  <TableHead className="text-center text-gray-700 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                {!displayedCollaborators || displayedCollaborators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchQuery ? `No saved collaborators found matching "${searchQuery}"` : 'No saved collaborators available'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedCollaborators.map((collaborator, index) => (
                    <TableRow key={collaborator.id || index} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-14 h-14">
                          {collaborator.avatar_url ? (
                            <AvatarImage src={collaborator.avatar_url} alt="Avatar" />
                          ) : (
                            <AvatarFallback className="bg-gray-600 text-white">
                              {getCollaboratorInitials(collaborator)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{getCollaboratorDisplayName(collaborator)}</div>
                          <div className="text-sm text-gray-500">{getUserRole(collaborator)}</div>
                          <div className="text-xs text-gray-500">{collaborator.institution}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center bg-gray-100">
                      <span className="font-medium">{collaborator.collaboration_count || 0}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{collaborator.rating ? `${collaborator.rating}/5` : 'N/A'}</span>
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {collaborator.research_roles?.map((role, roleIndex) => (
                          <Badge key={roleIndex} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        )) || <span className="text-xs text-gray-500">No roles listed</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleToggleFavorite(collaborator.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              isFavorite(collaborator.id)
                                ? 'text-blue-600 fill-blue-600' 
                                : 'text-gray-400 hover:text-red-500'
                            }`} 
                          />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => navigate(`/chat?with=${collaborator.id}`)}
                        >
                          <MessageSquare className="w-4 h-4 text-gray-400 hover:text-blue-600" />
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
                   ))
                 )}
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
                  {selectedProfile.avatar_url ? (
                    <AvatarImage src={selectedProfile.avatar_url} alt={getCollaboratorDisplayName(selectedProfile)} />
                  ) : (
                    <AvatarFallback className="bg-gray-800 text-white text-sm">
                      {getCollaboratorInitials(selectedProfile)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{getCollaboratorDisplayName(selectedProfile)}</h3>
                  <p className="text-gray-600">{getUserRole(selectedProfile)}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-blue-500 text-white">
                      👍 Best Match
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedProfile.rating ? `${selectedProfile.rating}/5` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleToggleFavorite(selectedProfile.id)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(selectedProfile.id) ? 'text-blue-600 fill-blue-600' : 'text-gray-400'}`} />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      navigate(`/chat?with=${selectedProfile.id}`);
                    }}
                  >
                    <MessageSquare className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                    <p className="text-sm text-blue-600 break-all">{selectedProfile.linkedin_url || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm">{selectedProfile.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Research Gate Link</label>
                    <p className="text-sm text-blue-600 break-all">{selectedProfile.researchgate_url || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Google Scholar Link</label>
                  <p className="text-sm text-blue-600 break-all">{selectedProfile.google_scholar_url || 'Not provided'}</p>
                </div>
              </div>

              {/* Institution Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Institution</label>
                    <p className="text-sm">{selectedProfile.institution || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">College</label>
                    <p className="text-sm">{selectedProfile.college || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <p className="text-sm">{selectedProfile.department || 'Not provided'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country</label>
                    <p className="text-sm">{selectedProfile.country || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-sm">{selectedProfile.state_city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Post Number</label>
                    <p className="text-sm">{selectedProfile.postcode || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Research Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Research Experience</label>
                    <p className="text-sm font-semibold">{selectedProfile.experience || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Primary Research Field</label>
                    <p className="text-sm">{selectedProfile.primary_research_area || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Secondary Research Field</label>
                    <p className="text-sm">{selectedProfile.secondary_research_area || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Specialization/Key words</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.specialization_keywords?.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  )) || <span className="text-xs text-gray-500">No keywords listed</span>}
                </div>
              </div>

              {/* What I have */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">What I have</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.what_i_have?.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  )) || <span className="text-xs text-gray-500">No items listed</span>}
                </div>
              </div>

              {/* What I need */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">What I need</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.what_i_need?.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  )) || <span className="text-xs text-gray-500">No items listed</span>}
                </div>
              </div>

              {/* Bio */}
              {selectedProfile.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Bio</label>
                  <p className="text-sm text-gray-700">{selectedProfile.bio}</p>
                </div>
              )}

              {/* Collaboration Request Section (appears after clicking Send) */}
              {requestOpen && (
                <div className="pt-4 border-t space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">From Start date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {startDate ? format(startDate, 'PPP') : 'From Start date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">To End date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {endDate ? format(endDate, 'PPP') : 'To End date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="term1" checked={term1} onCheckedChange={(v) => setTerm1(!!v)} />
                      <label htmlFor="term1" className="text-sm text-gray-700">Term of collaboration</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="term2" checked={term2} onCheckedChange={(v) => setTerm2(!!v)} />
                      <label htmlFor="term2" className="text-sm text-gray-700">Term of collaboration</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="term3" checked={term3} onCheckedChange={(v) => setTerm3(!!v)} />
                      <label htmlFor="term3" className="text-sm text-gray-700">Term of collaboration</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendRequest}>
                  {requestOpen ? 'Send Request' : 'Send Collaboration Request'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedCollaborators;

