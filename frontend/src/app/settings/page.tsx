'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'pl',
    timezone: 'Europe/Warsaw'
  });

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, theme: e.target.value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, notifications: e.target.checked }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, language: e.target.value }));
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, timezone: e.target.value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Ustawienia</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Temat */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Temat</label>
            <select
              value={settings.theme}
              onChange={handleThemeChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="light">Jasny</option>
              <option value="dark">Ciemny</option>
            </select>
          </div>

          {/* Powiadomienia */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={handleNotificationChange}
                className="rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Otrzymuj powiadomienia</span>
            </label>
          </div>

          {/* Język */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Język</label>
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="pl">Polski</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Strefa czasowa */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Strefa czasowa</label>
            <select
              value={settings.timezone}
              onChange={handleTimezoneChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Europe/Warsaw">Warszawa</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          {/* Przycisk zapisu */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              // Tutaj będzie logika zapisu ustawień
              console.log('Saving settings:', settings);
            }}
          >
            Zapisz ustawienia
          </button>
        </div>
      </div>
    </div>
  );
}
