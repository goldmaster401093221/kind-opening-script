
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Home, 
  Users, 
  Bookmark, 
  MessageSquare, 
  Database, 
  Ship, 
  FileText, 
  Wrench, 
  Settings as SettingsIcon,
  MoreHorizontal,
  X,
  Plus
} from 'lucide-react';

interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  user_id_number?: string;
  phone?: string;
  title?: string;
  linkedin_url?: string;
  researchgate_url?: string;
  google_scholar_url?: string;
  institution?: string;
  college?: string;
  department?: string;
  zip_code?: string;
  country?: string;
  state_city?: string;
  experience?: string;
  primary_research_area?: string;
  secondary_research_area?: string;
  keywords?: string[];
  research_roles?: string[];
  avatar_url?: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile: globalProfile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProfileData>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        // Map specialization_keywords to keywords for UI consistency
        const profileData = {
          ...data,
          keywords: data.specialization_keywords || []
        };
        setProfile(profileData);
        reset(profileData);
      } else {
        // Create initial profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            email: user.email,
            specialization_keywords: [],
            research_roles: []
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          // Map specialization_keywords to keywords for UI consistency
          const profileData = {
            ...newProfile,
            keywords: newProfile.specialization_keywords || []
          };
          setProfile(profileData);
          reset(profileData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Map keywords to specialization_keywords for database
      const updateData = {
        ...data,
        specialization_keywords: data.keywords
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setProfile({ ...profile, ...data });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = async () => {
    if (newKeyword.trim() && profile) {
      const keywords = [...(profile.keywords || []), newKeyword.trim()];
      setValue('keywords', keywords);
      setProfile({ ...profile, keywords });
      
      // Update specialization_keywords in database
      await supabase
        .from('profiles')
        .update({ specialization_keywords: keywords })
        .eq('id', user?.id);
      setNewKeyword('');
    }
  };

  const removeKeyword = async (index: number) => {
    if (profile) {
      const keywords = profile.keywords?.filter((_, i) => i !== index) || [];
      setValue('keywords', keywords);
      setProfile({ ...profile, keywords });
      
      // Update specialization_keywords in database
      await supabase
        .from('profiles')
        .update({ specialization_keywords: keywords })
        .eq('id', user?.id);
    }
  };

  const addRole = () => {
    if (newRole.trim() && profile) {
      const research_roles = [...(profile.research_roles || []), newRole.trim()];
      setValue('research_roles', research_roles);
      setProfile({ ...profile, research_roles });
      setNewRole('');
    }
  };

  const removeRole = (index: number) => {
    if (profile) {
      const research_roles = profile.research_roles?.filter((_, i) => i !== index) || [];
      setValue('research_roles', research_roles);
      setProfile({ ...profile, research_roles });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Convert image to base64 and store directly in database
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: base64String })
            .eq('id', user.id);

          if (updateError) {
            throw updateError;
          }

          setProfile({ ...profile, avatar_url: base64String });
          setValue('avatar_url', base64String);

          toast({
            title: "Success",
            description: "Avatar updated successfully",
          });
        } catch (error) {
          console.error('Error updating avatar:', error);
          toast({
            title: "Error",
            description: "Failed to upload avatar. Please try again.",
            variant: "destructive",
          });
        } finally {
          setUploadingAvatar(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
        setUploadingAvatar(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
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
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer bg-blue-600 text-white">
            <SettingsIcon className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              {globalProfile?.avatar_url ? (
                <AvatarImage src={globalProfile.avatar_url} alt="Profile avatar" />
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
              <div className="text-xs text-gray-500">{globalProfile?.email}</div>
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
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <Button type="submit" disabled={saving} size="sm">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={handleAvatarClick}
                  >
                    <Avatar className="w-24 h-24">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt="Profile avatar" />
                      ) : (
                        <AvatarFallback className="bg-gray-800 text-white text-2xl">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">
                        {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                      </span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click to upload avatar<br />
                    Max 5MB, JPG/PNG
                  </p>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input {...register('first_name')} placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input {...register('last_name')} placeholder="Last name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select {...register('gender')} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <Input {...register('user_id_number')} placeholder="ID number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input {...register('phone')} placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <select {...register('title')} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select title</option>
                      <option value="dr">Dr.</option>
                      <option value="prof">Prof.</option>
                      <option value="mr">Mr.</option>
                      <option value="mrs">Mrs.</option>
                      <option value="ms">Ms.</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <Input {...register('linkedin_url')} placeholder="LinkedIn profile URL" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ResearchGate</label>
                      <Input {...register('researchgate_url')} placeholder="ResearchGate profile URL" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
                      <Input {...register('google_scholar_url')} placeholder="Google Scholar profile URL" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Institution Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Institution Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <Input {...register('institution')} placeholder="Institution name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <Input {...register('college')} placeholder="College name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <Input {...register('department')} placeholder="Department name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <Input {...register('zip_code')} placeholder="Zip code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Input {...register('country')} placeholder="Country" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/City</label>
                  <Input {...register('state_city')} placeholder="State/City" />
                </div>
              </div>
            </div>

            {/* Research Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Research Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <Input {...register('experience')} placeholder="Years of experience" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary research area</label>
                  <Input {...register('primary_research_area')} placeholder="Primary research area" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary research area</label>
                  <Input {...register('secondary_research_area')} placeholder="Secondary research area" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile?.keywords?.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Research Role</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile?.research_roles?.map((role, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Add research role"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                    />
                    <Button type="button" onClick={addRole} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
