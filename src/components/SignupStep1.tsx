import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SignupStep1Props {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    orcidNumber: string;
    linkedinUrl: string;
    phone: string;
    researchgateUrl: string;
    googleScholarUrl: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const SignupStep1: React.FC<SignupStep1Props> = ({ formData, onChange, onNext }) => {
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
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
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orcidNumber">ORCID Number</Label>
          <Input
            id="orcidNumber"
            type="text"
            value={formData.orcidNumber}
            onChange={(e) => onChange('orcidNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn Link</Label>
          <Input
            id="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => onChange('linkedinUrl', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="researchgateUrl">Research Gate Link</Label>
          <Input
            id="researchgateUrl"
            type="url"
            value={formData.researchgateUrl}
            onChange={(e) => onChange('researchgateUrl', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleScholarUrl">Google Scholar Link</Label>
          <Input
            id="googleScholarUrl"
            type="url"
            value={formData.googleScholarUrl}
            onChange={(e) => onChange('googleScholarUrl', e.target.value)}
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