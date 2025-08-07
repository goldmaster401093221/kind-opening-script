import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface SignupStep3Props {
  formData: {
    experienceYears: string;
    primaryResearchArea: string;
    secondaryResearchArea: string;
    keywords: string[];
    researchRoles: string[];
    specializationKeywords: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
  onFinish: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const SignupStep3: React.FC<SignupStep3Props> = ({ formData, onChange, onFinish, onCancel, loading }) => {
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [customPrimaryArea, setCustomPrimaryArea] = useState('');
  const [customSecondaryArea, setCustomSecondaryArea] = useState('');
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [showCustomPrimary, setShowCustomPrimary] = useState(false);
  const [showCustomSecondary, setShowCustomSecondary] = useState(false);
  const [showCustomSpecialization, setShowCustomSpecialization] = useState(false);

  const experienceOptions = [
    { value: '<5', label: 'Less than 5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-20', label: '10-20 years' },
    { value: '>20', label: 'More than 20 years' }
  ];

  const researchAreas = [
    'Cardiology (Heart)',
    'Cardiovascular Disease',
    'Hypertension',
    'Interventional Cardiology',
    'Electrophysiology',
    'Endocrinology (Hormones)',
    'Neuroendocrinology',
    'Thyroid abnormalities',
    'Diabetes',
    'Obesity and Metabolic Syndrome',
    'Gastroenterology (Digestive System)',
    'Nephrology (Kidneys)',
    'Rheumatology (Joints and Autoimmune Diseases)',
    'Pulmonology (Lungs)',
    'Hematology (Blood)',
    'Infectious Diseases',
    'Geriatric Medicine',
    'Pediatric Cardiology',
    'Neonatology',
    'Pediatric Neurology',
    'Pediatric Oncology',
    'Pediatric Endocrinology',
    'Pediatric Infectious Diseases',
    'Epileptology',
    'Neurocritical Care',
    'Movement Disorders',
    'Multiple Sclerosis and Neuroimmunology',
    'Neuromuscular Medicine',
    'Stroke',
    'Vascular Neurology',
    'Behavioral Neurology',
    'Forensic Pathology',
    'Molecular Genetic Pathology',
    'Genetics',
    'Molecular Biology',
    'Hematopathology',
    'Neuropathology',
    'Cytopathology',
    'Dermatopathology',
    'Cardiothoracic Surgery',
    'Neurosurgery',
    'Orthopedic Surgery',
    'Plastic and Reconstructive Surgery',
    'Colorectal Surgery',
    'Pediatric Surgery',
    'Surgical Oncology',
    'Transplant Surgery',
    'Child and Adolescent Psychiatry',
    'Forensic Psychiatry',
    'Geriatric Psychiatry',
    'Addiction Psychiatry',
    'Consultation-Liaison Psychiatry',
    'Maternal-Fetal Medicine',
    'Reproductive Endocrinology and Infertility',
    'Gynecologic Oncology',
    'Urogynecology',
    'Orthodontics',
    'Periodontics',
    'Endodontics',
    'Oral and Maxillofacial Surgery',
    'Pediatric Dentistry',
    'Prosthodontics',
    'Epidemiology',
    'Environmental Health',
    'Global Health',
    'Health Promotion and Education',
    'Health Policy and Management',
    'Occupational Health',
    'Cancer Biology',
    'Neurobiology',
    'Neuroscience',
    'Neurology',
    'Immunology',
    'Pharmacogenomics',
    'Structural Biology',
    'Stem Cell Biology',
    'Nurse Practitioner Roles',
    'Critical Care Nursing',
    'Oncology Nursing',
    'Mental Health Nursing',
    'Community Health Nursing',
    'Midwifery',
    'Medical Education and Training',
    'Biomedical Ethics / Bioethics',
    'Digital Health / eHealth / mHealth',
    'Health Informatics',
    'Telemedicine / Telehealth',
    'Artificial Intelligence in Medicine',
    'Medical Humanities',
    'One Health (human-animal-environment interface)',
    'Maternal and Child Health',
    'Health Equity / Social Determinants of Health',
    'Disaster and Emergency Preparedness',
    'Refugee and Migrant Health',
    'Urban Health',
    'Health Communication and Literacy',
    'Noncommunicable Diseases (NCDs) Prevention',
    'Biomarkers',
    'Genomics',
    'Proteomics',
    'Metabolomics',
    'Patient Safety and Quality Improvement',
    'Evidence-Based Practice',
    'Medical Law and Health Policy',
    'Healthcare Delivery Models',
    'Health Workforce Research',
    'Aging and Geriatric Health',
    'Adolescent and Youth Health',
    'Gender and Women\'s Health',
    'Geriatrics and Aging Research',
    'Rare Diseases',
    'Palliative and End-of-Life Care',
    'Chronic Disease Management',
    'Complementary and Alternative Medicine (CAM)',
    'Immunotherapy',
    'Gene Therapy',
    'Vaccine Development',
    'Rehabilitation Technologies',
    'Medical Device Research',
    'Respiratory diseases',
    'Neurological diseases',
    'Breast Cancer',
    'Lung Cancer',
    'Colorectal Cancer',
    'Prostate Cancer',
    'Leukemia and Lymphoma',
    'Pancreatic Cancer',
    'Brain Tumors (e.g., Glioblastoma)',
    'Melanoma',
    'Cystic Fibrosis',
    'Sickle Cell Disease',
    'Huntington\'s Disease',
    'Muscular Dystrophies',
    'Lysosomal Storage Disorders',
    'Rare Disease Research (general category)',
    'Alzheimer\'s Disease and Dementia',
    'Parkinson\'s Disease',
    'Multiple Sclerosis (MS)',
    'Epilepsy Research',
    'Autism Spectrum Disorder (ASD)',
    'Schizophrenia Research',
    'Depression and Anxiety Disorders',
    'Bipolar Disorder',
    'Hematologic Disorders',
    'Chronic Obstructive Pulmonary Disease',
    'Other'
  ];

  const keywordOptions = [
    'Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'Robotics',
    'Big Data', 'Cloud Computing', 'IoT', 'Blockchain', 'Quantum Computing',
    'Bioinformatics', 'Genomics', 'Proteomics', 'Drug Discovery', 'Clinical Research',
    'Epidemiology', 'Public Health', 'Medical Imaging', 'Biomedical Engineering',
    'Other'
  ];

  const researchRoleOptions = [
    'Principal Investigator',
    'Co-Principal Investigator',
    'Co-Investigator',
    'Research Associate',
    'Research Assistant',
    'Graduate Researcher',
    'Postdoc',
    'Research Technician',
    'Undergraduate Researcher'
  ];

  const addKeyword = () => {
    if (selectedKeyword && !formData.keywords.includes(selectedKeyword)) {
      onChange('keywords', [...formData.keywords, selectedKeyword]);
      setSelectedKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange('keywords', formData.keywords.filter(k => k !== keyword));
  };

  const addRole = () => {
    if (selectedRole && !formData.researchRoles.includes(selectedRole)) {
      onChange('researchRoles', [...formData.researchRoles, selectedRole]);
      setSelectedRole('');
    }
  };

  const removeRole = (role: string) => {
    onChange('researchRoles', formData.researchRoles.filter(r => r !== role));
  };

  const addSpecialization = () => {
    if (selectedSpecialization && !formData.specializationKeywords.includes(selectedSpecialization)) {
      onChange('specializationKeywords', [...formData.specializationKeywords, selectedSpecialization]);
      setSelectedSpecialization('');
    }
  };

  const removeSpecialization = (specialization: string) => {
    onChange('specializationKeywords', formData.specializationKeywords.filter(s => s !== specialization));
  };

  const handlePrimaryAreaChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomPrimary(true);
      setCustomPrimaryArea('');
    } else {
      setShowCustomPrimary(false);
      onChange('primaryResearchArea', value);
    }
  };

  const handleSecondaryAreaChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSecondary(true);
      setCustomSecondaryArea('');
    } else {
      setShowCustomSecondary(false);
      onChange('secondaryResearchArea', value);
    }
  };

  const handleSpecializationChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSpecialization(true);
      setCustomSpecialization('');
    } else {
      setShowCustomSpecialization(false);
      setSelectedSpecialization(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Tell us more about you<br />
          to help you finding collaborators
        </h2>
        <p className="text-lg text-muted-foreground">Research Information</p>
      </div>

      <Progress value={100} className="w-full" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Research Experience in Years *</Label>
          <Select 
            value={formData.experienceYears} 
            onValueChange={(value) => onChange('experienceYears', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience range" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryResearchArea">Primary Research Area *</Label>
          {showCustomPrimary ? (
            <Input
              value={customPrimaryArea}
              onChange={(e) => {
                setCustomPrimaryArea(e.target.value);
                onChange('primaryResearchArea', e.target.value);
              }}
              placeholder="Enter your primary research area"
              required
            />
          ) : (
            <Select 
              value={formData.primaryResearchArea} 
              onValueChange={handlePrimaryAreaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary research area" />
              </SelectTrigger>
              <SelectContent>
                {researchAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryResearchArea">Secondary Research Area *</Label>
          {showCustomSecondary ? (
            <Input
              value={customSecondaryArea}
              onChange={(e) => {
                setCustomSecondaryArea(e.target.value);
                onChange('secondaryResearchArea', e.target.value);
              }}
              placeholder="Enter your secondary research area"
              required
            />
          ) : (
            <Select 
              value={formData.secondaryResearchArea} 
              onValueChange={handleSecondaryAreaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select secondary research area" />
              </SelectTrigger>
              <SelectContent>
                {researchAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label>Specialization/Keywords (Optional)</Label>
          <div className="flex gap-2">
            {showCustomSpecialization ? (
              <Input
                value={customSpecialization}
                onChange={(e) => setCustomSpecialization(e.target.value)}
                placeholder="Enter specialization keyword"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customSpecialization && !formData.specializationKeywords.includes(customSpecialization)) {
                      onChange('specializationKeywords', [...formData.specializationKeywords, customSpecialization]);
                      setCustomSpecialization('');
                      setShowCustomSpecialization(false);
                    }
                  }
                }}
              />
            ) : (
              <Select value={selectedSpecialization} onValueChange={handleSpecializationChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {keywordOptions.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button 
              type="button" 
              onClick={showCustomSpecialization ? 
                () => {
                  if (customSpecialization && !formData.specializationKeywords.includes(customSpecialization)) {
                    onChange('specializationKeywords', [...formData.specializationKeywords, customSpecialization]);
                    setCustomSpecialization('');
                    setShowCustomSpecialization(false);
                  }
                } : 
                addSpecialization
              }
              disabled={showCustomSpecialization ? !customSpecialization : !selectedSpecialization}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.specializationKeywords.map((specialization, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {specialization}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeSpecialization(specialization)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Research Role (Optional)</Label>
          <div className="flex gap-2">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select research role" />
              </SelectTrigger>
              <SelectContent>
                {researchRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              onClick={addRole}
              disabled={!selectedRole}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.researchRoles.map((role, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {role}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeRole(role)}
                />
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