import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SignupStep2Props {
  formData: {
    institution: string;
    college: string;
    department: string;
    countryCity: string;
    postcode: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onCancel: () => void;
  skipInstitution?: boolean;
}

const SignupStep2: React.FC<SignupStep2Props> = ({ formData, onChange, onNext, onCancel, skipInstitution = false }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Tell us more about you<br />
          to help you finding collaborators
        </h2>
        <p className="text-lg text-muted-foreground">Institution Information</p>
      </div>

      <Progress value={66} className="w-full" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {!skipInstitution && (
          <>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution <span className="text-destructive">*</span></Label>
              <Input
                id="institution"
                type="text"
                value={formData.institution}
                onChange={(e) => onChange('institution', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College <span className="text-destructive">*</span></Label>
              <Input
                id="college"
                type="text"
                value={formData.college}
                onChange={(e) => onChange('college', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department <span className="text-destructive">*</span></Label>
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => onChange('department', e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="countryCity">Country and City <span className="text-destructive">*</span></Label>
          <Input
            id="countryCity"
            type="text"
            value={formData.countryCity}
            onChange={(e) => onChange('countryCity', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="postcode"
            type="text"
            value={formData.postcode}
            onChange={(e) => onChange('postcode', e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupStep2;