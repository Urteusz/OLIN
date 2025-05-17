'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
// Simple text icons as fallback
const CheckIcon = () => <span>✓</span>;
const ClockIcon = ({ className = '' }: { className?: string }) => (
  <span className={className}>🕒</span>
);

// Komponent dla płynnego rozwijania
const Collapsible = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Ustawiamy wysokość na dokładną wartość przed animacją
      setHeight(contentRef.current.scrollHeight + 'px');
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className="overflow-hidden transition-all duration-600 ease-in-out"
      style={{ maxHeight: isOpen ? '1000px' : '0px', opacity: isOpen ? 1 : 0 }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

interface Task {
  id: number;
  title: string;
  description: string;
  details: string;
  estimatedTime: string; // e.g., "30 min", "2 godziny"
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskToComplete, setTaskToComplete] = useState<number | null>(null);
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);

  // Simulate fetching tasks from an API
  useEffect(() => {
    const fetchTasks = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app, this would come from your backend
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Przygotować prezentację',
          description: 'Prezentacja dla klienta',
          details: 'Przygotować szczegółową prezentację dotyczącą postępów projektu. Uwzględnić najnowsze dane i statystyki. Dodać sekcję z wnioskami i rekomendacjami.',
          estimatedTime: '2 godziny',
          completed: false
        },
        {
          id: 2,
          title: 'Zadzwonić do dostawcy',
          description: 'Potwierdzenie dostawy',
          details: 'Skontaktować się z dostawcą w sprawie zamówienia #12345. Potwierdzić termin dostawy i uzgodnić szczegóły odbioru. Zapytać o możliwość wcześniejszego terminu.',
          estimatedTime: '30 minut',
          completed: false
        },
        {
          id: 3,
          title: 'Zrobić zakupy spożywcze',
          description: 'Lista zakupów na tydzień',
          details: 'Kupić: mleko, jajka, chleb, owoce, warzywa, mięso, ryż, makaron, sery, woda mineralna. Sprawdzić daty ważności i wybierać produkty świeże.',
          estimatedTime: '1 godzina',
          completed: false
        },
        {
          id: 4,
          title: 'Przegląd techniczny samochodu',
          description: 'Wizyta u mechanika',
          details: 'Umówić przegląd techniczny samochodu. Sprawdzić stan hamulców, poziom płynów, ciśnienie w oponach. Zapytać o konieczne wymiany części eksploatacyjnych.',
          estimatedTime: '1.5 godziny',
          completed: false
        },
      ];

      setTasks(mockTasks);
      setIsLoading(false);
    };

    fetchTasks();
  }, []);

  const confirmTaskCompletion = (taskId: number) => {
    setTaskToComplete(taskId);
  };

  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      spread: 90,
      ticks: 100,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const completeTask = (confirmed: boolean) => {
    if (confirmed && taskToComplete) {
      setTasks(tasks.map(task => 
        task.id === taskToComplete ? { ...task, completed: true } : task
      ));
      fireConfetti();
    }
    setTaskToComplete(null);
  };

  const toggleTaskCompletion = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Jeśli zadanie jest już ukończone, nie robimy nic
    if (task.completed) return;
    
    // Tylko dla niezakończonych zadań pokazujemy potwierdzenie
    confirmTaskCompletion(taskId);
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // All tasks are for today, no need for date formatting

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Lista zadań</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Podział zadań na dwie grupy
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const renderTaskItem = (task: Task) => (
    <li key={task.id} className="mb-3 last:mb-0">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all px-5 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-100 dark:border-gray-700"
        onClick={() => toggleTaskExpansion(task.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="relative mr-3"
              onMouseEnter={() => !task.completed && setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskCompletion(task.id);
                }}
                className="relative z-10"
              >
                <button
                  className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  aria-label={task.completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
                >
                  {task.completed && <CheckIcon />}
                </button>
              </div>
              {hoveredTask === task.id && !task.completed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-20 dark:bg-gray-700 dark:border dark:border-gray-600">
                  Zaznacz jako zrealizowane
                </div>
              )}
            </div>
            <div>
              <p className={`text-base font-medium ${
                task.completed 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {task.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
              <ClockIcon className="inline-block mr-1.5" />
              <span className="font-medium">{task.estimatedTime}</span>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform duration-300 p-1 transform"
              style={{ transform: expandedTaskId === task.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskExpansion(task.id);
              }}
            >
              ▼
            </button>
          </div>
        </div>
        
        <Collapsible isOpen={expandedTaskId === task.id}>
          <div className="p-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-3">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Szczegóły zadania:</h4>
            <p className="text-gray-700 dark:text-gray-300">{task.details}</p>
          </div>
        </Collapsible>
      </div>
    </li>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zadania na dziś</h1>
        <div className="text-sm text-gray-500">
          {completedTasks.length} z {tasks.length} ukończonych
        </div>
      </div>

      {/* Sekcja z aktywnymi zadaniami */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Do zrobienia</h2>
        {activeTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">Brak zadań do wykonania. Świetna robota!</p>
        ) : (
          <ul className="space-y-3">
            {activeTasks.map(renderTaskItem)}
          </ul>
        )}
      </div>

      {/* Sekcja z zakończonymi zadaniami */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Zrobione</h2>
          <ul className="space-y-3">
            {completedTasks.map(renderTaskItem)}
          </ul>
        </div>
      )}

      {/* Modal potwierdzenia */}
      {taskToComplete !== null && (
        <div 
          className="fixed inset-0 bg-white/40 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setTaskToComplete(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Potwierdź zakończenie zadania</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Czy na pewno chcesz oznaczyć to zadanie jako zrealizowane?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setTaskToComplete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  completeTask(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Potwierdź
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
