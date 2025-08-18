import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useChat } from '@/hooks/useChat';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { CallNotification } from '@/components/CallNotification';
import { VideoCallInterface } from '@/components/VideoCallInterface';
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
  Send,
  Phone,
  MoreVertical,
  Mic,
  Video,
  PhoneOff,
  MicOff,
  Expand,
  Monitor,
  MicIcon,
  Minimize2
} from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, loading: profileLoading, getDisplayName, getInitials } = useProfile();
  const { 
    conversations, 
    messages, 
    activeConversation, 
    loading: chatLoading,
    setActiveConversation,
    getOrCreateConversation,
    sendMessage: sendChatMessage
  } = useChat();
  const { isUserOnline } = useOnlineStatus();
  const {
    localVideoRef,
    remoteVideoRef,
    isCallActive,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    incomingCall,
    outgoingCall,
    activeCall,
    startCall,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare
  } = useWebRTC();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('In Progress');
  const [showExpandedCalling, setShowExpandedCalling] = useState(false);

  // Handle chat with specific user from URL params
  useEffect(() => {
    const chatWithUserId = searchParams.get('with');
    if (chatWithUserId && user?.id) {
      getOrCreateConversation(chatWithUserId).then((conversationId) => {
        if (conversationId) {
          setActiveConversation(conversationId);
        }
      });
    }
  }, [searchParams, user?.id, getOrCreateConversation, setActiveConversation]);

  const handleSignOut = async () => {
    // Mark user as offline before signing out
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            is_online: false,
            last_seen: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error marking user as offline:', error);
      }
    }
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handlePhoneClick = () => {
    if (currentChatPartner?.id) {
      startCall(currentChatPartner.id);
    }
  };

  const handleAnswerCall = () => {
    if (incomingCall) {
      answerCall(incomingCall.id, incomingCall.offer);
    }
  };

  const handleDeclineCall = () => {
    if (incomingCall) {
      declineCall(incomingCall.id);
    }
  };

  const handleEndCall = () => {
    endCall();
    setShowExpandedCalling(false);
  };

  const handleExpandCall = () => {
    console.log('Expanding call, current state:', { 
      showExpandedCalling, 
      isCallActive, 
      activeCall: !!activeCall,
      outgoingCall: !!outgoingCall 
    });
    setShowExpandedCalling(true);
    console.log('After setting showExpandedCalling to true');
  };

  const handleMinimizeCall = () => {
    console.log('Minimizing call, current state:', { 
      showExpandedCalling, 
      isCallActive, 
      activeCall: !!activeCall,
      outgoingCall: !!outgoingCall 
    });
    setShowExpandedCalling(false);
    console.log('After setting showExpandedCalling to false');
  };

  const home = [
    { icon: Users, label: 'Dashboard', active: false },
    { icon: Users, label: 'Discover Collaborators', active: false },
    { icon: Bookmark, label: 'Saved Collaborators', active: false },
  ];

  const collaborationItems = [
    { icon: MessageSquare, label: 'Collaboration', active: false },
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: Database, label: 'Data Center', active: false },
  ];

  const supportingServices = [
    { icon: Ship, label: 'Shipment', active: false },
    { icon: FileText, label: 'Quotation', active: false },
    { icon: Wrench, label: 'Equipment', active: false },
  ];

  const handleSendMessage = async () => {
    if (message.trim() && activeConversation) {
      await sendChatMessage(message);
      setMessage('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDisplayNameFromProfile = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Unknown User';
  };

  const getInitialsFromProfile = (profile: any) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return 'UN';
  };

  // Get active conversation details
  const activeConversationData = conversations.find(conv => conv.id === activeConversation);
  const currentChatPartner = activeConversationData?.other_participant;

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log('State changed:', {
      showExpandedCalling,
      isCallActive,
      hasActiveCall: !!activeCall,
      hasOutgoingCall: !!outgoingCall,
      shouldShowMinimized: (isCallActive || outgoingCall || activeCall) && !showExpandedCalling,
      shouldShowExpanded: showExpandedCalling && (isCallActive || outgoingCall || activeCall)
    });
  }, [showExpandedCalling, isCallActive, activeCall, outgoingCall]);

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
            <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Conversations */}
          <div className="w-100 bg-white border-r border-gray-200 flex flex-col">
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-2 py-2">
              <div className="flex bg-gray-200 rounded-lg py-2 px-2">
                {['In Progress', 'Upcoming', 'Requests', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 text-blue-600 bg-white rounded-lg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <Input
                placeholder="Search"
                className="w-full"
              />
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    activeConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      {conversation.other_participant?.avatar_url ? (
                        <AvatarImage 
                          src={conversation.other_participant.avatar_url} 
                          alt={getDisplayNameFromProfile(conversation.other_participant)}
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-800 text-white">
                          {getInitialsFromProfile(conversation.other_participant)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {/* Online indicator */}
                    {conversation.other_participant?.id && isUserOnline(conversation.other_participant.id) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">
                        {getDisplayNameFromProfile(conversation.other_participant)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(conversation.last_message_at)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 truncate">
                        {conversation.last_message || 'No messages yet'}
                      </div>
                      {(conversation.unread_count ?? 0) > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Call Interface - Show when call is active or there's an active call */}
            {(isCallActive || outgoingCall || activeCall) && (
              <div className="p-4">
                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-2">
                  Debug: showExpandedCalling={showExpandedCalling.toString()}, 
                  isCallActive={isCallActive.toString()}, 
                  hasActiveCall={!!activeCall},
                  hasOutgoingCall={!!outgoingCall}
                </div>
                {!showExpandedCalling && (
                  <VideoCallInterface
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                    isMuted={isMuted}
                    isVideoEnabled={isVideoEnabled}
                    isScreenSharing={isScreenSharing}
                    isExpanded={false}
                    remoteUserName={
                      activeCall?.caller_profile 
                        ? getDisplayNameFromProfile(activeCall.caller_profile)
                        : currentChatPartner 
                          ? getDisplayNameFromProfile(currentChatPartner)
                          : 'Unknown User'
                    }
                    remoteUserAvatar={
                      activeCall?.caller_profile?.avatar_url || currentChatPartner?.avatar_url
                    }
                    onToggleMute={toggleMute}
                    onToggleVideo={toggleVideo}
                    onToggleScreenShare={toggleScreenShare}
                    onEndCall={handleEndCall}
                    onToggleExpand={handleExpandCall}
                  />
                )}
                {/* Fallback message if neither view is showing */}
                {showExpandedCalling && (
                  <div className="text-xs text-red-500">
                    Expanded view should be showing above
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Chat Messages */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {currentChatPartner ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        {currentChatPartner.avatar_url ? (
                          <AvatarImage 
                            src={currentChatPartner.avatar_url} 
                            alt={getDisplayNameFromProfile(currentChatPartner)}
                          />
                        ) : (
                          <AvatarFallback className="bg-gray-800 text-white">
                            {getInitialsFromProfile(currentChatPartner)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {/* Online indicator in chat header */}
                      {currentChatPartner?.id && isUserOnline(currentChatPartner.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{getDisplayNameFromProfile(currentChatPartner)}</div>
                      <div className="text-sm text-gray-500">
                        {currentChatPartner?.id && isUserOnline(currentChatPartner.id) ? (
                          <span className="text-green-600 font-medium">Online</span>
                        ) : (
                          "Click to start chatting"
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">Select a conversation</div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePhoneClick}
                    disabled={!currentChatPartner}
                    className={!currentChatPartner ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeConversation ? (
                messages.length > 0 ? (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm">{msg.content}</div>
                          <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {activeConversation && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Video Call Interface */}
      {showExpandedCalling && (isCallActive || outgoingCall || activeCall) && (
        <>
          {/* Debug info */}
          <div className="fixed top-0 left-0 z-50 bg-red-500 text-white p-2 text-xs">
            Debug: showExpandedCalling={showExpandedCalling.toString()}, 
            isCallActive={isCallActive.toString()}, 
            hasActiveCall={!!activeCall}
          </div>
          <VideoCallInterface
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isExpanded={true}
            remoteUserName={
              activeCall?.caller_profile 
                ? getDisplayNameFromProfile(activeCall.caller_profile)
                : currentChatPartner 
                  ? getDisplayNameFromProfile(currentChatPartner)
                  : 'Unknown User'
            }
            remoteUserAvatar={
              activeCall?.caller_profile?.avatar_url || currentChatPartner?.avatar_url
            }
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onEndCall={handleEndCall}
            onToggleExpand={handleMinimizeCall}
          />
        </>
      )}

      {/* Incoming Call Notification */}
      {incomingCall && (
        <CallNotification
          call={incomingCall}
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
        />
      )}
    </div>
  );
};

export default Chat;
