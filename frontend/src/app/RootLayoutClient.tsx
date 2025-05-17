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
  const { user: userData, setUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <div className="bg-gray-50 flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">Menu</h1>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
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
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    pathname === item.href 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          {userData ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {userData.avatar}
                </div>
                {isSidebarOpen && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium truncate" title={userData.name}>
                      {userData.name}
                    </p>
                    {userData.email && (
                      <p className="text-xs text-gray-400 truncate" title={userData.email}>
                        {userData.email}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 ml-2"
                title="Wyloguj się"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
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
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
