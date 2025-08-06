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
  Minimize2,
  Circle,
  Hand,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  Eye,
  EyeOff
} from 'lucide-react';

interface VideoCallInterfaceProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isExpanded: boolean;
  connectionStatus?: 'connecting' | 'connected' | 'disconnected' | null;
  remoteUserName?: string;
  remoteUserAvatar?: string;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  onToggleExpand: () => void;
  // New props for enhanced meeting features
  isRecording?: boolean;
  isHandRaised?: boolean;
  isBackgroundBlurred?: boolean;
  callQuality?: 'good' | 'poor' | 'excellent';
  callDuration?: number;
  onToggleRecording?: () => void;
  onToggleHandRaise?: () => void;
  onToggleBackgroundBlur?: () => void;
  onOpenChat?: () => void;
  onOpenParticipants?: () => void;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  localVideoRef,
  remoteVideoRef,
  isMuted,
  isVideoEnabled,
  isScreenSharing,
  isExpanded,
  connectionStatus,
  remoteUserName = 'Unknown User',
  remoteUserAvatar,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  onToggleExpand,
  // New props
  isRecording = false,
  isHandRaised = false,
  isBackgroundBlurred = false,
  callQuality = 'good',
  callDuration = 0,
  onToggleRecording,
  onToggleHandRaise,
  onToggleBackgroundBlur,
  onOpenChat,
  onOpenParticipants
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityIcon = () => {
    switch (callQuality) {
      case 'excellent':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'good':
        return <Wifi className="w-4 h-4 text-yellow-400" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
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
            <div>
              <span className="font-medium">{remoteUserName}</span>
              {connectionStatus && (
                <div className="text-xs">
                  {connectionStatus === 'connecting' && (
                    <span className="text-yellow-400">🔄 Connecting...</span>
                  )}
                  {connectionStatus === 'connected' && (
                    <span className="text-green-400">✅ Connected</span>
                  )}
                  {connectionStatus === 'disconnected' && (
                    <span className="text-red-400">❌ Disconnected</span>
                  )}
                </div>
              )}
            </div>
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
            onLoadedMetadata={() => console.log('🎥 Remote video loaded metadata')}
            onCanPlay={() => console.log('🎥 Remote video can play')}
            onError={(e) => console.error('❌ Remote video error:', e)}
          />
          
          {/* Fallback for remote video */}
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">📹</div>
                <div className="text-sm">Waiting for remote video...</div>
                <div className="text-xs text-gray-400 mt-1">Connection: {connectionStatus}</div>
              </div>
            </div>
          )}
          
          {/* Local Video - Picture in Picture */}
          {isVideoEnabled && (
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => console.log('🎥 Local video loaded metadata')}
                onCanPlay={() => console.log('🎥 Local video can play')}
                onError={(e) => console.error('❌ Local video error:', e)}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 p-6 bg-black bg-opacity-50">
          {/* Primary Controls */}
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

          {/* Secondary Controls */}
          {onToggleRecording && (
            <Button
              onClick={onToggleRecording}
              variant={isRecording ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14 p-0"
            >
              <Circle className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
          )}

          {onToggleHandRaise && (
            <Button
              onClick={onToggleHandRaise}
              variant={isHandRaised ? "default" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14 p-0"
            >
              <Hand className="w-6 h-6" />
            </Button>
          )}

          {onToggleBackgroundBlur && (
            <Button
              onClick={onToggleBackgroundBlur}
              variant={isBackgroundBlurred ? "default" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14 p-0"
            >
              {isBackgroundBlurred ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </Button>
          )}

          {/* End Call Button */}
          <Button
            onClick={onEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 p-0"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          {/* Debug Button - Temporary */}
          <Button
            onClick={() => {
              console.log('🔍 Debug Video State:');
              console.log('Local Video Ref:', localVideoRef.current);
              console.log('Remote Video Ref:', remoteVideoRef.current);
              console.log('Local Video srcObject:', localVideoRef.current?.srcObject);
              console.log('Remote Video srcObject:', remoteVideoRef.current?.srcObject);
              console.log('Local Video readyState:', localVideoRef.current?.readyState);
              console.log('Remote Video readyState:', remoteVideoRef.current?.readyState);
            }}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 text-xs"
          >
            🔍
          </Button>
        </div>

        {/* Additional Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-black bg-opacity-30">
          <div className="flex items-center space-x-4">
            {/* Call Duration */}
            <div className="text-white text-sm font-mono">
              {formatDuration(callDuration)}
            </div>

            {/* Call Quality */}
            <div className="flex items-center space-x-2">
              {getQualityIcon()}
              <span className="text-white text-xs capitalize">{callQuality}</span>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="flex items-center space-x-2">
                <Circle className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-red-500 text-xs">REC</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Chat Button */}
            {onOpenChat && (
              <Button
                onClick={onOpenChat}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}

            {/* Participants Button */}
            {onOpenParticipants && (
              <Button
                onClick={onOpenParticipants}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Users className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimized view
  return (
    <div className="bg-gray-100 rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            {remoteUserAvatar ? (
              <AvatarImage src={remoteUserAvatar} alt={remoteUserName} />
            ) : (
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {getInitials(remoteUserName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <span className="text-sm font-medium">{remoteUserName}</span>
            {connectionStatus && (
              <div className="text-xs">
                {connectionStatus === 'connecting' && (
                  <span className="text-yellow-400">🔄 Connecting...</span>
                )}
                {connectionStatus === 'connected' && (
                  <span className="text-green-400">✅ Connected</span>
                )}
                {connectionStatus === 'disconnected' && (
                  <span className="text-red-400">❌ Disconnected</span>
                )}
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={onToggleExpand}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Maximize2 className="w-4 h-4" />
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
          onLoadedMetadata={() => console.log('🎥 Remote video loaded metadata')}
          onCanPlay={() => console.log('🎥 Remote video can play')}
          onError={(e) => console.error('❌ Remote video error:', e)}
        />
        
        {/* Fallback for remote video */}
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <div className="text-sm">Waiting for remote video...</div>
              <div className="text-xs text-gray-400 mt-1">Connection: {connectionStatus}</div>
            </div>
          </div>
        )}
        
        {/* Local Video - Small overlay */}
        {isVideoEnabled && (
          <div className="absolute top-2 right-2 w-16 h-12 bg-gray-800 rounded overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => console.log('🎥 Local video loaded metadata')}
              onCanPlay={() => console.log('🎥 Local video can play')}
              onError={(e) => console.error('❌ Local video error:', e)}
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

        {/* Additional controls for minimized view */}
        {onToggleRecording && (
          <Button
            onClick={onToggleRecording}
            variant={isRecording ? "destructive" : "secondary"}
            size="sm"
            className="rounded-xl p-3 w-12 h-12"
          >
            <Circle className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
        )}

        <Button
          onClick={onEndCall}
          variant="destructive"
          size="sm"
          className="rounded-xl p-3 w-12 h-12"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span className="font-mono">{formatDuration(callDuration)}</span>
          <div className="flex items-center space-x-1">
            {getQualityIcon()}
            <span className="capitalize">{callQuality}</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-1 text-red-500">
              <Circle className="w-3 h-3 animate-pulse" />
              <span>REC</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};