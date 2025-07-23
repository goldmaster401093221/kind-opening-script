import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useCollaboratorActions } from '@/hooks/useCollaboratorActions';
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
import { AvatarImage } from '@/components/ui/avatar';

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
  const [activeTab, setActiveTab] = useState('Best Matching');
  const [sortBy, setSortBy] = useState('Relevant');
  const [resultsPerPage, setResultsPerPage] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Use database hooks
  const searchQueryForHook = activeTab === 'Search More' ? searchQuery : '';
  const { 
    collaborators, 
    loading: collaboratorsLoading, 
    error, 
    refetch,
    getDisplayName: getCollaboratorDisplayName,
    getInitials: getCollaboratorInitials,
    getUserRole,
    getCollaborationStatus,
    isCollaboratorSaved,
    isCollaboratorContacted,
    hasCollaborated
  } = useCollaborators(searchQueryForHook, sortBy);

  const { 
    loading: actionLoading, 
    toggleSaveCollaborator, 
    contactCollaborator 
  } = useCollaboratorActions();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleViewProfile = (collaborator) => {
    setSelectedProfile(collaborator);
    setIsProfileModalOpen(true);
  };

  const handleToggleHeart = async (collaboratorId: string) => {
    const currentlySaved = isCollaboratorSaved(collaboratorId);
    const success = await toggleSaveCollaborator(collaboratorId, currentlySaved);
    if (success) {
      refetch(); // Refresh the collaborators list
    }
  };

  const handleContact = async (collaboratorId: string) => {
    const success = await contactCollaborator(collaboratorId);
    if (success) {
      refetch(); // Refresh the collaborators list
    }
  };

  if (profileLoading || collaboratorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collaborators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
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
                
                <span className="text-sm text-gray-600">Total Results: {collaborators.length}</span>
                
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
                    {collaborators.map((collaborator, index) => {
                      const displayName = getCollaboratorDisplayName(collaborator);
                      const initials = getCollaboratorInitials(collaborator);
                      const userRole = getUserRole(collaborator);
                      const isSaved = isCollaboratorSaved(collaborator.id);
                      const isContacted = isCollaboratorContacted(collaborator.id);
                      const isCollaborated = hasCollaborated(collaborator.id);
                      
                      return (
                        <TableRow key={collaborator.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-14 h-14 flex-shrink-0">
                                {collaborator.avatar_url ? (
                                  <img 
                                    src={collaborator.avatar_url} 
                                    alt={displayName}
                                    className="max-w-full h-auto rounded-lg shadow-lg"
                                  />
                                ) : (
                                  <AvatarFallback className="bg-gray-200 text-gray-700">
                                    {initials}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{displayName}</div>
                                <div className="text-sm text-gray-500 truncate">{userRole}</div>
                                <div className="text-xs text-gray-400 truncate">
                                  {collaborator.institution && <span>{collaborator.institution}</span>}
                                  {collaborator.institution && collaborator.state_city && <span> • </span>}
                                  {collaborator.state_city && <span>{collaborator.state_city}</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {isCollaborated && (
                                    <Badge className="bg-green-500 text-white text-xs">
                                      Collaborated
                                    </Badge>
                                  )}
                                  {isContacted && !isCollaborated && (
                                    <Badge className="bg-blue-500 text-white text-xs">
                                      Contacted
                                    </Badge>
                                  )}
                                  {isSaved && !isContacted && !isCollaborated && (
                                    <Badge className="bg-yellow-500 text-white text-xs">
                                      Saved
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
                            <span className="font-medium">{collaborator.rating ? `${collaborator.rating.toFixed(1)}/5` : '0.0/5'}</span>
                          </TableCell>
                          <TableCell className="bg-gray-100">
                            <div className="flex flex-wrap gap-1">
                              {(collaborator.what_i_have || []).map((item, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => handleToggleHeart(collaborator.id)}
                                disabled={actionLoading}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    isSaved 
                                      ? 'text-red-500 fill-red-500' 
                                      : 'text-gray-400 hover:text-red-500'
                                  }`} 
                                />
                              </button>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => handleContact(collaborator.id)}
                                disabled={actionLoading || isContacted}
                              >
                                <MessageSquare className={`w-4 h-4 ${isContacted ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`} />
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
                      );
                    })}
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
      </div>
    </div>
  );
};

export default DiscoverCollaborators;
