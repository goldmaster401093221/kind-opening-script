import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useDataCenter, DataCenterFile } from '@/hooks/useDataCenter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadDialog } from '@/components/FileUploadDialog';
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
  Upload,
  Eye,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const DataCenter = () => {
  const navigate = useNavigate();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const { 
    files: dbFiles, 
    comments, 
    loading, 
    uploading, 
    uploadFile, 
    addComment, 
    fetchComments, 
    incrementViews, 
    getFileUrl 
  } = useDataCenter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSort, setSelectedSort] = useState('Relevant');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showExternalView, setShowExternalView] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DataCenterFile | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showFileViewPanel, setShowFileViewPanel] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleCommentClick = async (file: DataCenterFile) => {
    setSelectedFile(file);
    await fetchComments(file.id);
    await incrementViews(file.id);
    setShowFileViewPanel(true);
  };

  const handleExternalClick = async (file: DataCenterFile) => {
    setSelectedFile(file);
    await fetchComments(file.id);
    await incrementViews(file.id);
    setShowExternalView(true);
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedFile) {
      await addComment(selectedFile.id, newComment);
      setNewComment('');
    }
  };

  const handleUpload = async (file: File, description?: string) => {
    await uploadFile(file, description);
  };

  const getUploaderName = (file: DataCenterFile) => {
    const uploader = file.uploader;
    if (uploader?.first_name && uploader?.last_name) {
      return `${uploader.first_name} ${uploader.last_name}`;
    }
    return uploader?.username || 'Unknown User';
  };

  const getUploaderInitials = (file: DataCenterFile) => {
    const uploader = file.uploader;
    if (uploader?.first_name && uploader?.last_name) {
      return `${uploader.first_name[0]}${uploader.last_name[0]}`;
    }
    if (uploader?.username) {
      return uploader.username.slice(0, 2).toUpperCase();
    }
    return 'UU';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Database, label: 'Data Center', active: true },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  // Filter files based on search term
  const files = dbFiles.filter(file => {
    const searchLower = searchTerm.toLowerCase();
    const uploaderName = getUploaderName(file);
    return (
      file.name.toLowerCase().includes(searchLower) ||
      file.file_type.toLowerCase().includes(searchLower) ||
      uploaderName.toLowerCase().includes(searchLower)
    );
  });

  const mockComments = [
    {
      id: 1,
      user: 'Anna Krylova',
      avatar: 'AK',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '5h ago'
    },
    {
      id: 2,
      user: 'Anna Krylova',
      avatar: 'AK',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '2h ago'
    },
    {
      id: 3,
      user: 'Anna Krylova',
      avatar: 'BM',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1h ago'
    },
    {
      id: 4,
      user: 'Anna Krylova',
      avatar: 'BM',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '15m ago'
    },
    {
      id: 5,
      user: 'Anna Krylova',
      avatar: 'AK',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: '6m ago'
    }
  ];

  if (showExternalView) {
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
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Dashboard</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/discover-collaborators')}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Discover Collaborators</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/saved-collaborators')}
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-sm">Saved Collaborators</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Collaborations
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/collaboration')}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Collaboration</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Chat</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer bg-blue-600 text-white"
                onClick={() => navigate('/data-center')}
              >
                <Database className="w-5 h-5" />
                <span className="text-sm">Data Center</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Supporting Services
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/shipment')}
              >
                <Ship className="w-5 h-5" />
                <span className="text-sm">Shipment</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/quotation')}
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm">Quotation</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
                onClick={() => navigate('/equipment')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">Equipment</span>
              </div>
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
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Data Center</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-semibold text-gray-900">{selectedFile?.name || 'File View'}</span>
              </div>
              <Button onClick={() => setShowExternalView(false)} variant="outline" size="sm">
                Back
              </Button>
            </div>
          </div>

          {/* External Content */}
          <div className="flex-1 p-6 flex gap-6">
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{selectedFile?.name || 'File Content'}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedFile?.views || 0} Views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">File Type: {selectedFile ? getFileExtension(selectedFile.name) : 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* File Content Area */}
              <div className="space-y-6">
                {selectedFile && (
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 font-semibold text-lg">
                            {getFileExtension(selectedFile.name)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{selectedFile.name}</h3>
                        <p className="text-gray-600">
                          {selectedFile.file_size ? `${Math.round(selectedFile.file_size / 1024)} KB` : 'Size unknown'}
                        </p>
                      </div>
                      
                      {selectedFile.description && (
                        <div className="mt-4 p-4 bg-white rounded border">
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-gray-700">{selectedFile.description}</p>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button 
                          onClick={() => window.open(getFileUrl(selectedFile.file_path), '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uploader Information */}
                {selectedFile && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Uploaded by</h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        {selectedFile.uploader?.avatar_url ? (
                          <AvatarImage src={selectedFile.uploader.avatar_url} alt="Avatar" />
                        ) : (
                          <AvatarFallback className="bg-gray-800 text-white">
                            {getUploaderInitials(selectedFile)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUploaderName(selectedFile)}</div>
                        <div className="text-sm text-gray-500">
                          Uploaded on {formatDate(selectedFile.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="w-80 bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{comments.length} Comments</h3>
              </div>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {comment.user?.avatar_url ? (
                        <AvatarImage src={comment.user.avatar_url} alt="Avatar" />
                      ) : (
                        <AvatarFallback className="bg-gray-800 text-white text-xs">
                          {comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {comment.user?.first_name && comment.user?.last_name 
                            ? `${comment.user.first_name} ${comment.user.last_name}`
                            : comment.user?.username || 'Unknown User'
                          }
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mb-2"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} size="sm">
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
            <h1 className="text-xl font-semibold text-gray-900">Data Center</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Data Center Content */}
        <div className="flex-1 p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Total files: 15</span>
              <span className="text-sm text-gray-600">Filters</span>
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option>All</option>
              </select>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option>All Types</option>
              </select>
              <span className="text-sm text-gray-600">Sort</span>
              <select 
                value={selectedSort} 
                onChange={(e) => setSelectedSort(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option>Relevant</option>
              </select>
            </div>
          </div>

          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white mb-6"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload a File
          </Button>

          {/* Files Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploader
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-100">
                        <div className="text-sm text-gray-900">{getFileExtension(file.name)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            {file.uploader?.avatar_url ? (
                              <AvatarImage src={file.uploader.avatar_url} alt="Avatar" />
                            ) : (
                              <AvatarFallback className="bg-gray-800 text-white text-xs">
                                {getUploaderInitials(file)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="text-sm text-gray-900">{getUploaderName(file)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-100">
                        <div className="text-sm text-gray-900">{formatDate(file.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900 underline">{file.views} Views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900 underline">{file.comment_count || 0} Comments</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-100">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-gray-300"
                            onClick={() => handleCommentClick(file)}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-gray-300"
                            onClick={() => handleExternalClick(file)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-2">
                  <Button variant="default" size="sm" className="bg-blue-600 text-white">1</Button>
                  <Button variant="ghost" size="sm">2</Button>
                  <Button variant="ghost" size="sm">3</Button>
                  <span className="text-sm text-gray-500">...</span>
                </div>
                <Button variant="ghost" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File View Panel - Right Side */}
      {showFileViewPanel && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="flex-1" onClick={() => setShowFileViewPanel(false)} />
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">File Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFileViewPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* File Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">{selectedFile.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Format: {getFileExtension(selectedFile.name)}</div>
                  <div>Uploaded: {formatDate(selectedFile.created_at)}</div>
                  <div>Size: {selectedFile.file_size ? `${Math.round(selectedFile.file_size / 1024)} KB` : 'Unknown'}</div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedFile.views} Views</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <Avatar className="w-8 h-8">
                    {selectedFile.uploader?.avatar_url ? (
                      <AvatarImage src={selectedFile.uploader.avatar_url} alt="Avatar" />
                    ) : (
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        {getUploaderInitials(selectedFile)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{getUploaderName(selectedFile)}</div>
                    <div className="text-gray-500">Uploader</div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mb-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {comments.length} Comments
                </h3>
                
                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        {comment.user?.avatar_url ? (
                          <AvatarImage src={comment.user.avatar_url} alt="Avatar" />
                        ) : (
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {comment.user?.first_name && comment.user?.last_name 
                              ? `${comment.user.first_name} ${comment.user.last_name}`
                              : comment.user?.username || 'Unknown User'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full mb-2"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment} size="sm">
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{selectedFile?.views || 0} Views</span>
                <MessageCircle className="w-4 h-4 ml-4" />
                <span className="text-sm">{comments.length} Comments</span>
                <ExternalLink className="w-4 h-4 ml-4" />
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-4">{comments.length} Comments</h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {comment.user?.avatar_url ? (
                      <AvatarImage src={comment.user.avatar_url} alt="Avatar" />
                    ) : (
                      <AvatarFallback className="bg-gray-800 text-white text-xs">
                        {comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {comment.user?.first_name && comment.user?.last_name 
                          ? `${comment.user.first_name} ${comment.user.last_name}`
                          : comment.user?.username || 'Unknown User'
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <Textarea
                placeholder="Comment here"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full mb-2"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} size="sm">
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUpload}
        uploading={uploading}
      />
    </div>
  );
};

export default DataCenter;
