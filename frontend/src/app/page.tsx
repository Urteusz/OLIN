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
  // Przykładowe dane dla wykresów
  const chartData = {
    labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
    datasets: [
      {
        label: 'Poziom zadowolenia',
        data: [75, 80, 85, 90, 88, 92, 95],
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Stan fizyczny',
        data: [60, 65, 70, 75, 78, 80, 82],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Motywacja',
        data: [70, 75, 80, 85, 82, 88, 90],
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Skupienie',
        data: [65, 70, 75, 80, 82, 85, 88],
        borderColor: '#DB2777',
        backgroundColor: '#DB2777',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Ukończone zadania',
        data: [4, 5, 6, 7, 6, 8, 9],
        borderColor: '#2563EB',
        backgroundColor: '#2563EB',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Obliczamy najlepszy dzień
  const calculateBestDay = () => {
    const days = chartData.labels;
    const data = chartData.datasets.map(ds => ds.data);
    let maxSum = 0;
    let bestDayIndex = 0;

    // Konwertujemy dane zadań na wartości procentowe (0-100)
    const normalizedData = data.map(arr => 
      arr.map((val, i) => 
        i === 4 ? val * 10 : val  // Zadania są na pozycji 4, mnożymy przez 10
      )
    );

    // Sumujemy wartości dla każdego dnia
    for (let i = 0; i < days.length; i++) {
      const daySum = normalizedData.reduce((sum, arr) => sum + arr[i], 0);
      if (daySum > maxSum) {
        maxSum = daySum;
        bestDayIndex = i;
      }
    }

    const bestDayData = normalizedData.map(arr => arr[bestDayIndex]);
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
        max: 100,
        min: 0,
        ticks: {
          stepSize: 10,
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
                      width: `${stat.value}%`,
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
