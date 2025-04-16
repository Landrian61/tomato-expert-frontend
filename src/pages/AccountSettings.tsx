import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/authService";

interface DeleteAccountForm {
  password: string;
  confirmation: string;
}

const AccountSettings = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<DeleteAccountForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const confirmation = watch("confirmation");

  const onSubmit = async (data: DeleteAccountForm) => {
    if (confirmation !== "DELETE") {
      setMessage("Please type DELETE to confirm");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await deleteAccount(data.password);
      setMessage(response.message);

      // Redirect to home after successful deletion
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Account Settings
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-red-50">
            <h3 className="text-lg leading-6 font-medium text-red-800">
              Danger Zone
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-red-600">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    {...register("password", {
                      required: "Password is required"
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
                  htmlFor="confirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  To confirm, type "DELETE" in the field below
                </label>
                <div className="mt-1">
                  <input
                    id="confirmation"
                    type="text"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                    {...register("confirmation", {
                      required: "Confirmation is required"
                    })}
                  />
                  {errors.confirmation && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmation.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      When you delete your account:
                    </p>
                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                      <li>
                        All your personal data will be permanently removed
                      </li>
                      <li>Your diagnosis history will be deleted</li>
                      <li>Your environmental data records will be deleted</li>
                      <li>You cannot undo this action</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || confirmation !== "DELETE"}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </form>

            {message && (
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
    </div>
  );
};

export default AccountSettings;
