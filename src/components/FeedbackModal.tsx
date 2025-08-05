import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: {
    skillsRating: number;
    communicationRating: number;
    platformFeedback: string;
  }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [skillsRating, setSkillsRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [platformFeedback, setPlatformFeedback] = useState('');

  const handleSubmit = () => {
    onSubmit({
      skillsRating,
      communicationRating,
      platformFeedback
    });
    // Reset form
    setSkillsRating(5);
    setCommunicationRating(5);
    setPlatformFeedback('');
  };

  const renderStarRating = (rating: number, setRating: (rating: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="transition-colors"
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating 
                ? 'fill-blue-500 text-blue-500' 
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Leave a Feedback</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">Leave a feedback to collaborator</p>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Skills Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Skills</label>
              {renderStarRating(skillsRating, setSkillsRating)}
            </div>
          </div>

          {/* Communication Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Communication</label>
              {renderStarRating(communicationRating, setCommunicationRating)}
            </div>
          </div>

          {/* Platform Feedback */}
          <div>
            <Textarea
              placeholder="Leave a feedback to platform (Optional)"
              value={platformFeedback}
              onChange={(e) => setPlatformFeedback(e.target.value)}
              maxLength={300}
              className="min-h-[120px] resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {platformFeedback.length}/300
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Yes, End Collaboration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};