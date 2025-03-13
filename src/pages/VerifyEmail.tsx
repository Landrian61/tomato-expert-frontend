
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, MailCheck, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  
  const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // If a token is provided, attempt to verify it
    if (token) {
      // Simulate verification process with backend
      setTimeout(() => {
        // For demo purposes, any token that starts with 'valid' is considered valid
        if (token.startsWith('valid')) {
          setVerificationState('success');
          toast.success('Email verified successfully!');
        } else {
          setVerificationState('failed');
          toast.error('Email verification failed. Please try again.');
        }
      }, 2000);
    }
  }, [token]);

  const handleResendVerification = () => {
    setIsResending(true);
    
    // Simulate resending verification email
    setTimeout(() => {
      setIsResending(false);
      toast.success(`Verification email resent to ${email}. Please check your inbox.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted">
      <div className="w-full max-w-md px-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {verificationState === 'verifying' && (
                <div className="h-12 w-12 rounded-full bg-warning flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              )}
              {verificationState === 'success' && (
                <div className="h-12 w-12 rounded-full bg-plant flex items-center justify-center">
                  <MailCheck className="h-6 w-6 text-white" />
                </div>
              )}
              {verificationState === 'failed' && (
                <div className="h-12 w-12 rounded-full bg-tomato flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {verificationState === 'verifying' && 'Verifying Your Email'}
              {verificationState === 'success' && 'Email Verified!'}
              {verificationState === 'failed' && 'Verification Failed'}
            </CardTitle>
            <CardDescription className="text-center">
              {verificationState === 'verifying' && 'Please wait while we verify your email address.'}
              {verificationState === 'success' && 'Thank you for verifying your email address.'}
              {verificationState === 'failed' && 'We could not verify your email address. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {verificationState === 'verifying' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plant"></div>
                <p className="text-muted-foreground">This won't take long...</p>
              </div>
            )}
            
            {verificationState === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-plant" />
                <p className="text-center text-muted-foreground">
                  Your email has been verified successfully. You can now use all features of Tomato Expert.
                </p>
              </div>
            )}
            
            {verificationState === 'failed' && (
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-16 w-16 text-tomato" />
                <p className="text-center text-muted-foreground">
                  The verification link may have expired or is invalid. 
                  {email && ` We can send a new verification link to ${email}.`}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            {verificationState === 'success' && (
              <Button 
                className="w-full bg-plant hover:bg-plant-dark"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            )}
            
            {verificationState === 'failed' && (
              <>
                {email && (
                  <Button 
                    className="w-full"
                    onClick={handleResendVerification}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </>
            )}
            
            {(verificationState === 'verifying' && email) && (
              <p className="text-sm text-center text-muted-foreground">
                Verifying {email}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
