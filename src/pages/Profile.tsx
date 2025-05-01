import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, deleteAccount } from "@/services/authService";
import { uploadProfileImage } from "@/services/imageService";
import LocationUpdate from "@/components/profile/LocationUpdate";
import { refreshEnvironmentalData } from "@/services/environmentalDataService";
import PushNotificationToggle from "@/components/notifications/PushNotificationToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        // Update the user context instead of calling setUserProfile
        if (setUser) {
          setUser({
            ...user,
            ...profile
          });
        }
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setEmail(profile.email || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }

    fetchUserProfile();
  }, [user, setUser]);

  const handleProfilePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const result = await uploadProfileImage(file);

      // Update the user in the auth context
      if (user && result.profilePhoto) {
        setUser({
          ...user,
          profilePhoto: result.profilePhoto
        });
      }

      toast.success("Profile photo updated successfully");
    } catch (error: any) {
      console.error("Failed to upload profile photo:", error);
      toast.error(error.message || "Failed to upload profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    // Simulate saving changes - in a real app, you'd call an API here
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile changes saved successfully");
    }, 1000);
  };

  const handleLocationUpdated = async () => {
    // Refresh environmental data after location update
    try {
      const response = await refreshEnvironmentalData();
      toast.success("Environmental data refreshed for your new location");
    } catch (error) {
      console.error("Failed to refresh environmental data:", error);
      // No need to show error toast as the updateUserLocation already shows one
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAccount(password);
      toast.success("Your account has been deleted successfully");
      setShowDeleteDialog(false);
      navigate("/login");
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate avatar fallback from user initials
  const getAvatarFallback = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "TE";
  };

  return (
    <Layout title="My Profile">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profilePhoto} alt="Profile" />
                  <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="h-4 w-4 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <span className="sr-only">Change profile picture</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              </div>

              <div className="space-y-4 flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Location Update */}
        <LocationUpdate onLocationUpdated={handleLocationUpdated} />

        {/* Push Notification Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PushNotificationToggle className="w-full" />
          </CardContent>
        </Card>

        {/* Danger Zone - Account Settings */}
        <Card className="border-red-200 bg-red-50/30 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-600/80">
              Actions here can't be undone. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-red-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-medium">Delete your account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all of your data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="sm:w-auto w-full"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4 pb-10">
          <Button
            size="lg"
            className="px-8 bg-plant hover:bg-plant-dark"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-left">
                Enter your password to confirm
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-left">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Warning:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>All your personal information will be deleted</li>
                    <li>All your diagnosis history will be removed</li>
                    <li>
                      All environmental data collected for your locations will
                      be deleted
                    </li>
                    <li>You will no longer receive alerts or notifications</li>
                  </ul>
                </div>
              </div>
            </div>

            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setPassword("");
                setConfirmText("");
                setDeleteError("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || !password || confirmText !== "DELETE"}
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
