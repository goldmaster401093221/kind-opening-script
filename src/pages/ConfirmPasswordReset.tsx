import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ConfirmPasswordReset = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const confirmPasswordReset = async () => {
      try {
        // Get the new password from URL params
        const newPassword = searchParams.get('newPassword');
        
        if (!newPassword) {
          setError('Invalid reset link. Please try requesting a new password reset.');
          setLoading(false);
          return;
        }

        // Update the user's password
        const { error } = await supabase.auth.updateUser({
          password: decodeURIComponent(newPassword)
        });
        
        if (error) throw error;
        
        toast({
          title: "Password updated successfully!",
          description: "Your password has been changed. Please log in with your new password.",
        });
        
        // Sign out user and redirect to login page
        await supabase.auth.signOut();
        navigate('/auth');
      } catch (error: any) {
        console.error('Error confirming password reset:', error);
        setError(error.message || 'An error occurred while resetting your password.');
      } finally {
        setLoading(false);
      }
    };

    confirmPasswordReset();
  }, [searchParams, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <CardHeader className="space-y-1 px-0 pb-4">
                <CardTitle className="text-2xl font-bold text-center">
                  Confirming Password Reset
                </CardTitle>
                <CardDescription className="text-center">
                  Please wait while we update your password...
                </CardDescription>
              </CardHeader>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <CardHeader className="space-y-1 px-0 pb-4">
                <CardTitle className="text-2xl font-bold text-center text-destructive">
                  Password Reset Failed
                </CardTitle>
                <CardDescription className="text-center">
                  {error}
                </CardDescription>
              </CardHeader>
              
              <div className="text-center">
                <Button 
                  onClick={() => navigate('/reset-password')}
                  className="w-full"
                >
                  Try Again
                </Button>
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="text-primary hover:underline font-semibold"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfirmPasswordReset;