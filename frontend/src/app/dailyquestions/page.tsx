'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSmile, FaRunning, FaFire, FaBrain, FaCompass, FaCheck } from 'react-icons/fa';
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import confetti from 'canvas-confetti';

// Define color scheme to match the main page
const QUESTION_COLORS = {
  satisfaction: '#4F46E5', // indigo
  physical: '#10B981',     // emerald
  motivation: '#F59E0B',   // amber
  focus: '#DB2777',        // pink
  discovery: '#2563EB',    // blue
};

// Define gradient backgrounds for cards
const GRADIENT_BACKGROUNDS = {
  satisfaction: 'from-indigo-500/10 to-indigo-500/5',
  physical: 'from-emerald-500/10 to-emerald-500/5',
  motivation: 'from-amber-500/10 to-amber-500/5',
  focus: 'from-pink-500/10 to-pink-500/5',
  discovery: 'from-blue-500/10 to-blue-500/5',
};

interface Question {
    id: number;
    text: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    key: string;
}

export default function DailyQuestionsPage() {
    const { user } = useUser();
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: 'Poziom zadowolenia', value: 3, icon: <FaSmile />, color: QUESTION_COLORS.satisfaction, key: 'satisfaction' },
        { id: 2, text: 'Stan fizyczny', value: 3, icon: <FaRunning />, color: QUESTION_COLORS.physical, key: 'physical' },
        { id: 3, text: 'Poziom motywacji', value: 3, icon: <FaFire />, color: QUESTION_COLORS.motivation, key: 'motivation' },
        { id: 4, text: 'Poziom skupienia', value: 3, icon: <FaBrain />, color: QUESTION_COLORS.focus, key: 'focus' },
        { id: 5, text: 'Chęć odkrywania', value: 3, icon: <FaCompass />, color: QUESTION_COLORS.discovery, key: 'discovery' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    // Reset animation state when component unmounts
    useEffect(() => {
        return () => {
            setShowSuccess(false);
            setActiveQuestion(null);
        };
    }, []);

    const handleSliderChange = (id: number, value: number) => {
        // Create a new array to avoid reference issues
        const updatedQuestions = [...questions];
        // Find the specific question to update
        const questionIndex = updatedQuestions.findIndex(q => q.id === id);
        if (questionIndex !== -1) {
            // Create a new question object to avoid mutation
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                value: value
            };
            // Update state with the new array
            setQuestions(updatedQuestions);
        }

        // Set this question as active for animation
        setActiveQuestion(id);
        // Reset active question after animation
        setTimeout(() => setActiveQuestion(null), 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user?.id) {
            alert('Musisz być zalogowany, aby odpowiedzieć na pytania.');
            setIsSubmitting(false);
            return;
        }

        // Validate that all questions have been answered
        if (questions.some(q => q.value < 1 || q.value > 5)) {
            alert('Proszę upewnić się, że wszystkie odpowiedzi są w skali od 1 do 5.');
            setIsSubmitting(false);
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
            } catch {
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
                if (responseData.message) {
                    throw new Error(`Błąd ${response.status}: ${errorMessage}`);
                }

                // Otherwise show a generic error with the status
                throw new Error(`Błąd serwera (${response.status}): ${response.statusText || 'Nieznany błąd'}`);
            }

            // Show success animation and trigger confetti
            setShowSuccess(true);
            triggerConfetti();

            // Reset form after successful submission
            setTimeout(() => {
                setQuestions(prev => prev.map(q => ({ ...q, value: 1 })));
                setShowSuccess(false);
            }, 2500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
            console.error('Error submitting survey:', error);
            alert(`Wystąpił błąd: ${errorMessage}\nProszę spróbować ponownie.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to trigger confetti effect
    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: Object.values(QUESTION_COLORS),
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="relative mb-10">
                <motion.div
                    className="absolute -z-10 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-300/20 to-blue-300/10 blur-3xl"
                    style={{ top: '-100px', left: '-50px' }}
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute -z-10 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-300/10 to-teal-300/5 blur-3xl"
                    style={{ top: '-80px', right: '-30px' }}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                    }}
                />

                <motion.div 
                    className="flex flex-col items-center text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                        Pytania Codzienne
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                        Odpowiedz na kilka pytań, aby śledzić swoje samopoczucie i postępy. Twoje odpowiedzi pomogą nam lepiej dostosować rekomendacje.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="md:col-span-2">
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="space-y-6">
                            {questions.map((question) => (
                                <motion.div 
                                    key={question.id} 
                                    className={`p-4 rounded-xl bg-gradient-to-br ${GRADIENT_BACKGROUNDS[question.key as keyof typeof GRADIENT_BACKGROUNDS]} border border-gray-200 dark:border-gray-700 shadow-sm`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: question.id * 0.1 }}
                                    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div 
                                            className="text-xl p-2 rounded-full" 
                                            style={{ 
                                                color: 'white',
                                                backgroundColor: question.color,
                                                boxShadow: `0 0 10px ${question.color}40`
                                            }}
                                        >
                                            {question.icon}
                                        </div>
                                        <label 
                                            htmlFor={`question-${question.id}`} 
                                            className="block text-base font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {question.text}
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3 mt-4">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">1</span>
                                        <div className="flex-1 relative">
                                            {/* Track background */}
                                            <div 
                                                className="absolute inset-0 h-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                                                style={{ top: '50%', transform: 'translateY(-50%)' }}
                                            ></div>

                                            {/* Filled track */}
                                            <div 
                                                className="absolute h-2 rounded-lg"
                                                style={{ 
                                                    top: '50%', 
                                                    transform: 'translateY(-50%)',
                                                    width: `${((question.value - 1) / 4) * 100}%`,
                                                    background: `linear-gradient(to right, ${question.color}90, ${question.color})`,
                                                    boxShadow: `0 0 10px ${question.color}60`
                                                }}
                                            ></div>

                                            {/* Actual slider input (invisible but functional) */}
                                            <input
                                                type="range"
                                                id={`question-${question.id}`}
                                                min="1"
                                                max="5"
                                                step="1"
                                                value={question.value}
                                                onChange={(e) => handleSliderChange(question.id, parseInt(e.target.value))}
                                                className="w-full h-2 opacity-0 cursor-pointer relative z-10"
                                            />

                                            {/* Animated dot on the slider */}
                                            <motion.div 
                                                className="absolute top-1/2 w-6 h-6 rounded-full shadow-lg border-2 border-white transform -translate-y-1/2 -translate-x-1/2 z-20"
                                                style={{ 
                                                    backgroundColor: question.color,
                                                    left: `${((question.value - 1) / 4) * 100}%`,
                                                    boxShadow: `0 0 15px ${question.color}80`
                                                }}
                                                animate={activeQuestion === question.id ? 
                                                    { scale: [1, 1.3, 1], boxShadow: [`0 0 15px ${question.color}80`, `0 0 25px ${question.color}`, `0 0 15px ${question.color}80`] } : 
                                                    { scale: 1 }
                                                }
                                                transition={{ duration: 0.5 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            />

                                            {/* Value markers */}
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <div 
                                                    key={val}
                                                    className={`absolute top-1/2 w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 transform -translate-y-1/2 ${val <= question.value ? 'opacity-0' : 'opacity-100'}`}
                                                    style={{ 
                                                        left: `${((val - 1) / 4) * 100}%`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">5</span>
                                        <motion.div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md"
                                            style={{ backgroundColor: question.color }}
                                            animate={{ 
                                                scale: activeQuestion === question.id ? [1, 1.2, 1] : 1,
                                                boxShadow: activeQuestion === question.id ? 
                                                    [`0 4px 12px ${question.color}40`, `0 8px 20px ${question.color}80`, `0 4px 12px ${question.color}40`] : 
                                                    `0 4px 12px ${question.color}40`
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {question.value}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            className="pt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-xl text-white font-medium shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'
                                }`}
                            >
                                {/* Background shine effect */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>

                                {isSubmitting ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg">Zapisywanie</span>
                                        {/* Loading dots */}
                                        <div className="flex space-x-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full bg-white"
                                                    animate={{ 
                                                        y: [0, -6, 0],
                                                        opacity: [0.5, 1, 0.5]
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        delay: i * 0.1,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg">Zapisz odpowiedzi</span>
                                        <motion.div
                                            whileHover={{ rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white bg-opacity-20 p-2 rounded-full"
                                        >
                                            <FaCheck />
                                        </motion.div>
                                    </>
                                )}

                                {/* Subtle shadow glow */}
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                    style={{ 
                                        boxShadow: "0 0 20px 5px rgba(79, 70, 229, 0.3)",
                                    }}
                                ></div>
                            </button>
                        </motion.div>
                    </motion.form>
                </div>

                {/* Visualization Section */}
                <div className="md:col-span-1">
                    <motion.div 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                    >
                        {/* Background decoration */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20 opacity-50"></div>
                        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 opacity-50"></div>

                        <motion.h2 
                            className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                            Wizualizacja odpowiedzi
                        </motion.h2>

                        <motion.div 
                            className="flex-1 flex items-center justify-center relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {/* Radar chart background glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-indigo-500/5 blur-xl"></div>
                            </div>

                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart outerRadius="80%" data={questions}>
                                    <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                                    <PolarAngleAxis 
                                        dataKey="text" 
                                        tick={{ fill: '#6b7280', fontSize: 10 }}
                                        tickLine={false}
                                    />
                                    <PolarRadiusAxis 
                                        angle={90} 
                                        domain={[0, 5]} 
                                        tick={{ fill: '#6b7280', fontSize: 10 }}
                                        tickCount={6}
                                        axisLine={false}
                                    />
                                    <Radar 
                                        name="Twoje odpowiedzi" 
                                        dataKey="value" 
                                        stroke="#4F46E5" 
                                        fill="#4F46E5" 
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div 
                            className="mt-6 space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Legenda:</h3>
                            {questions.map((q) => (
                                <motion.div 
                                    key={q.id} 
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                    whileHover={{ x: 3 }}
                                >
                                    <div className="flex items-center justify-center">
                                        <div 
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                                            style={{ backgroundColor: q.color }}
                                        >
                                            {q.value}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                            {q.icon}
                                            <span className="ml-2">{q.text}</span>
                                        </div>
                                        <div className="w-full h-1 mt-1 rounded-full bg-gray-200 dark:bg-gray-600">
                                            <div 
                                                className="h-1 rounded-full" 
                                                style={{ 
                                                    width: `${(q.value / 5) * 100}%`,
                                                    backgroundColor: q.color
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl flex flex-col items-center relative overflow-hidden"
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Background gradient circles */}
                            <motion.div 
                                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/10"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 15, 0]
                                }}
                                transition={{ 
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            />
                            <motion.div 
                                className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/10"
                                animate={{ 
                                    scale: [1, 1.3, 1],
                                    rotate: [0, -15, 0]
                                }}
                                transition={{ 
                                    duration: 7,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 0.5
                                }}
                            />

                            {/* Success icon with animated ring */}
                            <div className="relative mb-6">
                                <motion.div 
                                    className="absolute inset-0 rounded-full"
                                    initial={{ boxShadow: "0 0 0 0px rgba(16, 185, 129, 0.6)" }}
                                    animate={{ boxShadow: "0 0 0 20px rgba(16, 185, 129, 0)" }}
                                    transition={{ 
                                        repeat: Infinity,
                                        duration: 1.5,
                                        repeatDelay: 0.5
                                    }}
                                />
                                <motion.div 
                                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl shadow-lg shadow-green-500/30"
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: [0, 1.2, 1], rotate: [30, 0] }}
                                    transition={{ 
                                        duration: 0.6,
                                        times: [0, 0.6, 1],
                                        ease: "easeOut"
                                    }}
                                >
                                    <FaCheck />
                                </motion.div>
                            </div>

                            <motion.h2 
                                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Dziękujemy!
                            </motion.h2>

                            <motion.p 
                                className="text-gray-600 dark:text-gray-300 text-center max-w-xs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                Twoje odpowiedzi zostały zapisane pomyślnie. Dziękujemy za poświęcony czas!
                            </motion.p>

                            {/* Animated dots */}
                            <div className="flex space-x-2 mt-6">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-green-500"
                                        initial={{ opacity: 0.3 }}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
