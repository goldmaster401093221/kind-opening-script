import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSort, setSelectedSort] = useState('Relevant');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showExternalView, setShowExternalView] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleCommentClick = (file) => {
    setSelectedFile(file);
    setShowCommentModal(true);
  };

  const handleExternalClick = (file) => {
    setSelectedFile(file);
    setShowExternalView(true);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
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

  const files = [
    {
      name: 'Experiment Report #001',
      format: 'PDF',
      uploader: 'Anna Krylova',
      uploaderAvatar: 'AK',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    },
    {
      name: 'Image',
      format: 'JPG',
      uploader: 'Bashair Mussa',
      uploaderAvatar: 'BM',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    },
    {
      name: 'Experiment Report #001',
      format: 'PDF',
      uploader: 'Anna Krylova',
      uploaderAvatar: 'AK',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    },
    {
      name: 'Image',
      format: 'JPG',
      uploader: 'Bashair Mussa',
      uploaderAvatar: 'BM',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    },
    {
      name: 'Experiment Report #001',
      format: 'PDF',
      uploader: 'Anna Krylova',
      uploaderAvatar: 'AK',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    },
    {
      name: 'Image',
      format: 'JPG',
      uploader: 'Bashair Mussa',
      uploaderAvatar: 'BM',
      uploadedDate: '2025-06-14',
      views: 2,
      comments: 5,
      status: 'active'
    }
  ];

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
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Data Center</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-semibold text-gray-900">Experiment Report</span>
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
                <h1 className="text-2xl font-bold">Experiment Report #001</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Page</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>1/3</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <div className="flex gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" 
                    alt="Research"
                    className="w-80 h-60 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                      fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                      mollit anim id est laborum.
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                  commodo consequant.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore 
                  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                  commodo consequat.
                </p>

                {/* Earnings Chart */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Earnings</h3>
                    <select className="text-sm border border-gray-300 rounded px-3 py-1">
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-center text-gray-500">Chart placeholder - $510</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="w-80 bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">5 Comments</h3>
              </div>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={`${
                        comment.avatar === 'AK' ? 'bg-orange-500' : 'bg-gray-800'
                      } text-white text-xs`}>
                        {comment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{comment.user}</span>
                        <span className="text-xs text-gray-500">{comment.time}</span>
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
                  className="w-full"
                />
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

          <Button className="bg-blue-600 hover:bg-blue-700 text-white mb-6">
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
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-100">
                        <div className="text-sm text-gray-900">{file.format}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <img 
                              src="/lovable-uploads/avatar1.jpg" 
                              alt="Avatar"
                              className="max-w-full h-auto rounded-lg shadow-lg"
                            />
                          </Avatar>
                          <div className="text-sm text-gray-900">{file.uploader}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-100">
                        <div className="text-sm text-gray-900">{file.uploadedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900 underline">{file.views} Views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.833008 0.650391H15.833C16.2103 0.650391 16.5164 0.955765 16.5166 1.33301V13C16.5166 13.3774 16.2104 13.6836 15.833 13.6836H3.66016L3.62012 13.7158L0.150391 16.4404V1.33301C0.150567 0.955875 0.455876 0.650566 0.833008 0.650391ZM1.5166 13.6289L1.75977 13.4385L3.1875 12.3164H15.1504V2.0166H1.5166V13.6289ZM7.25684 4.70117C5.93247 5.49858 5.95312 6.70755 5.95312 6.9707V7.14258L6.12305 7.11914C6.24021 7.10297 6.36462 7.1008 6.48828 7.1123C7.16629 7.17522 7.69629 7.73087 7.69629 8.41699C7.69611 9.13942 7.11018 9.72461 6.3877 9.72461C5.98409 9.72452 5.59571 9.53926 5.35254 9.28125C4.95092 8.85494 4.73344 8.38061 4.7334 7.58789C4.7334 6.24081 5.65623 5.01145 7.04102 4.36719L7.25684 4.70117ZM11.4238 4.70117C10.0992 5.49858 10.1191 6.70754 10.1191 6.9707V7.14258L10.29 7.11914C10.407 7.10302 10.5308 7.10086 10.6543 7.1123H10.6553C11.3331 7.17535 11.8633 7.73097 11.8633 8.41699C11.8631 9.13941 11.2771 9.7246 10.5547 9.72461C10.1508 9.72461 9.76179 9.53949 9.51855 9.28125C9.11695 8.85493 8.90043 8.3806 8.90039 7.58789C8.90039 6.24098 9.82258 5.01152 11.207 4.36719L11.4238 4.70117Z" fill="#161616" stroke="white" strokeWidth="0.3"/>
                            </svg>
                            <span className="text-sm text-gray-900 underline">{file.comments} Comments</span>
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
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.833008 0.650391H15.833C16.2103 0.650391 16.5164 0.955765 16.5166 1.33301V13C16.5166 13.3774 16.2104 13.6836 15.833 13.6836H3.66016L3.62012 13.7158L0.150391 16.4404V1.33301C0.150567 0.955875 0.455876 0.650566 0.833008 0.650391ZM1.5166 13.6289L1.75977 13.4385L3.1875 12.3164H15.1504V2.0166H1.5166V13.6289ZM7.25684 4.70117C5.93247 5.49858 5.95312 6.70755 5.95312 6.9707V7.14258L6.12305 7.11914C6.24021 7.10297 6.36462 7.1008 6.48828 7.1123C7.16629 7.17522 7.69629 7.73087 7.69629 8.41699C7.69611 9.13942 7.11018 9.72461 6.3877 9.72461C5.98409 9.72452 5.59571 9.53926 5.35254 9.28125C4.95092 8.85494 4.73344 8.38061 4.7334 7.58789C4.7334 6.24081 5.65623 5.01145 7.04102 4.36719L7.25684 4.70117ZM11.4238 4.70117C10.0992 5.49858 10.1191 6.70754 10.1191 6.9707V7.14258L10.29 7.11914C10.407 7.10302 10.5308 7.10086 10.6543 7.1123H10.6553C11.3331 7.17535 11.8633 7.73097 11.8633 8.41699C11.8631 9.13941 11.2771 9.7246 10.5547 9.72461C10.1508 9.72461 9.76179 9.53949 9.51855 9.28125C9.11695 8.85493 8.90043 8.3806 8.90039 7.58789C8.90039 6.24098 9.82258 5.01152 11.207 4.36719L11.4238 4.70117Z" fill="#161616" stroke="white" strokeWidth="0.3"/>
                            </svg>
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

      {/* Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">2 Views</span>
                <MessageCircle className="w-4 h-4 ml-4" />
                <span className="text-sm">5 Comments</span>
                <div className="ml-4 px-2 py-1 bg-gray-200 rounded text-xs">13</div>
                <ExternalLink className="w-4 h-4 ml-4" />
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-4">5 Comments</h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`${
                      comment.avatar === 'AK' ? 'bg-orange-500' : 'bg-gray-800'
                    } text-white text-xs`}>
                      {comment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{comment.user}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
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
    </div>
  );
};

export default DataCenter;
