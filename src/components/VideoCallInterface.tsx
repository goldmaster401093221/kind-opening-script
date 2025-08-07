import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface VideoCallInterfaceProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isExpanded: boolean;
  remoteUserName?: string;
  remoteUserAvatar?: string;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  onToggleExpand: () => void;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  localVideoRef,
  remoteVideoRef,
  isMuted,
  isVideoEnabled,
  isScreenSharing,
  isExpanded,
  remoteUserName = 'Unknown User',
  remoteUserAvatar,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  onToggleExpand
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              {remoteUserAvatar ? (
                <AvatarImage src={remoteUserAvatar} alt={remoteUserName} />
              ) : (
                <AvatarFallback className="bg-gray-600 text-white text-sm">
                  {getInitials(remoteUserName)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium">{remoteUserName}</span>
          </div>
          <Button
            onClick={onToggleExpand}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video - Picture in Picture */}
          {isVideoEnabled && (
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 p-6 bg-black bg-opacity-50">
          <Button
            onClick={onToggleMute}
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            onClick={onToggleVideo}
            variant={!isVideoEnabled ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={onToggleScreenShare}
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            <Monitor className="w-6 h-6" />
          </Button>

          <Button
            onClick={onEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Minimized view
  return (
    <div className="bg-gray-100 rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-medium text-gray-800">
          Video call with {remoteUserName}
        </div>
        <Button 
          onClick={onToggleExpand}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Video Preview */}
      <div className="relative mb-6 bg-gray-900 rounded-lg overflow-hidden h-40">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video - Small overlay */}
        {isVideoEnabled && (
          <div className="absolute top-2 right-2 w-16 h-12 bg-gray-800 rounded overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={onToggleMute}
          variant={isMuted ? "destructive" : "secondary"}
          size="sm"
          className="rounded-xl p-3 w-12 h-12"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        
        <Button
          onClick={onToggleVideo}
          variant={!isVideoEnabled ? "destructive" : "secondary"}
          size="sm"
          className="rounded-xl p-3 w-12 h-12"
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        <Button
          onClick={onToggleScreenShare}
          variant={isScreenSharing ? "default" : "secondary"}
          size="sm"
          className="rounded-xl p-3 w-12 h-12"
        >
          <Monitor className="w-5 h-5" />
        </Button>

        <Button
          onClick={onEndCall}
          variant="destructive"
          size="sm"
          className="rounded-xl p-3 w-12 h-12"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};