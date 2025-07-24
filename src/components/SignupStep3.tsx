import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SignupStep3Props {
  formData: {
    experienceYears: string;
    primaryResearchArea: string;
    secondaryResearchArea: string;
    keywords: string[];
    researchRoles: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
  onFinish: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const SignupStep3: React.FC<SignupStep3Props> = ({ formData, onChange, onFinish, onCancel, loading }) => {
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const keywordOptions = ['Keyword1', 'Keyword2', 'Keyword3'];
  const roleOptions = ['Role1', 'Role2', 'Researcher', 'Technical expertise'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !formData.keywords.includes(keyword)) {
      onChange('keywords', [...formData.keywords, keyword]);
    }
    setSelectedKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    onChange('keywords', formData.keywords.filter(k => k !== keyword));
  };

  const addRole = (role: string) => {
    if (role && !formData.researchRoles.includes(role)) {
      onChange('researchRoles', [...formData.researchRoles, role]);
    }
    setSelectedRole('');
  };

  const removeRole = (role: string) => {
    onChange('researchRoles', formData.researchRoles.filter(r => r !== role));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Tell us more about you<br />
          to help you finding collaborators
        </h2>
        <p className="text-lg text-muted-foreground">Research Interest</p>
      </div>

      <Progress value={100} className="w-full" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Research Experience in Years</Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => onChange('experienceYears', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryResearchArea">Primary Research Area</Label>
          <Input
            id="primaryResearchArea"
            type="text"
            value={formData.primaryResearchArea}
            onChange={(e) => onChange('primaryResearchArea', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryResearchArea">Secondary Research Area</Label>
          <Input
            id="secondaryResearchArea"
            type="text"
            value={formData.secondaryResearchArea}
            onChange={(e) => onChange('secondaryResearchArea', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Specialization/Keywords</Label>
          <Select value={selectedKeyword} onValueChange={(value) => {
            setSelectedKeyword(value);
            addKeyword(value);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select keywords" />
            </SelectTrigger>
            <SelectContent>
              {keywordOptions.map((keyword) => (
                <SelectItem key={keyword} value={keyword}>
                  {keyword}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => removeKeyword(keyword)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Describe Your Research Role</Label>
          <Select value={selectedRole} onValueChange={(value) => {
            setSelectedRole(value);
            addRole(value);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select research roles" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.researchRoles.map((role) => (
              <Badge key={role} variant="secondary" className="flex items-center gap-1">
                {role}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => removeRole(role)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Creating Account...' : 'Finish'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignupStep3;