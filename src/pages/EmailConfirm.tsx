import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EmailConfirm = () => {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Always show confirmed state
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash.substring(1);
        const params = new URLSearchParams(hashFragment);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
          
          setConfirmed(true);
        } else {
          throw new Error('Invalid confirmation link');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to confirm email');
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
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
            <CardHeader className="space-y-1 px-0 pb-4">
              <CardTitle className="text-2xl font-bold text-center">
                {loading ? 'Confirming Email...' : confirmed ? 'Email Confirmed!' : 'Confirmation Failed'}
              </CardTitle>
              <CardDescription className="text-center">
                {loading && 'Please wait while we confirm your email address'}
                {confirmed && 'Your email has been successfully verified'}
                {error && 'There was an issue confirming your email'}
              </CardDescription>
            </CardHeader>
            
            <div className="text-center space-y-4">
              {loading && (
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              )}
              
              {confirmed && (
                <>
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Welcome to AIRCollab! You can now access all features.
                  </p>
                  <Button onClick={handleContinue} className="w-full">
                    Continue to Dashboard
                  </Button>
                </>
              )}
              
              {error && (
                <>
                  <div className="flex justify-center">
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <p className="text-muted-foreground">
                    {error}
                  </p>
                  <Button onClick={() => navigate('/auth')} variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirm;