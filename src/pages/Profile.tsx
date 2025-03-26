import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/authService";
import { uploadProfileImage } from "@/services/imageService";
import NotificationSettings from "@/components/profile/NotificationSettings";
import AppSettings from "@/components/profile/AppSettings";
import LocationUpdate from "@/components/profile/LocationUpdate";
import { refreshEnvironmentalData } from "@/services/environmentalDataService";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
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
  }, [user]);

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

  // Generate avatar fallback from user initials
  const getAvatarFallback = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "TE";
  };

  return (
    <Layout title="My Profile & Preferences">
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

        <NotificationSettings />
        <AppSettings />

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
    </Layout>
  );
};

export default Profile;
