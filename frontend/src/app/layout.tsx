import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './RootLayoutClient';
import { UserProvider } from '../context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hackaton App',
  description: 'Aplikacja stworzona na hackaton',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </UserProvider>
      </body>
    </html>
  );
}
