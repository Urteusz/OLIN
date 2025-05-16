'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Użytkownicy', href: '/users', icon: '👥' },
  { name: 'Ustawienia', href: '/settings', icon: '⚙️' },
  { name: 'Pomoc', href: '/help', icon: '❓' },
];

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

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
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              👤
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
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
