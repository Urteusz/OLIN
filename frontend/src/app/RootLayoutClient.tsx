'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Tasks', href: '/tasks', icon: '👥' },
  { name: 'Ustawienia', href: '/settings', icon: '⚙️' },
  { name: 'Daily questions', href: '/dailyquestions', icon: '❓' },
  { name: 'Initial Questionnaire', href: '/initial-survey', icon: '📝' },
  { name: 'Slots', href: '/slot-machine', icon: '🎰'}
];

// Typy dla danych użytkownika
interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  
  // Sprawdź preferencje systemowe przy pierwszym renderowaniu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sprawdź, czy użytkownik ma zapisane preferencje
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Użyj zapisanych preferencji lub preferencji systemowych
      const initialDarkMode = savedTheme 
        ? savedTheme === 'dark'
        : prefersDark;
        
      setDarkMode(initialDarkMode);
      
      // Zastosuj motyw
      if (initialDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Funkcja do przełączania motywu
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (typeof window !== 'undefined') {
      // Zapisz preferencje użytkownika
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      
      // Zastosuj motyw
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  const { user: userData, setUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}>
        <div className={`p-4 border-b border-gray-200 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && <h1 className="text-xl font-bold">Menu</h1>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isSidebarOpen ? 'Zwiń menu' : 'Rozwiń menu'}
          >
            {isSidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2">
            {navItems.map((item) => (
              <li key={item.href} className="mb-1">
                <Link 
                  href={item.href}
                  className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-3 rounded-lg ${
                    pathname === item.href 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`text-xl ${isSidebarOpen ? 'mr-3' : ''}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t border-gray-200 dark:border-gray-700">
          {userData ? (
            <div className="p-2">
              <div className="flex items-center justify-between p-2 rounded-lg">
                <div className="flex items-center w-full">
                  <div className={`h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{userData?.name || 'Użytkownik'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email || ''}</p>
                    </div>
                  )}
                  {isSidebarOpen && (
                    <div className="flex items-center space-x-2 ml-2">
                      <button 
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={darkMode ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
                        title={darkMode ? 'Jasny motyw' : 'Ciemny motyw'}
                      >
                        {darkMode ? '🌞' : '🌙'}
                      </button>
                      <button 
                        onClick={() => setUser(null)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                        title="Wyloguj się"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414L5.414 4H15a1 1 0 100-2H3z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M7 3a1 1 0 011-1h7a2 2 0 012 2v12a2 2 0 01-2 2H8a1 1 0 110-2h6a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : isSidebarOpen ? (
            <div className="space-y-2">
              <Link 
                href="/login"
                className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
              >
                Zaloguj się
              </Link>
              <Link 
                href="/register"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
              >
                Zarejestruj się
              </Link>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/login"
                className="w-8 h-8 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center text-sm font-medium transition-colors"
                title="Zaloguj się"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="/register"
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center text-sm font-medium transition-colors"
                title="Zarejestruj się"
              >
                +
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
