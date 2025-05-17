'use client';

import { useState } from 'react';
import { useUser } from '../../context/UserContext';

interface Question {
    id: number;
    text: string;
    value: number;
}

export default function DailyQuestionsPage() {
    const { user } = useUser();
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: 'Poziom zadowolenia', value: 3 },
        { id: 2, text: 'Stan fizyczny', value: 3 },
        { id: 3, text: 'Poziom motywacji', value: 3 },
        { id: 4, text: 'Poziom skupienia', value: 3 },
        { id: 5, text: 'Chęć odkrywania', value: 3 }
    ]);

    const handleSliderChange = (id: number, value: number) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === id ? { ...q, value } : q
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            alert('Musisz być zalogowany, aby odpowiedzieć na pytania.');
            return;
        }

        // Validate that all questions have been answered
        if (questions.some(q => q.value < 1 || q.value > 5)) {
            alert('Proszę upewnić się, że wszystkie odpowiedzi są w skali od 1 do 5.');
            return;
        }

        if (!user?.id) {
            throw new Error('Nie znaleziono użytkownika. Zaloguj się ponownie.');
        }
        
        // Log the user object to see what we're working with
        console.log('Current user:', user);
        
        // Simple validation that we have some kind of ID
        if (!user.id || typeof user.id !== 'string') {
            throw new Error('Nieprawidłowy identyfikator użytkownika');
        }

        const answers = questions.map(q => q.value);
        const now = new Date();
        
        // Convert numeric ID to UUID format if needed
        const convertToUuid = (id: string): string => {
            // If it's already a UUID, return as is
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
                return id;
            }
            // Convert numeric ID to a UUID-like string
            const paddedId = id.padStart(8, '0').slice(0, 8);
            return `00000000-0000-1000-8000-${paddedId}00000000`.toLowerCase();
        };

        // Create survey data with explicit types
        const surveyData = {
            userId: convertToUuid(user.id),
            answer1: answers[0],
            answer2: answers[1],
            answer3: answers[2],
            answer4: answers[3],
            answer5: answers[4],
            dateFilled: now.toISOString()
        };

        console.log('Sending survey data to server:', {
            ...surveyData,
            originalUserId: user.id,
            convertedToUuid: surveyData.userId !== user.id
        });

        try {
            const response = await fetch('http://localhost:8080/api/daily-user-surveys/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(surveyData)
            });

            // Pobieramy odpowiedź jako tekst
            const responseText = await response.text();
            let responseData = { message: responseText };
            let errorMessage = responseText;
            
            // Próbujemy sparsować odpowiedź jako JSON, ale nie przejmujemy się, jeśli się nie uda
            try {
                const parsed = JSON.parse(responseText);
                if (typeof parsed === 'object' && parsed !== null) {
                    responseData = parsed;
                    errorMessage = parsed.message || responseText;
                }
            } catch (e) {
                // To nie jest błąd - po prostu używamy odpowiedzi tekstowej
                console.log('Otrzymano odpowiedź tekstową:', responseText);
            }

            if (!response.ok) {
                const errorDetails = {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: responseData,
                    rawResponse: responseText
                };
                console.error('Full server error details:', JSON.stringify(errorDetails, null, 2));
                
                // If we have a detailed error message from the backend, show it
                if (responseData.message || responseData.error) {
                    throw new Error(`Błąd ${response.status}: ${errorMessage}`);
                }
                
                // Otherwise show a generic error with the status
                throw new Error(`Błąd serwera (${response.status}): ${response.statusText || 'Nieznany błąd'}`);
            }

            // Show success message
            alert('Dziękujemy! Twoje odpowiedzi zostały zapisane pomyślnie.');
            
            // Reset form after successful submission
            setQuestions(prev => prev.map(q => ({ ...q, value: 1 }))); // Reset to 1 instead of 0
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
            console.error('Error submitting survey:', error);
            alert(`Wystąpił błąd: ${errorMessage}\nProszę spróbować ponownie.`);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Pytania codzienne</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-6">
                {questions.map((question) => (
                    <div key={question.id} className="space-y-1">
                        <label htmlFor={`question-${question.id}`} className="block text-sm font-medium">
                            {question.text}
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="range"
                                id={`question-${question.id}`}
                                min="1"
                                max="5"
                                step="1"
                                value={question.value}
                                onChange={(e) => handleSliderChange(question.id, parseInt(e.target.value))}
                                className="w-3/4"
                            />
                            <span className="text-sm">{question.value}</span>
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Zapisz odpowiedzi
                </button>
            </form>
        </div>
    );
}
