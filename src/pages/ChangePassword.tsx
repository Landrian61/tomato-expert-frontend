import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../services/authService";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsSubmitting(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await api.post("/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      setMessage(response.data.message);
      setIsSuccess(true);
      reset(); // Clear form
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Change Password
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Password Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    {...register("currentPassword", {
                      required: "Current password is required"
                    })}
                  />
                  {errors.currentPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    type="password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match"
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
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>

            {message && (
              <div
                className={`mt-3 text-sm ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
