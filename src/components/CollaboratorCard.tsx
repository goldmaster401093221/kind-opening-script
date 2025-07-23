import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Copy, Eye, Star } from 'lucide-react';
import { CollaboratorProfile } from '@/hooks/useCollaborators';

interface CollaboratorCardProps {
  collaborator: CollaboratorProfile;
  displayName: string;
  initials: string;
  userRole: string;
  onViewProfile: (collaborator: CollaboratorProfile) => void;
  onToggleHeart: (collaboratorId: string) => void;
  onContact?: (collaboratorId: string) => void;
  isSaved?: boolean;
  isContacted?: boolean;
  hasCollaborated?: boolean;
  showHeartOnly?: boolean;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({
  collaborator,
  displayName,
  initials,
  userRole,
  onViewProfile,
  onToggleHeart,
  onContact,
  isSaved = false,
  isContacted = false,
  hasCollaborated = false,
  showHeartOnly = false,
}) => {
  const formatRating = (rating: number | null) => {
    if (!rating) return '0.0/5';
    return `${rating.toFixed(1)}/5`;
  };

  const getStatusBadge = () => {
    if (hasCollaborated) {
      return <Badge className="bg-green-100 text-green-800">Collaborated</Badge>;
    }
    if (isContacted) {
      return <Badge className="bg-blue-100 text-blue-800">Contacted</Badge>;
    }
    if (isSaved) {
      return <Badge className="bg-yellow-100 text-yellow-800">Saved</Badge>;
    }
    return null;
  };

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="w-14 h-14 flex-shrink-0">
        {collaborator.avatar_url ? (
          <AvatarImage src={collaborator.avatar_url} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <div className="font-medium text-gray-900 truncate">{displayName}</div>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-gray-600">{userRole}</div>
        <div className="text-xs text-gray-500">
          {collaborator.institution && (
            <span>{collaborator.institution}</span>
          )}
          {collaborator.institution && collaborator.state_city && <span> • </span>}
          {collaborator.state_city && <span>{collaborator.state_city}</span>}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorCard;