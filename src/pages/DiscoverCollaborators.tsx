import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCollaborators } from '@/hooks/useCollaborators';
import { usePendingRequests } from '@/hooks/usePendingRequests';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  Star,
  Search,
  X
} from 'lucide-react';

const home = [
  { icon: Users, label: 'Dashboard', active: false },
  { icon: Users, label: 'Discover Collaborators', active: true },
  { icon: Bookmark, label: 'Saved Collaborators', active: false },
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

const DiscoverCollaborators = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const { collaborators, loading: collaboratorsLoading, isFavorite, isBestMatch, isContacted, isCollaborated, toggleFavorite, getDisplayName: getCollaboratorDisplayName, getInitials: getCollaboratorInitials, getUserRole } = useCollaborators();
  const { pendingCount } = usePendingRequests();
  const [activeTab, setActiveTab] = useState('Best Matching');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { toast } = useToast();

  // Filter collaborators based on search query
  const filteredCollaborators = collaborators.filter(collaborator => {
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
    const whatIHave = collaborator.what_i_have?.join(' ').toLowerCase() || '';
    const researchRole = collaborator.research_roles?.join(' ').toLowerCase() || '';
    const bio = collaborator.career_description?.toLowerCase() || '';
    
    return displayName.includes(searchLower) || 
           role.includes(searchLower) || 
           institution.includes(searchLower) ||
           department.includes(searchLower) ||
           primaryResearch.includes(searchLower) ||
           secondaryResearch.includes(searchLower) ||
           keywords.includes(searchLower) ||
           specializationKeywords.includes(searchLower) ||
           whatIHave.includes(searchLower) ||
           researchRole.includes(searchLower) ||
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


  const handleViewProfile = (collaborator) => {
    setSelectedProfile(collaborator);
    setIsProfileModalOpen(true);
  };

  const handleToggleHeart = async (collaboratorId: string) => {
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
    if (!termsAccepted) {
      setShowConfirmModal(true);
      return;
    }
    
    // Check if a request already exists between these users
    const { data: existingRequest, error: checkError } = await supabase
      .from('collaborations')
      .select('id, status')
      .eq('requester_id', user.id)
      .eq('collaborator_id', (selectedProfile as any).id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing request:', checkError);
      toast({ title: 'Error', description: 'Failed to check existing requests.' });
      return;
    }

    if (existingRequest) {
      // Request already exists
      if (existingRequest.status === 'contacted') {
        toast({ 
          title: 'Request Already Sent', 
          description: 'You have already sent a collaboration request to this user. Please wait for their response.',
          variant: 'destructive'
        });
        return;
      } else if (existingRequest.status === 'collaborated') {
        toast({ 
          title: 'Already Collaborating', 
          description: 'You are already collaborating with this user.',
          variant: 'destructive'
        });
        return;
      } else {
        // For declined, ended, completed, or other statuses, allow sending new request
        // Show a toast to inform user about previous request status
        let statusMessage = '';
        switch (existingRequest.status) {
          case 'declined':
            statusMessage = 'Your previous request was declined.';
            break;
          case 'ended':
            statusMessage = 'Your previous collaboration has ended.';
            break;
          case 'completed':
            statusMessage = 'Your previous collaboration was completed.';
            break;
          default:
            statusMessage = `Your previous request status was: ${existingRequest.status}.`;
        }
        
        toast({ 
          title: 'Previous Request Found', 
          description: `${statusMessage} You can send a new collaboration request.`,
        });
        // Continue with the request process
      }
    }
    
    // Show agreement modal if terms are accepted
    setShowAgreementModal(true);
  };

  const handleConfirmAgreement = async () => {
    setShowAgreementModal(false);
    
    const payload: any = {
      requester_id: user.id,
      collaborator_id: (selectedProfile as any).id,
      status: 'contacted',
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      terms: ['Terms of collaboration accepted'],
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
      setTermsAccepted(false);
    }
  };

  const handleDeclineAgreement = () => {
    setShowAgreementModal(false);
  };

  const handleBackToTerms = () => {
    setShowConfirmModal(false);
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
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
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
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.label === 'Collaboration' && pendingCount > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </div>
                )}
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
            <h1 className="text-xl font-semibold text-gray-900">Discover Collaborators</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
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
              {/* Left side - Search and Sort */}
              <div className="flex items-center space-x-4">
                <div className="relative flex item-center w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search collaborators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 max-w-md"
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
              
              {/* Right side - Results controls */}
              <div className="flex flex-col item-center sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm text-gray-600">Total Results: {sortedCollaborators.length}</span>
                
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
                     {sortedCollaborators.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={5} className="text-center py-8">
                           <div className="text-gray-500">
                             {searchQuery ? `No collaborators found matching "${searchQuery}"` : 'No collaborators available'}
                           </div>
                         </TableCell>
                       </TableRow>
                     ) : (
                       sortedCollaborators.map((collaborator, index) => (
                         <TableRow key={collaborator.id} className="hover:bg-gray-50">
                         <TableCell>
                           <div className="flex items-center space-x-3">
                             <Avatar className="w-14 h-14 flex-shrink-0">
                               {collaborator.avatar_url ? (
                                 <AvatarImage src={collaborator.avatar_url} alt={getCollaboratorDisplayName(collaborator)} />
                               ) : (
                                 <AvatarFallback className="bg-gray-800 text-white text-sm">
                                   {getCollaboratorInitials(collaborator)}
                                 </AvatarFallback>
                               )}
                             </Avatar>
                             <div className="min-w-0">
                               <div className="font-medium truncate">{getCollaboratorDisplayName(collaborator)}</div>
                               <div className="text-sm text-gray-500 truncate">{getUserRole(collaborator)}</div>
                               <div className="flex flex-wrap items-center gap-2 mt-1">
                                 {isBestMatch(collaborator.id) && (
                                   <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1">
                                     <svg width="16" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M7.2999 4.00016H10.5C11.0523 4.00016 11.5 4.44788 11.5 5.00015V6.05235C11.5 6.18295 11.4744 6.3123 11.4247 6.4331L9.8775 10.1905C9.80035 10.3779 9.61775 10.5001 9.41515 10.5001H1C0.72386 10.5001 0.5 10.2763 0.5 10.0001V5.00015C0.5 4.72402 0.72386 4.50016 1 4.50016H2.74092C2.90339 4.50016 3.05572 4.42123 3.14941 4.28851L5.8761 0.425678C5.94735 0.324743 6.08165 0.290989 6.19215 0.346242L7.0992 0.799755C7.625 1.06267 7.89655 1.65646 7.75155 2.22618L7.2999 4.00016ZM3.5 5.2939V9.50015H9.0803L10.5 6.05235V5.00015H7.2999C6.64755 5.00015 6.1699 4.38564 6.3308 3.75346L6.78245 1.97947C6.81145 1.86553 6.75715 1.74677 6.65195 1.69419L6.3214 1.5289L3.96638 4.86519C3.84143 5.0422 3.6817 5.1873 3.5 5.2939ZM2.5 5.50015H1.5V9.50015H2.5V5.50015Z" fill="white"/>
                                     </svg>
                                     Best Match
                                   </Badge>
                                 )}
                                 {isContacted(collaborator.id) && (
                                   <Badge variant="outline" className="text-blue-600 text-xs">
                                     Contacted
                                   </Badge>
                                 )}
                                 {isCollaborated(collaborator.id) && (
                                   <Badge variant="outline" className="text-green-600 text-xs">
                                     Collaborated
                                   </Badge>
                                 )}
                               </div>
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
                              {collaborator.what_i_have?.map((item, itemIndex) => (
                                <Badge key={itemIndex} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              )) || <span className="text-xs text-gray-500">No items listed</span>}
                            </div>
                          </TableCell>
                         <TableCell>
                           <div className="flex items-center space-x-2">
                             <button 
                               className="p-1 hover:bg-gray-100 rounded"
                               onClick={() => handleToggleHeart(collaborator.id)}
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
                      {isBestMatch(selectedProfile.id) && (
                        <Badge className="bg-blue-500 text-white">
                          👍 Best Match
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedProfile.rating ? `${selectedProfile.rating}/5` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleToggleHeart(selectedProfile.id)}
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
                    {/* <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-sm">{selectedProfile.country || 'Not provided'}</p>
                    </div> */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country/City</label>
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
                        <Checkbox id="termsAccepted" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
                        <label htmlFor="termsAccepted" className="text-sm text-gray-700">I agree to the terms and conditions</label>
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

        {/* Agreement Modal */}
        <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Terms of Collaboration</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                I agree to work in good faith, sharing expertise and responsibilities to achieve the objectives of the collaboration. I commit to maintaining integrity, transparency, and confidentiality where required. I adhere to general ethical standards of collaboration and make fair contributions to the collaborative projects. In case of disagreements, issues should be resolved through open, civilized and trustful dialogue.
              </p>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={handleDeclineAgreement}>
                No, Thanks.
              </Button>
              <Button onClick={handleConfirmAgreement}>
                Yes, I agree.
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Terms Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Terms Required</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                Please confirm the term of collaboration.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleBackToTerms}>
                Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DiscoverCollaborators;
