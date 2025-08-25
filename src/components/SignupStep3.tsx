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
    whatIHave: string[];
    whatINeed: string[];
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
  const [selectedWhatIHave, setSelectedWhatIHave] = useState('');
  const [selectedWhatINeed, setSelectedWhatINeed] = useState('');
  const [customPrimaryArea, setCustomPrimaryArea] = useState('');
  const [customSecondaryArea, setCustomSecondaryArea] = useState('');
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [customWhatIHave, setCustomWhatIHave] = useState('');
  const [customWhatINeed, setCustomWhatINeed] = useState('');
  const [showCustomPrimary, setShowCustomPrimary] = useState(false);
  const [showCustomSecondary, setShowCustomSecondary] = useState(false);
  const [showCustomSpecialization, setShowCustomSpecialization] = useState(false);
  const [showCustomWhatIHave, setShowCustomWhatIHave] = useState(false);
  const [showCustomWhatINeed, setShowCustomWhatINeed] = useState(false);

  const experienceOptions = [
    { value: '<5', label: 'Less than 5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-20', label: '10-20 years' },
    { value: '>20', label: 'More than 20 years' }
  ];

  const researchAreas = [
'Addiction Psychiatry',
'Adolescent and Youth Health',
'Aging and Geriatric Health',
'Alzheimer\'s Disease and Dementia',
'Artificial Intelligence in Medicine',
'Autism Spectrum Disorder (ASD)',
'Behavioral Neurology',
'Bipolar Disorder',
'Biomedical Ethics / Bioethics',
'Biomarkers',
'Brain Tumors (e.g., Glioblastoma)',
'Breast Cancer',
'Cancer Biology',
'Cardiology (Heart)',
'Cardiovascular Disease',
'Child and Adolescent Psychiatry',
'Chronic Disease Management',
'Chronic Obstructive Pulmonary Disease',
'Cystic Fibrosis',
'Colorectal Cancer',
'Colorectal Surgery',
'Community Health Nursing',
'Complementary and Alternative Medicine (CAM)',
'Consultation-Liaison Psychiatry',
'Critical Care Nursing',
'Cytopathology',
'Depression and Anxiety Disorders',
'Dermatopathology',
'Diabetes',
'Digital Health / eHealth / mHealth',
'Disaster and Emergency Preparedness',
'Electrophysiology',
'Endodontics',
'Endocrinology (Hormones)',
'Environmental Health',
'Epidemiology',
'Epilepsy Research',
'Epileptology',
'Evidence-Based Practice',
'Forensic Pathology',
'Forensic Psychiatry',
'Gastroenterology (Digestive System)',
'Gender and Women\'s Health',
'Gene Therapy',
'Genetics',
'Genomics',
'Geriatric Medicine',
'Geriatric Psychiatry',
'Geriatrics and Aging Research',
'Global Health',
'Gynecologic Oncology',
'Health Communication and Literacy',
'Health Equity / Social Determinants of Health',
'Health Informatics',
'Health Policy and Management',
'Health Promotion and Education',
'Health Workforce Research',
'Healthcare Delivery Models',
'Hematologic Disorders',
'Hematology (Blood)',
'Hematopathology',
'Huntington\'s Disease',
'Hypertension',
'Immunotherapy',
'Infectious Diseases',
'Interventional Cardiology',
'Leukemia and Lymphoma',
'Lung Cancer',
'Lysosomal Storage Disorders',
'Maternal and Child Health',
'Maternal-Fetal Medicine',
'Medical Device Research',
'Medical Education and Training',
'Medical Humanities',
'Medical Law and Health Policy',
'Melanoma',
'Mental Health Nursing',
'Metabolomics',
'Midwifery',
'Molecular Biology',
'Molecular Genetic Pathology',
'Movement Disorders',
'Multiple Sclerosis (MS)',
'Multiple Sclerosis and Neuroimmunology',
'Muscular Dystrophies',
'Nephrology (Kidneys)',
'Neonatology',
'Neurobiology',
'Neurocritical Care',
'Neuroendocrinology',
'Neurological diseases',
'Neurology',
'Neuromuscular Medicine',
'Neuropathology',
'Neuroscience',
'Neurosurgery',
'Noncommunicable Diseases (NCDs) Prevention',
'Nurse Practitioner Roles',
'Obesity and Metabolic Syndrome',
'Occupational Health',
'One Health (human-animal-environment interface)',
'Oncology Nursing',
'Oral and Maxillofacial Surgery',
'Orthodontics',
'Orthopedic Surgery',
'Palliative and End-of-Life Care',
'Pancreatic Cancer',
'Parkinson\'s Disease',
'Patient Safety and Quality Improvement',
'Pediatric Cardiology',
'Pediatric Dentistry',
'Pediatric Endocrinology',
'Pediatric Infectious Diseases',
'Pediatric Neurology',
'Pediatric Oncology',
'Pediatric Surgery',
'Periodontics',
'Pharmacogenomics',
'Plastic and Reconstructive Surgery',
'Prostate Cancer',
'Proteomics',
'Prosthodontics',
'Pulmonology (Lungs)',
'Rare Disease Research (general category)',
'Rare Diseases',
'Refugee and Migrant Health',
'Rehabilitation Technologies',
'Reproductive Endocrinology and Infertility',
'Respiratory diseases',
'Rheumatology (Joints and Autoimmune Diseases)',
'Schizophrenia Research',
'Sickle Cell Disease',
'Stem Cell Biology',
'Stroke',
'Structural Biology',
'Surgical Oncology',
'Telemedicine / Telehealth',
'Thyroid abnormalities',
'Transplant Surgery',
'Urogynecology',
'Vaccine Development',
'Vascular Neurology',
    'Other'
  ];

  const keywordOptions = [
'Big Data',
'Bioinformatics',
'Biomedical Engineering',
'Blockchain',
'Clinical Research',
'Cloud Computing',
'Computer Vision',
'Deep Learning',
'Drug Discovery',
'Epidemiology',
'Genomics',
'IoT',
'Medical Imaging',
'Neural Networks',
'NLP',
'Proteomics',
'Public Health',
'Quantum Computing',
'Robotics',
    'Other'
  ];

  const researchRoleOptions = [
'Co-Investigator',
'Co-Principal Investigator',
'Graduate Researcher',
'Postdoc',
'Principal Investigator',
'Research Assistant',
'Research Associate',
'Research Technician',
'Undergraduate Researcher'
  ];

  const whatOptions = [
'Animal Models',
'Animal Samples',
'Approved Grant',
'Clinical Experience',
'Equipments',
'Experiments',
'Graduate Students',
'Grant Application',
'Human Samples',
'Idea',
'Manuscripts',
'Molecular Experience',
'Proposal',
'Research Reports',
'Results Analysis',
'Statistics',
'Student Supervision',
'Technical Experience',
    'Other'
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

  const addWhatIHave = () => {
    if (selectedWhatIHave && !formData.whatIHave.includes(selectedWhatIHave)) {
      onChange('whatIHave', [...formData.whatIHave, selectedWhatIHave]);
      setSelectedWhatIHave('');
    }
  };

  const removeWhatIHave = (item: string) => {
    onChange('whatIHave', formData.whatIHave.filter(h => h !== item));
  };

  const handleWhatIHaveChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomWhatIHave(true);
      setCustomWhatIHave('');
    } else {
      setShowCustomWhatIHave(false);
      setSelectedWhatIHave(value);
    }
  };

  const addWhatINeed = () => {
    if (selectedWhatINeed && !formData.whatINeed.includes(selectedWhatINeed)) {
      onChange('whatINeed', [...formData.whatINeed, selectedWhatINeed]);
      setSelectedWhatINeed('');
    }
  };

  const removeWhatINeed = (item: string) => {
    onChange('whatINeed', formData.whatINeed.filter(n => n !== item));
  };

  const handleWhatINeedChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomWhatINeed(true);
      setCustomWhatINeed('');
    } else {
      setShowCustomWhatINeed(false);
      setSelectedWhatINeed(value);
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
          <Label htmlFor="experienceYears">Research Experience in Years <span className="text-destructive">*</span></Label>
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
          <Label htmlFor="primaryResearchArea">Primary Research Area <span className="text-destructive">*</span></Label>
          {showCustomPrimary ? (
            <Input
              value={customPrimaryArea}
              onChange={(e) => {
                setCustomPrimaryArea(e.target.value);
                onChange('primaryResearchArea', e.target.value);
              }}
              placeholder="Enter your primary research areas"
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
          <Label htmlFor="secondaryResearchArea">Secondary Research Area <span className="text-destructive">*</span></Label>
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
          <Label>Specialization/Keywords <span className="text-muted-foreground text-sm">(Optional)</span></Label>
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
          <Label>Research Role <span className="text-muted-foreground text-sm">(Optional)</span></Label>
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

        <div className="space-y-2">
          <Label>What I Have <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <div className="flex gap-2">
            {showCustomWhatIHave ? (
              <Input
                value={customWhatIHave}
                onChange={(e) => setCustomWhatIHave(e.target.value)}
                placeholder="Enter what you have"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customWhatIHave && !formData.whatIHave.includes(customWhatIHave)) {
                      onChange('whatIHave', [...formData.whatIHave, customWhatIHave]);
                      setCustomWhatIHave('');
                      setShowCustomWhatIHave(false);
                    }
                  }
                }}
              />
            ) : (
              <Select value={selectedWhatIHave} onValueChange={handleWhatIHaveChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select what you have" />
                </SelectTrigger>
                <SelectContent>
                  {whatOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button 
              type="button" 
              onClick={showCustomWhatIHave ? 
                () => {
                  if (customWhatIHave && !formData.whatIHave.includes(customWhatIHave)) {
                    onChange('whatIHave', [...formData.whatIHave, customWhatIHave]);
                    setCustomWhatIHave('');
                    setShowCustomWhatIHave(false);
                  }
                } : 
                addWhatIHave
              }
              disabled={showCustomWhatIHave ? !customWhatIHave : !selectedWhatIHave}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.whatIHave.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeWhatIHave(item)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>What I Need <span className="text-muted-foreground text-sm">(Optional)</span></Label>
          <div className="flex gap-2">
            {showCustomWhatINeed ? (
              <Input
                value={customWhatINeed}
                onChange={(e) => setCustomWhatINeed(e.target.value)}
                placeholder="Enter what you need"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (customWhatINeed && !formData.whatINeed.includes(customWhatINeed)) {
                      onChange('whatINeed', [...formData.whatINeed, customWhatINeed]);
                      setCustomWhatINeed('');
                      setShowCustomWhatINeed(false);
                    }
                  }
                }}
              />
            ) : (
              <Select value={selectedWhatINeed} onValueChange={handleWhatINeedChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select what you need" />
                </SelectTrigger>
                <SelectContent>
                  {whatOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button 
              type="button" 
              onClick={showCustomWhatINeed ? 
                () => {
                  if (customWhatINeed && !formData.whatINeed.includes(customWhatINeed)) {
                    onChange('whatINeed', [...formData.whatINeed, customWhatINeed]);
                    setCustomWhatINeed('');
                    setShowCustomWhatINeed(false);
                  }
                } : 
                addWhatINeed
              }
              disabled={showCustomWhatINeed ? !customWhatINeed : !selectedWhatINeed}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.whatINeed.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeWhatINeed(item)}
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