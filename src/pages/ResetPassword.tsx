import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/authService";

interface ResetPasswordForm {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetPasswordForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const password = watch("password");

  const verifyCode = async (data: ResetPasswordForm) => {
    setIsVerifying(true);
    setMessage("");
    setIsError(false);

    try {
      await verifyResetToken(data.email, data.code);
      setIsVerified(true);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Invalid or expired reset code."
      );
      setIsError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!isVerified) {
      await verifyCode(data);
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await resetPassword(
        data.email,
        data.code,
        data.password
      );
      setMessage(response.message);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {!isSuccess ? (
              <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isVerified}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm disabled:bg-gray-100"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Reset Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="code"
                        type="text"
                        required
                        disabled={isVerified}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm disabled:bg-gray-100"
                        {...register("code", {
                          required: "Reset code is required",
                          minLength: {
                            value: 6,
                            message: "Code should be 6 digits"
                          },
                          maxLength: {
                            value: 6,
                            message: "Code should be 6 digits"
                          }
                        })}
                      />
                      {errors.code && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.code.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isVerified ? (
                    <div>
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={handleSubmit(verifyCode)}
                        className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
                      >
                        {isVerifying ? "Verifying..." : "Verify Reset Code"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must be at least 8 characters"
                              }
                            })}
                          />
                          {errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === password || "Passwords do not match"
                            })}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
                        >
                          {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            ) : (
              <div className="rounded-md bg-green-50 p-4 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {message}
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      Redirecting to login page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {message && !isSuccess && (
              <div
                className={`mt-3 text-sm ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/tomato-farm-auth.jpg"
          alt="Tomato farm"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
