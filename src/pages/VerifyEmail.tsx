
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, MailCheck, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [verificationState, setVerificationState] = useState<'pending' | 'verifying' | 'success' | 'failed'>('pending');
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  // For demo purposes, we'll use a hardcoded valid code
  const VALID_CODE = '123456';

  const handleVerifyCode = () => {
    setVerificationState('verifying');
    
    // Simulate verification process with backend
    setTimeout(() => {
      if (verificationCode === VALID_CODE) {
        setVerificationState('success');
        toast.success('Email verified successfully!');
      } else {
        setVerificationState('failed');
        toast.error('Invalid verification code. Please try again.');
      }
    }, 1500);
  };

  const handleResendVerification = () => {
    setIsResending(true);
    
    // Simulate resending verification email
    setTimeout(() => {
      setIsResending(false);
      setVerificationState('pending'); // Reset to pending state
      toast.success(`Verification code resent to ${email}. Please check your inbox.`);
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
              {verificationState === 'pending' && (
                <div className="h-12 w-12 rounded-full bg-warning flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              )}
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
              {verificationState === 'pending' && 'Verify Your Email'}
              {verificationState === 'verifying' && 'Verifying Code...'}
              {verificationState === 'success' && 'Email Verified!'}
              {verificationState === 'failed' && 'Verification Failed'}
            </CardTitle>
            <CardDescription className="text-center">
              {verificationState === 'pending' && `We've sent a 6-digit code to ${email}. Enter it below to verify your email.`}
              {verificationState === 'verifying' && 'Please wait while we verify your code.'}
              {verificationState === 'success' && 'Thank you for verifying your email address.'}
              {verificationState === 'failed' && 'We could not verify your email address. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {verificationState === 'pending' && (
              <>
                <div className="w-full flex justify-center my-4">
                  <InputOTP 
                    maxLength={6} 
                    value={verificationCode} 
                    onChange={setVerificationCode}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                <Button 
                  onClick={handleVerifyCode} 
                  className="w-full bg-plant hover:bg-plant-dark"
                  disabled={verificationCode.length !== 6}
                >
                  Verify Email
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Didn't receive a code?{" "}
                  <button 
                    className="text-plant hover:text-plant-dark font-medium"
                    onClick={handleResendVerification}
                    disabled={isResending}
                  >
                    Resend
                  </button>
                </p>
              </>
            )}
            
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
                  The verification code is invalid or expired. Please try again.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => setVerificationState('pending')}
                >
                  Try Again
                </Button>
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
            
            {(verificationState === 'failed' || verificationState === 'pending') && (
              <>
                {isResending ? (
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled={true}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </Button>
                ) : null}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
