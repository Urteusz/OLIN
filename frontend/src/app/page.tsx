'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Define chart data types
interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface ChartDataset {
  id: string;
  label: string;
  color: string;
  active: boolean;
  data: number[];
}

const CHART_COLORS = {
  satisfaction: '#4F46E5',
  physical: '#10B981',
  motivation: '#F59E0B',
  focus: '#DB2777',
  average: '#6B7280',
  tasks: '#2563EB',
};

const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

const initialDatasets: ChartDataset[] = [
  {
    id: 'satisfaction',
    label: 'Poziom zadowolenia',
    color: CHART_COLORS.satisfaction,
    active: false,
    data: [5, 3, 3, 4, 1, 2, 5],
  },
  {
    id: 'physical',
    label: 'Stan fizyczny',
    color: CHART_COLORS.physical,
    active: false,
    data: [2, 3, 2, 4, 4, 1, 3],
  },
  {
    id: 'motivation',
    label: 'Motywacja',
    color: CHART_COLORS.motivation,
    active: false,
    data: [3, 4, 2, 4, 3, 4, 5],
  },
  {
    id: 'focus',
    label: 'Skupienie',
    color: CHART_COLORS.focus,
    active: false,
    data: [2, 3, 2, 1, 4, 3, 4],
  },
  {
    id: 'average',
    label: 'Średnia',
    color: CHART_COLORS.average,
    active: true,
    data: [3, 3.25, 2.25, 3.25, 3, 2.75, 4],
  },
  {
    id: 'tasks',
    label: 'Ukończone zadania',
    color: CHART_COLORS.tasks,
    active: false,
    data: [1, 3, 2, 1, 2, 3, 3],
  },
];

// Define tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: {
      name: string;
      [key: string]: string | number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {entry.name}: <span className="font-medium">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Streak data interface
interface StreakDay {
  day: string;
  date: string;
  completed: boolean;
}

// Mood distribution data for pie chart
const moodDistributionData = [
  { name: 'Bardzo dobrze', value: 35, color: '#4F46E5' },
  { name: 'Dobrze', value: 40, color: '#10B981' },
  { name: 'Neutralnie', value: 15, color: '#F59E0B' },
  { name: 'Słabo', value: 10, color: '#DB2777' },
];

// Progress data for radial bar chart
const progressData = [
  { name: 'Zadania', value: 78, fill: '#4F46E5' },
  { name: 'Ćwiczenia', value: 65, fill: '#10B981' },
  { name: 'Medytacja', value: 83, fill: '#F59E0B' },
];

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<ChartDataset[]>(initialDatasets);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [streakDays, setStreakDays] = useState<StreakDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState<boolean>(false);

  // Initialize streak data
  useEffect(() => {
    // Mock streak data - in a real app, this would come from an API
    const today = new Date();
    const mockStreakDays: StreakDay[] = [];

    // Generate last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format date as DD.MM
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      // Day name (first 3 letters)
      const dayNames = ['Nie', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
      const dayName = dayNames[date.getDay()];

      // Randomly determine if the day was completed (for demo purposes)
      // In a real app, this would be based on actual user activity
      let completed = Math.random() > 0.3; // 70% chance of completion

      // Make sure the last 5 days are completed for a nice streak
      if (i < 5) {
        completed = true;
      }

      mockStreakDays.push({
        day: dayName,
        date: formattedDate,
        completed
      });
    }

    setStreakDays(mockStreakDays);

    // Calculate current streak
    let streak = 0;
    for (let i = mockStreakDays.length - 1; i >= 0; i--) {
      if (mockStreakDays[i].completed) {
        streak++;
      } else {
        break;
      }
    }

    setCurrentStreak(streak);
    setLongestStreak(Math.max(streak, 7)); // Mock longest streak

    // Show streak animation
    setShowStreakAnimation(true);
    const timer = setTimeout(() => setShowStreakAnimation(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  // Prepare chart data for Recharts
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return DAYS.map((day, dayIndex) => {
      const dayData: ChartDataPoint = { name: day };

      datasets.forEach(ds => {
        if (ds.active || showAll) {
          dayData[ds.id] = ds.data[dayIndex];
        }
      });

      return dayData;
    });
  }, [datasets, showAll]);

  const toggleDataset = (id: string) => {
    setDatasets(prev => {
      const newDatasets = [...prev];
      const index = newDatasets.findIndex(ds => ds.id === id);

      if (index !== -1) {
        newDatasets[index] = {
          ...newDatasets[index],
          active: !newDatasets[index].active
        };
      }

      return newDatasets;
    });
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Calculate best day
  const bestDay = useMemo(() => {
    const daySums = DAYS.map((_, dayIndex) => {
      return datasets.reduce((sum, ds) => sum + ds.data[dayIndex], 0);
    });

    const maxSum = Math.max(...daySums);
    const bestDayIndex = daySums.indexOf(maxSum);

    return {
      day: DAYS[bestDayIndex],
      total: maxSum,
      stats: datasets.map(ds => ({
        name: ds.label,
        value: ds.data[bestDayIndex],
        color: ds.color
      }))
    };
  }, [datasets]);

  // Get active datasets for the chart
  const activeDatasets = useMemo(() => {
    return datasets.filter(ds => ds.active || showAll);
  }, [datasets, showAll]);

  return (
    <div className="space-y-6">
      {/* Streak Counter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Twoja seria</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Najdłuższa seria: </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{longestStreak} dni</span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: showStreakAnimation ? [1, 1.1, 1] : 1, 
                opacity: 1 
              }}
              transition={{ 
                duration: 0.5,
                scale: { duration: 0.3, times: [0, 0.5, 1] }
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-xs font-medium">DNI</div>
              </div>
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentStreak > 0 ? 'Świetna robota!' : 'Rozpocznij serię!'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentStreak > 0 
                  ? `Twoja seria trwa już ${currentStreak} ${currentStreak === 1 ? 'dzień' : currentStreak < 5 ? 'dni' : 'dni'}!` 
                  : 'Wykonaj dzisiejsze zadania, aby rozpocząć serię.'}
              </p>
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="grid grid-cols-7 gap-2">
            {streakDays.slice(-7).map((day, index) => (
              <motion.div 
                key={day.date}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  day.completed 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800' 
                    : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{day.day}</div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.completed 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span className="text-xs">{day.date.split('.')[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress and Mood Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Twój postęp</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  barSize={20} 
                  data={progressData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={12}
                    label={{ position: 'insideStart', fill: '#fff', fontWeight: 600, fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                            <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Postęp: <span className="font-medium">{data.value}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: '10px' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rozkład nastroju</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {moodDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      padding: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Stan z ostatnich 7 dni</h2>

          {/* Dataset Toggles */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={toggleShowAll}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                showAll 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 font-medium' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {showAll ? 'Ukryj wszystko' : 'Pokaż wszystkie'}
            </button>

            <div className="h-5 w-px bg-gray-200 dark:bg-gray-600 mx-1"></div>

            <div className="flex flex-wrap gap-2">
              {datasets.map(ds => (
                <button
                  key={ds.id}
                  onClick={() => toggleDataset(ds.id)}
                  className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    ds.active || showAll
                      ? 'opacity-100'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                  style={{ 
                    backgroundColor: `${ds.color}15`,
                    color: ds.color,
                    border: `1px solid ${ds.color}40`
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: ds.color }}
                  />
                  {ds.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full px-4 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" strokeOpacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
                stroke="#9CA3AF"
              />
              <YAxis 
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                width={30}
                tickCount={6}
                stroke="#9CA3AF"
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                content={({ payload }) => (
                  <div className="flex justify-center space-x-6 mt-2">
                    {payload?.map((entry, index) => (
                      <div 
                        key={`item-${index}`} 
                        className="flex items-center text-sm"
                        style={{ color: entry.color }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.value}
                      </div>
                    ))}
                  </div>
                )}
              />

              {activeDatasets.map((ds) => (
                <Line
                  key={ds.id}
                  type="monotone"
                  dataKey={ds.id}
                  name={ds.label}
                  stroke={ds.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    fill: ds.color,
                    stroke: '#fff',
                    strokeWidth: 2,
                    r: 6,
                  }}
                  strokeDasharray={ds.id === 'average' ? '5 5' : '0'}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              ))}

              {/* Add reference lines */}
              <ReferenceLine y={0} stroke="#E5E7EB" />
              <ReferenceLine y={5} stroke="#E5E7EB" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Best Day Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Najlepszy dzień tygodnia</h2>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                {bestDay.day}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{bestDay.day}</p>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Najlepszy wynik: <span className="font-medium">{bestDay.total.toFixed(1)} pkt</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {bestDay.stats.map((stat, index) => (
                  <motion.div 
                    key={stat.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</span>
                      <span 
                        className="text-sm font-semibold px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${stat.color}15`,
                          color: stat.color
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
                      <motion.div 
                        className="h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + (index * 0.05) }}
                        style={{ backgroundColor: stat.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
