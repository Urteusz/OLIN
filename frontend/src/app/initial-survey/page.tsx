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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const pronounsOptions: { value: Pronouns; label: string }[] = [
    { value: 'SHE_HER', label: 'She/Her' },
    { value: 'HE_HIM', label: 'He/Him' },
    { value: 'THEY_THEM', label: 'They/Them' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ];

  const colorOptions: { value: FavoriteColor; label: string }[] = [
    { value: 'RED', label: 'Red' },
    { value: 'BLUE', label: 'Blue' },
    { value: 'GREEN', label: 'Green' },
    { value: 'YELLOW', label: 'Yellow' },
    { value: 'BLACK', label: 'Black' },
    { value: 'WHITE', label: 'White' },
    { value: 'ORANGE', label: 'Orange' },
    { value: 'PURPLE', label: 'Purple' },
  ];

  const hobbyOptions: { value: Hobby; label: string }[] = [
    { value: 'SPORTS', label: 'Sports' },
    { value: 'READING', label: 'Reading' },
    { value: 'GAMING', label: 'Gaming' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'ART_CRAFT', label: 'Art & Craft' },
    { value: 'TRAVELING', label: 'Traveling' },
    { value: 'COOKING_BAKING', label: 'Cooking/Baking' },
    { value: 'GARDENING', label: 'Gardening' },
    { value: 'MOVIES_TV_SHOWS', label: 'Movies/TV Shows' },
    { value: 'TECHNOLOGY_CODING', label: 'Technology/Coding' },
    { value: 'PHOTOGRAPHY', label: 'Photography' },
    { value: 'DANCING', label: 'Dancing' },
    { value: 'WRITING', label: 'Writing' },
    { value: 'FISHING', label: 'Fishing' },
    { value: 'HIKING', label: 'Hiking' },
    { value: 'YOGA', label: 'Yoga' },
    { value: 'COLLECTING', label: 'Collecting' },
    { value: 'BOARD_GAMES', label: 'Board Games' },
  ];

  const ageRangeOptions: { value: AgeRange; label: string }[] = [
    { value: 'AGE_13_17', label: '13-17 years' },
    { value: 'AGE_18_24', label: '18-24 years' },
    { value: 'AGE_25_34', label: '25-34 years' },
    { value: 'AGE_35_44', label: '35-44 years' },
    { value: 'AGE_45_54', label: '45-54 years' },
    { value: 'AGE_55_64', label: '55-64 years' },
    { value: 'AGE_65_80', label: '65-80 years' },
    { value: 'AGE_80_PLUS', label: '80+ years' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ];

  const closePersonOptions: { value: ClosePersonPresence; label: string }[] = [
    { value: 'YES_ROMANTIC_PARTNER', label: 'Yes, I have a romantic partner' },
    { value: 'YES_CLOSE_FRIEND', label: 'Yes, I have a close friend' },
    { value: 'YES_FAMILY_MEMBER', label: 'Yes, I have a family member' },
    { value: 'YES_MULTIPLE_TYPES', label: 'Yes, multiple of the above' },
    { value: 'NO_CLOSE_PERSON', label: 'No, I don\'t have a close person' },
    { value: 'ITS_COMPLICATED', label: 'It\'s complicated' },
  ];

  const relationshipQualityOptions: { value: FamilyRelationshipQuality | CloseRelationshipsQuality; label: string }[] = [
    { value: 'VERY_GOOD', label: 'Very good' },
    { value: 'GOOD', label: 'Good' },
    { value: 'NEUTRAL', label: 'Neutral' },
    { value: 'DIFFICULT', label: 'Difficult' },
    { value: 'VERY_DIFFICULT', label: 'Very difficult' },
    { value: 'NO_CONTACT', label: 'No contact' },
  ];

  const closeRelationshipQualityOptions = [
    ...relationshipQualityOptions.filter(opt => opt.value !== 'NO_CONTACT'),
    { value: 'NOT_APPLICABLE', label: 'Not applicable' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Initial User Survey</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderSelectField('pronouns', 'What are your preferred pronouns?', pronounsOptions)}
          {renderSelectField('favoriteColor', 'What is your favorite color?', colorOptions)}
          {renderSelectField('hobby', 'What is your main hobby?', hobbyOptions)}
          {renderSelectField('ageRange', 'What is your age range?', ageRangeOptions)}
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">About Your Relationships</h2>
            {renderSelectField(
              'closePersonPresence',
              'Do you have a close person in your life you can rely on?',
              closePersonOptions
            )}
            {renderSelectField(
              'familyRelationshipQuality',
              'How would you describe your relationship with your family?',
              relationshipQualityOptions as { value: FamilyRelationshipQuality; label: string }[]
            )}
            {renderSelectField(
              'closeRelationshipsQuality',
              'How would you rate the quality of your close relationships?',
              closeRelationshipQualityOptions as { value: CloseRelationshipsQuality; label: string }[]
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
