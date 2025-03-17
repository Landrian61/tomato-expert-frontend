import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import NotificationSettings from "@/components/profile/NotificationSettings";
import AppSettings from "@/components/profile/AppSettings";
import { Button } from "@/components/ui/button";
import { Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Profile = () => {
  const { logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate saving changes to the server
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile changes saved successfully");
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <Layout title="My Profile & Preferences">
      <div className="space-y-6 max-w-4xl mx-auto">
        <ProfileForm />
        <NotificationSettings />
        <AppSettings />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 pb-10">
          <Button
            size="lg"
            className="px-8 bg-plant hover:bg-plant-dark w-full sm:w-auto"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
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

          <Dialog
            open={isLogoutDialogOpen}
            onOpenChange={setIsLogoutDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-tomato hover:text-tomato-dark hover:bg-tomato/5 border-tomato/20 w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Log out of Tomato Expert?</DialogTitle>
                <DialogDescription>
                  You will need to sign in again to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="sm:flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleLogout}
                  className="bg-tomato hover:bg-tomato/90 sm:flex-1"
                >
                  Log out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
