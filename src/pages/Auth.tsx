
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import SignupStep1 from '@/components/SignupStep1';
import SignupStep2 from '@/components/SignupStep2';
import SignupStep3 from '@/components/SignupStep3';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Multi-step signup form data
  const [signupData, setSignupData] = useState({
    // Step 1 - Personal Information
    firstName: '',
    lastName: '',
    gender: '',
    highestDegree: '',
    email: '',
    password: '',
    orcidNumber: '',
    linkedinUrl: '',
    phone: '',
    researchgateUrl: '',
    googleScholarUrl: '',
    careerDescription: '',
    isIndependentResearcher: false,
    isRetiredResearcher: false,
    researchStatus: 'affiliated',
    // Step 2 - Institution Information
    institution: '',
    college: '',
    department: '',
    country: '',
    city: '',
    postcode: '',
    // Step 3 - Research Interest
    experienceYears: '',
    primaryResearchArea: '',
    secondaryResearchArea: '',
    keywords: [] as string[],
    researchRoles: [] as string[],
    specializationKeywords: [] as string[],
    whatIHave: [] as string[],
    whatINeed: [] as string[],
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupFieldChange = (field: string, value: string | string[] | boolean) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignupFinish = async () => {
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/email-confirm`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            gender: signupData.gender,
            highest_degree: signupData.highestDegree,
            username: `${signupData.firstName.toLowerCase()}${signupData.lastName.toLowerCase()}`,
            user_id_number: signupData.orcidNumber,
            linkedin_url: signupData.linkedinUrl,
            phone: signupData.phone,
            researchgate_url: signupData.researchgateUrl,
            google_scholar_url: signupData.googleScholarUrl,
            career_description: signupData.careerDescription,
            institution: signupData.institution,
            college: signupData.college,
            department: signupData.department,
            country: signupData.country,
            state_city: signupData.city,
            postcode: signupData.postcode,
            experience: signupData.experienceYears,
            primary_research_area: signupData.primaryResearchArea,
            secondary_research_area: signupData.secondaryResearchArea,
            keywords: signupData.keywords.join(','),
            specialization_keywords: signupData.specializationKeywords.join(','),
            research_roles: signupData.researchRoles.join(','),
            what_i_have: signupData.whatIHave.join(','),
            what_i_need: signupData.whatINeed.join(','),
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      // Reset form and go back to login
      setIsLogin(true);
      setCurrentStep(1);
      setSignupData({
        firstName: '',
        lastName: '',
        gender: '',
        highestDegree: '',
        email: '',
        password: '',
        orcidNumber: '',
        linkedinUrl: '',
        phone: '',
        researchgateUrl: '',
        googleScholarUrl: '',
        careerDescription: '',
        isIndependentResearcher: false,
        isRetiredResearcher: false,
        researchStatus: 'affiliated',
        institution: '',
        college: '',
        department: '',
        country: '',
        city: '',
        postcode: '',
        experienceYears: '',
        primaryResearchArea: '',
        secondaryResearchArea: '',
        keywords: [],
        researchRoles: [],
        specializationKeywords: [],
        whatIHave: [],
        whatINeed: [],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      toast({
        title: "Reset email sent!",
        description: "Please check your email for password reset instructions.",
      });
      
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLogin(true);
    setIsForgotPassword(false);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-2xl text-foreground">AIRCollab</span>
          </div>
          <p className="text-muted-foreground">Connect, Collaborate, Discover</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isForgotPassword ? (
              // Forgot Password Form
              <>
                <CardHeader className="space-y-1 px-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-center">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-center">
                    Enter your email address to receive password reset instructions
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-primary hover:underline font-semibold"
                    >
                      Back to login
                    </button>
                  </p>
                </div>
              </>
            ) : isLogin ? (
              // Login Form
              <>
                <CardHeader className="space-y-1 px-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-center">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-center">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              // Multi-step Signup Form
              <>
                {currentStep === 1 && (
                  <SignupStep1
                    formData={{
                      firstName: signupData.firstName,
                      lastName: signupData.lastName,
                      gender: signupData.gender,
                      highestDegree: signupData.highestDegree,
                      email: signupData.email,
                      password: signupData.password,
                      orcidNumber: signupData.orcidNumber,
                      linkedinUrl: signupData.linkedinUrl,
                      phone: signupData.phone,
                      researchgateUrl: signupData.researchgateUrl,
                      googleScholarUrl: signupData.googleScholarUrl,
                      careerDescription: signupData.careerDescription,
                      isIndependentResearcher: signupData.isIndependentResearcher,
                      isRetiredResearcher: signupData.isRetiredResearcher,
                      researchStatus: signupData.researchStatus,
                    }}
                    onChange={handleSignupFieldChange}
                    onNext={() => setCurrentStep(2)}
                  />
                )}
                
                {currentStep === 2 && (
                  <SignupStep2
                    formData={{
                      institution: signupData.institution,
                      college: signupData.college,
                      department: signupData.department,
                      country: signupData.country,
                      city: signupData.city,
                      postcode: signupData.postcode,
                    }}
                    onChange={handleSignupFieldChange}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                    skipInstitution={signupData.isIndependentResearcher || signupData.isRetiredResearcher}
                  />
                )}
                
                {currentStep === 3 && (
                  <SignupStep3
                    formData={{
                      experienceYears: signupData.experienceYears,
                      primaryResearchArea: signupData.primaryResearchArea,
                      secondaryResearchArea: signupData.secondaryResearchArea,
                      keywords: signupData.keywords,
                      researchRoles: signupData.researchRoles,
                      specializationKeywords: signupData.specializationKeywords,
                      whatIHave: signupData.whatIHave,
                      whatINeed: signupData.whatINeed,
                    }}
                    onChange={handleSignupFieldChange}
                    onFinish={handleSignupFinish}
                    onBack={() => setCurrentStep(2)}
                    loading={loading}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
