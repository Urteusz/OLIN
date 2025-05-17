'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

type Pronouns = 'SHE_HER' | 'HE_HIM' | 'THEY_THEM' | 'OTHER' | 'PREFER_NOT_TO_SAY';
type FavoriteColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK' | 'WHITE' | 'ORANGE' | 'PURPLE';
type Hobby = 'SPORTS' | 'READING' | 'GAMING' | 'MUSIC' | 'ART_CRAFT' | 'TRAVELING' | 'COOKING_BAKING' | 'GARDENING' | 'MOVIES_TV_SHOWS' | 'TECHNOLOGY_CODING' | 'PHOTOGRAPHY' | 'DANCING' | 'WRITING' | 'FISHING' | 'HIKING' | 'YOGA' | 'COLLECTING' | 'BOARD_GAMES';
type AgeRange = 'AGE_13_17' | 'AGE_18_24' | 'AGE_25_34' | 'AGE_35_44' | 'AGE_45_54' | 'AGE_55_64' | 'AGE_65_80' | 'AGE_80_PLUS' | 'PREFER_NOT_TO_SAY';
type ClosePersonPresence = 'YES_ROMANTIC_PARTNER' | 'YES_CLOSE_FRIEND' | 'YES_FAMILY_MEMBER' | 'YES_MULTIPLE_TYPES' | 'NO_CLOSE_PERSON' | 'ITS_COMPLICATED';
type FamilyRelationshipQuality = 'VERY_GOOD' | 'GOOD' | 'NEUTRAL' | 'DIFFICULT' | 'VERY_DIFFICULT' | 'NO_CONTACT';
type CloseRelationshipsQuality = 'VERY_GOOD' | 'GOOD' | 'NEUTRAL' | 'DIFFICULT' | 'VERY_DIFFICULT' | 'NOT_APPLICABLE';

interface FormData {
  pronouns: Pronouns | '';
  favoriteColor: FavoriteColor | '';
  hobby: Hobby | '';
  ageRange: AgeRange | '';
  closePersonPresence: ClosePersonPresence | '';
  familyRelationshipQuality: FamilyRelationshipQuality | '';
  closeRelationshipsQuality: CloseRelationshipsQuality | '';
}

export default function InitialUserSurvey() {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    pronouns: '',
    favoriteColor: '',
    hobby: '',
    ageRange: '',
    closePersonPresence: '',
    familyRelationshipQuality: '',
    closeRelationshipsQuality: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is loaded
  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (isClient && !isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router, isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateUUID = () => {
    // Generate a random UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const convertToUuid = (id: string): string => {
    // If it's already a UUID, return as is
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return id;
    }
    // Convert numeric ID to a UUID-like string
    const paddedId = id.padStart(8, '0').slice(0, 8);
    return `00000000-0000-1000-8000-${paddedId}00000000`.toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!user?.id) {
      setError('Musisz być zalogowany, aby wypełnić ankietę.');
      setIsSubmitting(false);
      return;
    }
    
    const userId = convertToUuid(user.id);
    
    const requestBody = {
      userId: userId,
      ...formData
    };

    console.log('Sending request with body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('http://localhost:8080/api/initial-user-surveys/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseData);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${responseData || 'No error details'}`);
      }

      // Store the user ID in localStorage for future requests
      localStorage.setItem('userId', userId);
      
      // Redirect to the main dashboard after successful submission
      router.push('/');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelectField = (
    name: keyof FormData,
    label: string,
    options: { value: string; label: string }[],
    required = true
  ) => (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        required
      >
        <option value="">Wybierz opcję</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const pronounsOptions: { value: Pronouns; label: string }[] = [
    { value: 'SHE_HER', label: 'Ona/Jej' },
    { value: 'HE_HIM', label: 'On/Jego' },
    { value: 'THEY_THEM', label: 'Oni/Ich' },
    { value: 'OTHER', label: 'Inne' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Wolę nie podawać' },
  ];

  const colorOptions: { value: FavoriteColor; label: string }[] = [
    { value: 'RED', label: 'Czerwony' },
    { value: 'BLUE', label: 'Niebieski' },
    { value: 'GREEN', label: 'Zielony' },
    { value: 'YELLOW', label: 'Żółty' },
    { value: 'BLACK', label: 'Czarny' },
    { value: 'WHITE', label: 'Biały' },
    { value: 'ORANGE', label: 'Pomarańczowy' },
    { value: 'PURPLE', label: 'Fioletowy' },
  ];

  const hobbyOptions: { value: Hobby; label: string }[] = [
    { value: 'SPORTS', label: 'Sport' },
    { value: 'READING', label: 'Czytanie' },
    { value: 'GAMING', label: 'Gry' },
    { value: 'MUSIC', label: 'Muzyka' },
    { value: 'ART_CRAFT', label: 'Sztuka i Rękodzieło' },
    { value: 'TRAVELING', label: 'Podróże' },
    { value: 'COOKING_BAKING', label: 'Gotowanie/Pieczenie' },
    { value: 'GARDENING', label: 'Ogród' },
    { value: 'MOVIES_TV_SHOWS', label: 'Filmy/Seriale' },
    { value: 'TECHNOLOGY_CODING', label: 'Technologia/Programowanie' },
    { value: 'PHOTOGRAPHY', label: 'Fotografia' },
    { value: 'DANCING', label: 'Taniec' },
    { value: 'WRITING', label: 'Pisanie' },
    { value: 'FISHING', label: 'Wędkarstwo' },
    { value: 'HIKING', label: 'Wędrówki' },
    { value: 'YOGA', label: 'Joga' },
    { value: 'COLLECTING', label: 'Kolekcjonerstwo' },
    { value: 'BOARD_GAMES', label: 'Gry planszowe' },
  ];

  const ageRangeOptions: { value: AgeRange; label: string }[] = [
    { value: 'AGE_13_17', label: '13-17 lat' },
    { value: 'AGE_18_24', label: '18-24 lat' },
    { value: 'AGE_25_34', label: '25-34 lat' },
    { value: 'AGE_35_44', label: '35-44 lat' },
    { value: 'AGE_45_54', label: '45-54 lat' },
    { value: 'AGE_55_64', label: '55-64 lat' },
    { value: 'AGE_65_80', label: '65-80 lat' },
    { value: 'AGE_80_PLUS', label: '80+ lat' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Wolę nie podawać' },
  ];

  const closePersonOptions: { value: ClosePersonPresence; label: string }[] = [
    { value: 'YES_ROMANTIC_PARTNER', label: 'Tak, partner/partnerka' },
    { value: 'YES_CLOSE_FRIEND', label: 'Tak, bliski przyjaciel' },
    { value: 'YES_FAMILY_MEMBER', label: 'Tak, członek rodziny' },
    { value: 'YES_MULTIPLE_TYPES', label: 'Tak, kilka z powyższych' },
    { value: 'NO_CLOSE_PERSON', label: 'Nie, nie mam bliskiej osoby' },
    { value: 'ITS_COMPLICATED', label: 'To skomplikowane' },
  ];

  const relationshipQualityOptions: { value: FamilyRelationshipQuality; label: string }[] = [
    { value: 'VERY_GOOD', label: 'Bardzo dobre' },
    { value: 'GOOD', label: 'Dobre' },
    { value: 'NEUTRAL', label: 'Neutralne' },
    { value: 'DIFFICULT', label: 'Trudne' },
    { value: 'VERY_DIFFICULT', label: 'Bardzo trudne' },
    { value: 'NO_CONTACT', label: 'Brak kontaktu' },
  ];

  const closeRelationshipQualityOptions = [
    ...relationshipQualityOptions.filter(opt => opt.value !== 'NO_CONTACT'),
    { value: 'NOT_APPLICABLE', label: 'Nie dotyczy' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ankieta wstępna</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Dziękujemy za rejestrację! Prosimy o wypełnienie krótkiej ankiety, abyśmy mogli lepiej Cię poznać.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            {renderSelectField('pronouns', 'Jakich zaimków wolałabyś/wolałbyś używać?', pronounsOptions)}
            {renderSelectField('favoriteColor', 'Jaki jest Twój ulubiony kolor?', colorOptions)}
            {renderSelectField('hobby', 'Jakie jest Twoje główne hobby?', hobbyOptions)}
            {renderSelectField('ageRange', 'W jakim jesteś przedziale wiekowym?', ageRangeOptions)}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">O Twoich relacjach</h2>
              {renderSelectField(
                'closePersonPresence',
                'Czy masz w życiu bliską osobę, na której możesz polegać?',
                closePersonOptions
              )}
              {renderSelectField(
                'familyRelationshipQuality',
                'Jak oceniasz swoje relacje z rodziną?',
                relationshipQualityOptions as { value: FamilyRelationshipQuality; label: string }[]
              )}
              {renderSelectField(
                'closeRelationshipsQuality',
                'Jak oceniasz jakość swoich bliskich relacji?',
                closeRelationshipQualityOptions as { value: CloseRelationshipsQuality; label: string }[]
              )}
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Zapisywanie...' : 'Zapisz odpowiedzi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
