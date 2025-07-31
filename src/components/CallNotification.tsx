import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff } from 'lucide-react';
import { CallData } from '@/hooks/useWebRTC';

interface CallNotificationProps {
  call: CallData;
  onAnswer: () => void;
  onDecline: () => void;
}

export const CallNotification: React.FC<CallNotificationProps> = ({
  call,
  onAnswer,
  onDecline
}) => {
  const getDisplayName = () => {
    if (call.caller_profile?.first_name && call.caller_profile?.last_name) {
      return `${call.caller_profile.first_name} ${call.caller_profile.last_name}`;
    }
    return 'Unknown User';
  };

  const getInitials = () => {
    if (call.caller_profile?.first_name && call.caller_profile?.last_name) {
      return `${call.caller_profile.first_name[0]}${call.caller_profile.last_name[0]}`.toUpperCase();
    }
    return 'UN';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            {call.caller_profile?.avatar_url ? (
              <AvatarImage 
                src={call.caller_profile.avatar_url} 
                alt={getDisplayName()}
              />
            ) : (
              <AvatarFallback className="bg-gray-800 text-white text-2xl">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {getDisplayName()}
          </h3>
          <p className="text-gray-600">Incoming video call...</p>
        </div>
        
        <div className="flex justify-center space-x-6">
          <Button
            onClick={onDecline}
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16 p-0"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={onAnswer}
            className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 p-0"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};