import React, { useState } from 'react';
import { Bell, CheckCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export const NotificationsSection: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
          <div className="space-y-1 flex-grow">
            <h3 className="font-medium flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <span>Email Notifications</span>
            </h3>
            <p className="text-sm text-gray-400">Receive updates and announcements via email</p>
          </div>
          <button onClick={toggleEmailNotifications} className="focus:outline-none">
            {emailNotifications ? (
              <ToggleRight className="h-8 w-8 text-green-500" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-500" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
          <div className="space-y-1 flex-grow">
            <h3 className="font-medium flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <span>Push Notifications</span>
            </h3>
            <p className="text-sm text-gray-400">Receive real-time updates on your device</p>
          </div>
          <button onClick={togglePushNotifications} className="focus:outline-none">
            {pushNotifications ? (
              <ToggleRight className="h-8 w-8 text-green-500" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};