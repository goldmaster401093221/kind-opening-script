import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

interface SignupStep1Props {
  formData: {
    firstName: string;
    lastName: string;
    gender: string;
    highestDegree: string;
    email: string;
    password: string;
    orcidNumber: string;
    linkedinUrl: string;
    phone: string;
    researchgateUrl: string;
    googleScholarUrl: string;
    careerDescription: string;
    isIndependentResearcher: boolean;
    isRetiredResearcher: boolean;
    researchStatus: string;
  };
  onChange: (field: string, value: string | boolean) => void;
  onNext: () => void;
}

const SignupStep1: React.FC<SignupStep1Props> = ({ formData, onChange, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  
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
        <p className="text-lg text-muted-foreground">Personal Information</p>
      </div>

      <Progress value={33} className="w-full" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Research Status Radio Buttons */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <Label className="text-base font-medium">Research Status</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="independentRetiredResearcher"
                name="researchStatus"
                value="independent_retired"
                checked={formData.isIndependentResearcher || formData.isRetiredResearcher}
                onChange={() => {
                  onChange('isIndependentResearcher', true);
                  onChange('isRetiredResearcher', false);
                  onChange('researchStatus', 'independent_retired');
                }}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <Label htmlFor="independentRetiredResearcher" className="text-sm font-normal">
                Independent/Retired Researcher
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="affiliatedResearcher"
                name="researchStatus"
                value="affiliated"
                checked={!formData.isIndependentResearcher && !formData.isRetiredResearcher}
                onChange={() => {
                  onChange('isIndependentResearcher', false);
                  onChange('isRetiredResearcher', false);
                  onChange('researchStatus', 'affiliated');
                }}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <Label htmlFor="affiliatedResearcher" className="text-sm font-normal">
                Affiliated Researcher
              </Label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Select value={formData.gender} onValueChange={(value) => onChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="not_mention">Prefer not to mention</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="highestDegree">Highest Degree Achieved <span className="text-destructive">*</span></Label>
          <Select value={formData.highestDegree} onValueChange={(value) => onChange('highestDegree', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select highest degree" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bsc">BSc</SelectItem>
              <SelectItem value="msc">MSc</SelectItem>
              <SelectItem value="phd">Ph.D</SelectItem>
              <SelectItem value="md">M.D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orcidNumber">ORCID Number <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="orcidNumber"
            type="text"
            value={formData.orcidNumber}
            onChange={(e) => onChange('orcidNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn Link <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => onChange('linkedinUrl', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="researchgateUrl">Research Gate Link <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="researchgateUrl"
            type="url"
            value={formData.researchgateUrl}
            onChange={(e) => onChange('researchgateUrl', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleScholarUrl">Google Scholar Link <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="googleScholarUrl"
            type="url"
            value={formData.googleScholarUrl}
            onChange={(e) => onChange('googleScholarUrl', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="careerDescription">Career Description <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <Input
            id="careerDescription"
            type="text"
            value={formData.careerDescription}
            onChange={(e) => onChange('careerDescription', e.target.value)}
            placeholder="Brief description of your career"
          />
        </div>

        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </div>
  );
};

export default SignupStep1;