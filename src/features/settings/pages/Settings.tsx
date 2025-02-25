import React, { useState } from 'react';
import { User, Lock, Bell } from 'lucide-react';

import { SecuritySection } from '@/features/settings/components/SecuritySection';
import { NotificationsSection } from '@/features/settings/components/NotificationsSection';
import { SectionButton } from '@/features/settings/components/SectionButton';
import { ProfileSection } from '@/features/settings/components/ProfileSection';

/**
 * Settings component that renders different sections based on the active section state.
 * @returns {JSX.Element} The rendered Settings component.
 */
const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications'>('profile');

  /**
   * Renders the active section based on the current state.
   * @returns {JSX.Element} The active section component.
   */
  const renderActiveSection = (): JSX.Element => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/90 rounded-2xl p-4 space-y-2">
              <SectionButton
                active={activeSection === 'profile'}
                icon={User}
                onClick={() => setActiveSection('profile')}
              >
                Profile
              </SectionButton>
              <SectionButton
                active={activeSection === 'security'}
                icon={Lock}
                onClick={() => setActiveSection('security')}
              >
                Security
              </SectionButton>
              <SectionButton
                active={activeSection === 'notifications'}
                icon={Bell}
                onClick={() => setActiveSection('notifications')}
              >
                Notifications
              </SectionButton>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-800/90 rounded-2xl p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;