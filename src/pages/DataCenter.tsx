
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  ChevronRight
} from 'lucide-react';

const DataCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSort, setSelectedSort] = useState('Relevant');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
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
            {sidebarItems.map((item, index) => (
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
                className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
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
                <thead className="bg-gray-50 border-b border-gray-200">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{file.format}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={`${
                              file.uploaderAvatar === 'AK' ? 'bg-orange-500' : 'bg-gray-800'
                            } text-white text-xs`}>
                              {file.uploaderAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-gray-900">{file.uploader}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{file.uploadedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{file.views} Views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{file.comments} Comments</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default DataCenter;
