'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    email: '',
    preferredLanguage: 'pol'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);

    try {
      try {
        const response = await fetch('http://localhost:8080/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            email: formData.email,
            preferredLanguage: formData.preferredLanguage
          })
        });

        // Read response body just once
        const responseText = await response.text();
        console.log('Full response:', responseText);

        if (!response.ok) {
          throw new Error(`Błąd rejestracji: ${responseText}`);
        }

        // Try to parse as JSON first
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          // If not JSON, use the raw text
          responseData = responseText;
        }
        console.log('Registration response:', responseData);

        // Extract user data from the response
        let userId: string;
        
        // Try to get the full UUID from the response
        if (responseData.id) {
          // If the response has an ID field, use it
          userId = responseData.id;
        } else if (typeof responseData === 'string') {
          // Try to extract UUID from the message
          const uuidMatch = responseData.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
          if (uuidMatch) {
            userId = uuidMatch[0];
          } else {
            // Fallback to the old method if no UUID found
            const idMatch = responseData.match(/ID:\s*(\S+)/);
            userId = idMatch ? idMatch[1] : 'unknown';
          }
        } else {
          throw new Error('Nieprawidłowa odpowiedź serwera');
        }

        const userData = {
          id: userId,
          name: formData.firstName || formData.username,
          email: formData.email,
          avatar: '👤'
        };
        
        console.log('User data to be saved:', userData);

        // Ustawiamy użytkownika w kontekście
        setUser(userData);

        // Przekierowujemy użytkownika
        router.push('/');
      } catch (err) {
        setError('Błąd rejestracji. Spróbuj ponownie.');
        console.error('Registration error:', err);
      }

      // Przekierowujemy na stronę główną
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error
          ? err.message
          : 'Wystąpił nieznany błąd podczas rejestracji';
      setError(errorMessage);
      console.error('Błąd rejestracji:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Zarejestruj nowe konto
            </h2>
          </div>
          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Nazwa użytkownika</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Nazwa użytkownika"
                    value={formData.username}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="firstName" className="sr-only">Imię</label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Imię"
                    value={formData.firstName}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Adres email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Adres email"
                    value={formData.email}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Hasło</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Hasło"
                    value={formData.password}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Potwierdź hasło</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Potwierdź hasło"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Masz już konto?{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Zaloguj się
                </a>
              </p>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Wersja API: {JSON.stringify({
              username: formData.username,
              password: formData.password,
              firstName: formData.firstName,
              email: formData.email,
              preferredLanguage: formData.preferredLanguage
            }, null, 2)}
            </p>
          </div>
        </div>
      </div>
  );
};
