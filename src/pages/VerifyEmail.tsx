import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  MailCheck,
  Mail,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { verifyEmail, resendVerification } from "@/services/authService";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verificationState, setVerificationState] = useState<
    "pending" | "verifying" | "success" | "failed"
  >("pending");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle input change and auto-focus next field
  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next field if a digit was entered
      if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        // If current field is empty, move to previous field
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    setVerificationState("verifying");

    try {
      await verifyEmail(email, verificationCode);
      setVerificationState("success");
      toast.success("Email verified successfully!");
    } catch (error: any) {
      setVerificationState("failed");
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setIsResending(true);

    try {
      await resendVerification(email);
      setCode(["", "", "", "", "", ""]);
      setVerificationState("pending");
      setCountdown(60); // Set 60-second countdown
      toast.success(
        `Verification code resent to ${email}. Please check your inbox.`
      );

      // Focus the first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted">
      <div className="w-full max-w-md px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {verificationState === "pending" && (
                <div className="h-12 w-12 rounded-full bg-warning flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              )}
              {verificationState === "verifying" && (
                <div className="h-12 w-12 rounded-full bg-warning flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              )}
              {verificationState === "success" && (
                <div className="h-12 w-12 rounded-full bg-plant flex items-center justify-center">
                  <MailCheck className="h-6 w-6 text-white" />
                </div>
              )}
              {verificationState === "failed" && (
                <div className="h-12 w-12 rounded-full bg-tomato flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {verificationState === "pending" && "Verify Your Email"}
              {verificationState === "verifying" && "Verifying Code..."}
              {verificationState === "success" && "Email Verified!"}
              {verificationState === "failed" && "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {verificationState === "pending" &&
                `We've sent a 6-digit code to ${email}. Enter it below to verify your email.`}
              {verificationState === "verifying" &&
                "Please wait while we verify your code."}
              {verificationState === "success" &&
                "Thank you for verifying your email address."}
              {verificationState === "failed" &&
                "We could not verify your email address. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {verificationState === "pending" && (
              <>
                <div className="w-full flex justify-center my-4">
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-10 h-12 text-center text-lg font-semibold"
                        value={code[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => (inputRefs.current[index] = el)}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleVerifyCode}
                  className="w-full bg-plant hover:bg-plant-dark"
                  disabled={code.join("").length !== 6}
                >
                  Verify Email
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Didn't receive a code?{" "}
                  <button
                    className="text-plant hover:text-plant-dark font-medium"
                    onClick={handleResendVerification}
                    disabled={isResending || countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                  </button>
                </p>
              </>
            )}

            {verificationState === "verifying" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plant"></div>
                <p className="text-muted-foreground">This won't take long...</p>
              </div>
            )}

            {verificationState === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-plant" />
                <p className="text-center text-muted-foreground">
                  Your email has been verified successfully. You can now use all
                  features of Tomato Expert.
                </p>
              </div>
            )}

            {verificationState === "failed" && (
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-16 w-16 text-tomato" />
                <p className="text-center text-muted-foreground">
                  The verification code is invalid or expired. Please try again.
                </p>
                <Button
                  className="w-full"
                  onClick={() => setVerificationState("pending")}
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            {verificationState === "success" && (
              <Button
                className="w-full bg-plant hover:bg-plant-dark"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            )}

            {(verificationState === "failed" ||
              verificationState === "pending") && (
              <>
                {isResending ? (
                  <Button variant="outline" className="w-full" disabled={true}>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
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
