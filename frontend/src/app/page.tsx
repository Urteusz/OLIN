'use client';

import { useState, useMemo } from 'react';
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
  Dot
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

const CustomDot = (props: any) => {
  const { cx, cy, value, active, payload, color } = props;
  if (!active) return null;
  
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="white" stroke={color} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
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

export default function DashboardPage() {
  const [datasets, setDatasets] = useState<ChartDataset[]>(initialDatasets);
  const [showAll, setShowAll] = useState<boolean>(false);

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
      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Stan z ostatnich 7 dni</h2>
          
          {/* Dataset Toggles */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={toggleShowAll}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                showAll 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showAll ? 'Ukryj wszystko' : 'Pokaż wszystkie'}
            </button>
            
            <div className="h-5 w-px bg-gray-200 mx-1"></div>
            
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                width={30}
                tickCount={6}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Najlepszy dzień tygodnia</h2>
          
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                {bestDay.day}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{bestDay.day}</p>
                <p className="text-sm text-indigo-700">
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
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">{stat.name}</span>
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
                    <div className="w-full bg-gray-100 rounded-full h-2">
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
