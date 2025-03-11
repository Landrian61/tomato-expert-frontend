
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfileForm from '@/components/profile/ProfileForm';
import NotificationSettings from '@/components/profile/NotificationSettings';
import AppSettings from '@/components/profile/AppSettings';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const Profile = () => {
  return (
    <Layout title="My Profile & Preferences">
      <div className="space-y-6">
        <ProfileForm />
        <NotificationSettings />
        <AppSettings />
        
        <div className="flex justify-center pt-4 pb-10">
          <Button size="lg" className="px-8">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
