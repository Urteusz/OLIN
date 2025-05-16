'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Define chart data types
interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  hidden: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Configure global chart settings
ChartJS.defaults.font.family = 'Inter';
ChartJS.defaults.color = '#6B7280';
ChartJS.defaults.scale.grid.color = '#E5E7EB';
ChartJS.defaults.scale.grid.lineWidth = 1;
ChartJS.defaults.scale.grid.display = true;
ChartJS.defaults.scale.grid.drawTicks = false;

export default function DashboardPage() {
  // Stan wykresu
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
    datasets: [
      {
        label: 'Poziom zadowolenia',
        data: [5, 3, 3, 4, 1, 2, 5],
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        tension: 0.4,
        hidden: true,
      },
      {
        label: 'Stan fizyczny',
        data: [2, 3, 2, 4, 4, 1, 3],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.4,
        hidden: true,
      },
      {
        label: 'Motywacja',
        data: [3, 4, 2, 4, 3, 4, 5],
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        tension: 0.4,
        hidden: true,
      },
      {
        label: 'Skupienie',
        data: [2, 3, 2, 1, 4, 3, 4],
        borderColor: '#DB2777',
        backgroundColor: '#DB2777',
        tension: 0.4,
        hidden: true,
      },
      {
        label: 'Średnia',
        data: [3, 3.25, 2.25, 3.25, 3, 2.75, 4],
        borderColor: '#6B7280',
        backgroundColor: '#6B7280',
        tension: 0.4,
        hidden: false,
      },
      {
        label: 'Ukończone zadania',
        data: [1, 3, 2, 1, 2, 3, 3],
        borderColor: '#2563EB',
        backgroundColor: '#2563EB',
        tension: 0.4,
        hidden: true,
      },
    ],
  });

  // Stan przycisków
  const [activeStat, setActiveStat] = useState<string>('Średnia');

  // Funkcja do aktualizacji widoczności danych
  const updateVisibility = (label: string) => {
    setActiveStat(label === activeStat ? '' : label);
    
    // Aktualizujemy dane wykresu
    const newChartData = JSON.parse(JSON.stringify(chartData));
    newChartData.datasets.forEach((ds: ChartDataset) => {
      ds.hidden = label === '' ? false : ds.label !== label;
    });
    
    setChartData(newChartData);
  };

  // Obliczamy najlepszy dzień
  const calculateBestDay = () => {
    const days = chartData.labels;
    const data = chartData.datasets.map(ds => ds.data);
    let maxSum = 0;
    let bestDayIndex = 0;

    // Sumujemy wartości dla każdego dnia
    for (let i = 0; i < days.length; i++) {
      let daySum = 0;
      for (let j = 0; j < data.length; j++) {
        daySum += data[j][i];
      }
      if (daySum > maxSum) {
        maxSum = daySum;
        bestDayIndex = i;
      }
    }

    const bestDayData = data.map(arr => arr[bestDayIndex]);
    const bestDay = days[bestDayIndex];

    return {
      day: bestDay,
      values: bestDayData,
      total: maxSum,
      stats: chartData.datasets.map((ds, i) => ({
        name: ds.label,
        value: bestDayData[i],
        color: ds.borderColor
      }))
    };
  };

  const bestDay = calculateBestDay();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: 'Inter',
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Stan z ostatnich 7 dni',
        font: {
          family: 'Inter',
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        max: 5,
        min: 0,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
          font: {
            family: 'Inter',
            size: 12,
          },
        },
        grid: {
          color: '#E5E7EB',
          lineWidth: 1,
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter',
            size: 12,
          },
        },
        grid: {
          color: '#E5E7EB',
          lineWidth: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-6">

      {/* Wykres */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Przyciski filtru */}
        <div className="flex flex-wrap gap-2 mb-4">
        <button
            onClick={() => updateVisibility('Średnia')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Średnia'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Średnia
          </button>
          <button
            onClick={() => updateVisibility('Poziom zadowolenia')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Poziom zadowolenia'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Poziom zadowolenia
          </button>
          <button
            onClick={() => updateVisibility('Stan fizyczny')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Stan fizyczny'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Stan fizyczny
          </button>
          <button
            onClick={() => updateVisibility('Motywacja')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Motywacja'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Motywacja
          </button>
          <button
            onClick={() => updateVisibility('Skupienie')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Skupienie'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Skupienie
          </button>
          <button
            onClick={() => updateVisibility('Ukończone zadania')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === 'Ukończone zadania'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Ukończone zadania
          </button>
          <button
            onClick={() => updateVisibility('')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStat === ''
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pokaż wszystkie
          </button>
        </div>

        <div className="h-[400px]">
          <Line 
            data={chartData} 
            options={chartOptions} 
          />
        </div>
      </div>

      {/* Najlepszy dzień */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Najlepszy dzień tygodnia</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
              {bestDay.day}
            </div>
            <div>
              <p className="text-lg font-medium">{bestDay.day}</p>
              <p className="text-sm text-gray-500">Suma punktów: {bestDay.total.toFixed(0)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestDay.stats.map((stat, index) => (
              <div key={stat.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{stat.name}</p>
                  <span className="text-sm text-gray-500">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${stat.value*20}%`,
                      backgroundColor: stat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
