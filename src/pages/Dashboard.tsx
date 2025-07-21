
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
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
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const Dashboard = () => {
  const { user, profile, loading, getDisplayName, getInitials, getUserRole } = useProfile();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Custom Icons Start
  const CustomHomeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.25 6.4375V0.25H6.4375V6.4375H0.25ZM0.25 13.75V7.5625H6.4375V13.75H0.25ZM7.5625 6.4375V0.25H13.75V6.4375H7.5625ZM7.5625 13.75V7.5625H13.75V13.75H7.5625ZM1.375 5.3125H5.3125V1.375H1.375V5.3125ZM8.6875 5.3125H12.625V1.375H8.6875V5.3125ZM8.6875 12.625H12.625V8.6875H8.6875V12.625ZM1.375 12.625H5.3125V8.6875H1.375V12.625Z" fill="white"/>
    </svg>

  );

  // Custom Icons End 
  const home = [
    { icon: Users, label: 'Dashboard', active: true },
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
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100"
            onClick={() => {
              navigate('/settings');
            }}
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
                <AvatarImage src={profile.avatar_url} alt={getDisplayName()} />
              ) : null}
              <AvatarFallback className="bg-gray-800 text-white text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName()}
              </div>
              <div className="text-xs text-gray-500">{getUserRole()}</div>
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
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              👋 Good Morning, {getDisplayName()}!
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {/* <MessageSquare className="w-6 h-6 text-blue-600" /> */}
<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3693 18.9981C11.4565 18.9981 11.5566 18.9772 11.6699 18.9355C11.7832 18.8938 11.8746 18.8396 11.9443 18.7728L20.7523 10.3123C20.9788 10.0953 21.1487 9.84778 21.2619 9.56959C21.3752 9.29159 21.4318 9.01349 21.4318 8.73529C21.4318 8.45159 21.3752 8.16793 21.2619 7.88423C21.1487 7.60053 20.9788 7.35021 20.7523 7.13329L16.0477 2.62766C15.8212 2.41072 15.5599 2.24802 15.2636 2.13955C14.9674 2.03108 14.6712 1.97685 14.375 1.97685C14.0845 1.97685 13.7941 2.03108 13.5039 2.13955C13.2134 2.24802 12.9549 2.41072 12.7284 2.62766L12.258 3.07822L14.375 5.13079C14.6015 5.36443 14.8019 5.63557 14.9761 5.94431C15.1504 6.25304 15.2375 6.59096 15.2375 6.95807C15.2375 7.59222 14.9805 8.15121 14.4665 8.63517C13.9525 9.11912 13.3644 9.36108 12.7023 9.36108C12.2667 9.36108 11.9051 9.2985 11.6176 9.17334C11.3301 9.04818 11.0671 8.87011 10.8286 8.63917L8.9125 6.80789L4.18182 11.3385C4.0947 11.422 4.03371 11.5099 3.99886 11.6021C3.96401 11.6942 3.94659 11.793 3.94659 11.8985C3.94659 12.1093 4.02065 12.2856 4.16875 12.4274C4.31684 12.5692 4.50131 12.6402 4.72206 12.6402C4.83235 12.6402 4.93543 12.6151 5.03125 12.5651C5.12707 12.515 5.20987 12.4566 5.27955 12.3899L8.88636 8.93554L9.98409 9.98686L6.40341 13.4161C6.31627 13.4996 6.25532 13.5914 6.22045 13.6915C6.18559 13.7916 6.16818 13.8917 6.16818 13.9919C6.16818 14.1921 6.24659 14.3673 6.40341 14.5175C6.56023 14.6677 6.74318 14.7428 6.95227 14.7428C7.05682 14.7428 7.15702 14.7219 7.25284 14.6802C7.34866 14.6385 7.43146 14.5843 7.50114 14.5175L11.108 11.0632L12.2057 12.1145L8.625 15.5438C8.55532 15.6105 8.49866 15.6967 8.45511 15.8024C8.41157 15.9082 8.38977 16.0139 8.38977 16.1195C8.38977 16.3198 8.46818 16.495 8.625 16.6452C8.78182 16.7954 8.96477 16.8705 9.17386 16.8705C9.27841 16.8705 9.37422 16.8538 9.46136 16.8204C9.5485 16.787 9.63559 16.7286 9.72273 16.6452L13.3295 13.1909L14.4273 14.2422L10.8205 17.6965C10.7333 17.78 10.6724 17.8717 10.6375 17.9718C10.6026 18.072 10.5852 18.1637 10.5852 18.2472C10.5852 18.4808 10.6549 18.6644 10.7943 18.7979C10.9337 18.9314 11.1254 18.9981 11.3693 18.9981ZM11.3709 20.5C10.7948 20.5 10.2803 20.2956 9.82727 19.8867C9.37422 19.4779 9.10418 18.9721 9.01705 18.3693C8.42464 18.2879 7.92805 18.0553 7.52727 17.6715C7.1265 17.2876 6.88259 16.812 6.79545 16.2447C6.20305 16.1612 5.7108 15.9234 5.31875 15.5313C4.9267 15.1391 4.68714 14.6677 4.6 14.117C3.95531 14.0336 3.42386 13.7833 3.00568 13.3661C2.5875 12.9489 2.37841 12.4483 2.37841 11.8642C2.37841 11.5805 2.43695 11.2964 2.55405 11.0119C2.67131 10.7274 2.83928 10.4775 3.05795 10.2622L8.9125 4.65519L11.7875 7.40864C11.9269 7.54215 12.0779 7.64643 12.2404 7.72153C12.4032 7.79662 12.5658 7.83417 12.7284 7.83417C12.9549 7.83417 13.1684 7.7382 13.3687 7.54631C13.5691 7.35442 13.6693 7.14871 13.6693 6.92929C13.6693 6.83166 13.6388 6.72028 13.5778 6.59512C13.5168 6.46996 13.4167 6.34065 13.2773 6.20713L9.53977 2.62766C9.31328 2.41072 9.05191 2.24802 8.75568 2.13955C8.45945 2.03108 8.16327 1.97685 7.86705 1.97685C7.57657 1.97685 7.28619 2.03108 6.99592 2.13955C6.70544 2.24802 6.44747 2.40956 6.22202 2.62416L2.24773 6.43242C2.00379 6.66606 1.8339 6.91217 1.73807 7.17084C1.64224 7.42951 1.5856 7.72153 1.56818 8.04693C1.55076 8.37234 1.6161 8.68939 1.7642 8.99812C1.91231 9.30686 2.09091 9.58636 2.3 9.83667L1.17614 10.913C0.82765 10.5459 0.544509 10.1037 0.326705 9.58636C0.1089 9.06906 0 8.5434 0 8.00939C0 7.50876 0.100191 7.02901 0.300568 6.57009C0.500945 6.11116 0.784091 5.70651 1.15 5.35607L5.09659 1.57635C5.47991 1.20922 5.91372 0.938047 6.39792 0.762828C6.88233 0.587609 7.37892 0.5 7.88769 0.5C8.39667 0.5 8.8907 0.587609 9.36989 0.762828C9.84907 0.938047 10.2803 1.20922 10.6636 1.57635L11.1341 2.02691L11.6045 1.57635C11.9879 1.20922 12.4217 0.938047 12.9059 0.762828C13.3903 0.587609 13.8869 0.5 14.3956 0.5C14.9046 0.5 15.3987 0.587609 15.8778 0.762828C16.357 0.938047 16.7883 1.20922 17.1716 1.57635L21.85 6.05695C22.2333 6.42406 22.5208 6.84153 22.7125 7.30926C22.9042 7.7772 23 8.25279 23 8.73604C23 9.2195 22.9042 9.69064 22.7125 10.1496C22.5208 10.6085 22.2333 11.0215 21.85 11.3886L13.042 19.8242C12.8155 20.0411 12.5583 20.208 12.2702 20.3248C11.9822 20.4416 11.6824 20.5 11.3709 20.5Z" fill="#2567CE"/>
</svg>

                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Collaborations</div>
                  <div className="text-3xl font-bold">12</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  {/* <Users className="w-6 h-6 text-green-600" /> */}
<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.125 9.75C5.45749 9.75 4.80497 9.55206 4.24995 9.18121C3.69493 8.81036 3.26235 8.28326 3.00691 7.66656C2.75146 7.04986 2.68462 6.37126 2.81485 5.71657C2.94507 5.06189 3.26651 4.46052 3.73851 3.98852C4.21052 3.51651 4.81188 3.19508 5.46657 3.06485C6.12126 2.93463 6.79986 3.00146 7.41656 3.25691C8.03326 3.51235 8.56036 3.94494 8.93121 4.49995C9.30206 5.05497 9.5 5.70749 9.5 6.375C9.49901 7.2698 9.14311 8.12767 8.51039 8.76039C7.87767 9.39311 7.0198 9.74901 6.125 9.75ZM6.125 4.5C5.75416 4.5 5.39165 4.60997 5.08331 4.816C4.77496 5.02202 4.53464 5.31486 4.39273 5.65747C4.25081 6.00008 4.21368 6.37708 4.28603 6.7408C4.35837 7.10451 4.53695 7.4386 4.79917 7.70083C5.0614 7.96305 5.39549 8.14163 5.75921 8.21397C6.12292 8.28632 6.49992 8.24919 6.84253 8.10728C7.18514 7.96536 7.47798 7.72504 7.68401 7.4167C7.89003 7.10835 8 6.74584 8 6.375C8 5.87772 7.80246 5.40081 7.45083 5.04918C7.09919 4.69755 6.62228 4.5 6.125 4.5ZM11.75 15C11.7488 14.0058 11.3533 13.0527 10.6503 12.3497C9.94733 11.6467 8.9942 11.2512 8 11.25H4.25C3.2558 11.2512 2.30267 11.6467 1.59966 12.3497C0.896661 13.0527 0.501191 14.0058 0.5 15L0.5 18H2V15C2 14.4033 2.23705 13.831 2.65901 13.409C3.08097 12.9871 3.65326 12.75 4.25 12.75H8C8.59674 12.75 9.16903 12.9871 9.59099 13.409C10.0129 13.831 10.25 14.4033 10.25 15V18H11.75V15ZM13.625 6.75C12.9575 6.75 12.305 6.55206 11.75 6.18121C11.1949 5.81036 10.7624 5.28326 10.5069 4.66656C10.2515 4.04986 10.1846 3.37126 10.3148 2.71657C10.4451 2.06189 10.7665 1.46052 11.2385 0.988516C11.7105 0.516514 12.3119 0.195076 12.9666 0.0648512C13.6213 -0.0653739 14.2999 0.00146234 14.9166 0.256908C15.5333 0.512354 16.0604 0.944936 16.4312 1.49995C16.8021 2.05497 17 2.70749 17 3.375C16.999 4.2698 16.6431 5.12767 16.0104 5.76039C15.3777 6.39311 14.5198 6.74901 13.625 6.75ZM13.625 1.5C13.2542 1.5 12.8916 1.60997 12.5833 1.816C12.275 2.02202 12.0346 2.31486 11.8927 2.65747C11.7508 3.00008 11.7137 3.37708 11.786 3.7408C11.8584 4.10451 12.037 4.4386 12.2992 4.70083C12.5614 4.96305 12.8955 5.14163 13.2592 5.21397C13.6229 5.28632 13.9999 5.24919 14.3425 5.10728C14.6851 4.96536 14.978 4.72504 15.184 4.4167C15.39 4.10835 15.5 3.74584 15.5 3.375C15.5 2.87772 15.3025 2.40081 14.9508 2.04918C14.5992 1.69755 14.1223 1.5 13.625 1.5ZM18.5 12C18.4988 11.0058 18.1033 10.0527 17.4003 9.34967C16.6973 8.64666 15.7442 8.25119 14.75 8.25H11.75V9.75H14.75C15.3467 9.75 15.919 9.98705 16.341 10.409C16.7629 10.831 17 11.4033 17 12V15H18.5V12Z" fill="#2567CE"/>
</svg>

                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Collaborators</div>
                  <div className="text-3xl font-bold">16</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  {/* <Database className="w-6 h-6 text-purple-600" /> */}
<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.75 5.87501H14.25V3.16667H1.75V5.87501ZM1.75 17.3333C1.41667 17.3333 1.125 17.2083 0.875 16.9583C0.625 16.7083 0.5 16.4167 0.5 16.0833V3.16667C0.5 2.83334 0.625 2.54167 0.875 2.29167C1.125 2.04167 1.41667 1.91667 1.75 1.91667H3.10417V0.666672H4.45833V1.91667H11.5417V0.666672H12.8958V1.91667H14.25C14.5833 1.91667 14.875 2.04167 15.125 2.29167C15.375 2.54167 15.5 2.83334 15.5 3.16667V9.56251C15.3032 9.46126 15.1012 9.37696 14.8942 9.30959C14.687 9.24209 14.4722 9.18751 14.25 9.14584V7.12501H1.75V16.0833H8.39583C8.47917 16.3195 8.57637 16.5382 8.6875 16.7396C8.79862 16.941 8.93054 17.1389 9.08333 17.3333H1.75ZM13.2292 18.1667C12.1399 18.1667 11.2112 17.7828 10.4433 17.015C9.67554 16.2471 9.29167 15.3185 9.29167 14.2292C9.29167 13.1399 9.67554 12.2113 10.4433 11.4433C11.2112 10.6755 12.1399 10.2917 13.2292 10.2917C14.3185 10.2917 15.2471 10.6755 16.015 11.4433C16.7828 12.2113 17.1667 13.1399 17.1667 14.2292C17.1667 15.3185 16.7828 16.2471 16.015 17.015C15.2471 17.7828 14.3185 18.1667 13.2292 18.1667ZM14.4425 16.3333L15.0208 15.75L13.4583 14.1875V11.8542H12.6458V14.4792L14.4425 16.3333Z" fill="#2567CE"/>
</svg>

                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Collaboration Days</div>
                  <div className="text-3xl font-bold">322</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  {/* <MessageSquare className="w-6 h-6 text-orange-600" /> */}
<svg width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5858 2.44833C19.0225 2.16667 18.3583 2.22583 17.855 2.605C17.8225 2.62917 17.7917 2.65667 17.7633 2.685L16.2992 4.1625C16.1233 2.025 14.3483 0.334168 12.1667 0.334168H4.66667C2.36917 0.333334 0.5 2.2025 0.5 4.5V9.5C0.5 11.7975 2.36917 13.6667 4.66667 13.6667H12.1667C14.3575 13.6667 16.14 11.9608 16.3017 9.81083L17.765 11.2725C17.7933 11.3 17.8225 11.325 17.8542 11.3492C18.1475 11.5692 18.4942 11.6808 18.8442 11.6808C19.0967 11.6808 19.3492 11.6233 19.5858 11.505C20.15 11.2233 20.5 10.6558 20.5 10.0267V3.92833C20.5 3.2975 20.15 2.73 19.5858 2.44833ZM12.1667 12H4.66667C3.28833 12 2.16667 10.8783 2.16667 9.5V4.5C2.16667 3.12167 3.28833 2 4.66667 2H12.1667C13.545 2 14.6667 3.12167 14.6667 4.5V9.5C14.6667 10.8783 13.545 12 12.1667 12ZM16.3333 7.48583V6.495L18.8333 3.97167L18.8542 10.0033L16.3333 7.485V7.48583Z" fill="#2567CE"/>
</svg>

                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Meetings</div>
                  <div className="text-3xl font-bold">322</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-end mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Search Collaborators
            </Button>
          </div>

          <h3 className="text-lg font-semibold mb-4">My Collaboration</h3>

          {/* Main Content Area */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}

          {/* My Collaboration */}
          <div className='border-2 rounded-lg bg-white'>
            <div className="grid grid-cols-6 gap-4 lg:col-span-2">
              <div className='col-span-2'>
                {/* <Card> */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">Collaboration Status</div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          In Progress
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                      <span>From 2025-06-04</span>
                      <span>To 2025-06-25</span>
                    </div>

                    {/* Calendar */}
                    <div className="mb-4 ">
                      {/* <div className="flex items-center justify-between mb-4">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-medium">2024 June</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div> */}
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                      />
                    </div>

                    <div>
                      <Button variant="outline">See Collaboration</Button>
                    </div>
                  </div>
                {/* </Card> */}
              </div> 


              {/* Collaborators */}
              <div>
                {/* <Card> */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">2 Collaborators</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          {/* <AvatarFallback className="bg-gray-800 text-white">BM</AvatarFallback> */}
                          <img 
                            src="/lovable-uploads/avatar1.jpg" 
                           
                            className="max-w-full h-auto rounded-lg shadow-lg"
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">Bashair Mussa (me)</div>
                          <div className="text-sm text-gray-500">Researcher Role</div>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">Idea</Badge>
                            <Badge variant="outline" className="text-xs">Proposal</Badge>
                            <Badge variant="outline" className="text-xs">Grant Application</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          {/* <AvatarFallback className="bg-gray-800 text-white">BM</AvatarFallback> */}
                          <img 
                            src="/lovable-uploads/avatar2.jpg" 
                             
                            className="max-w-full h-auto rounded-lg shadow-lg"
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">Anna Krylova</div>
                          <div className="text-sm text-gray-500">Researcher Role</div>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">Equipment</Badge>
                            <Badge variant="outline" className="text-xs">Experiment</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* </Card> */}
              </div>
              
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
