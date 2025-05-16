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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Ustawienia</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Temat */}
          <div>
            <label className="block text-sm font-medium mb-2">Temat</label>
            <select
              value={settings.theme}
              onChange={handleThemeChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="light">Jasny</option>
              <option value="dark">Ciemny</option>
            </select>
          </div>

          {/* Powiadomienia */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={handleNotificationChange}
                className="rounded"
              />
              <span>Włącz powiadomienia</span>
            </label>
          </div>

          {/* Język */}
          <div>
            <label className="block text-sm font-medium mb-2">Język</label>
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="pl">Polski</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Strefa czasowa */}
          <div>
            <label className="block text-sm font-medium mb-2">Strefa czasowa</label>
            <select
              value={settings.timezone}
              onChange={handleTimezoneChange}
              className="w-full p-2 border rounded-lg"
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
