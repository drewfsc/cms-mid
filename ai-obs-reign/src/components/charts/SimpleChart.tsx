/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { GoogleSheetsManager } from '@/lib/google-sheets-api';
import { AlertCircle } from 'lucide-react';
import SimpleLoader from '@/components/ui/SimpleLoader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface SimpleChartProps {
  googleSheetUrl: string;
  chartType: 'bar' | 'line' | 'pie';
  title?: string;
  height?: number;
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  googleSheetUrl,
  chartType,
  title,
  height = 300,
  className = ''
}) => {
  const [chartData, setChartData] = useState<ChartData<'bar' | 'line' | 'pie'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!googleSheetUrl) {
        setError('Google Sheets URL is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const rows = await GoogleSheetsManager.fetchSheetDataFromCSV(googleSheetUrl);
        
        if (rows.length < 2) {
          throw new Error('Insufficient data');
        }

        const parsedData = GoogleSheetsManager.parseDataForChart(rows, chartType);
        setChartData(parsedData);
      } catch (err) {
        console.error('Chart error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [googleSheetUrl, chartType]);

  const getChartOptions = (): ChartOptions<'bar' | 'line' | 'pie'> => {
    const baseOptions: ChartOptions<'bar' | 'line' | 'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
        title: {
          display: !!title,
          text: title,
        },
      },
    };

    if (chartType === 'line') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    } else if (chartType === 'bar') {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    }

    return baseOptions;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <SimpleLoader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData) return null;

  const chartProps = {
    data: chartData,
    options: getChartOptions(),
  };

  return (
    <div className={className} style={{ height: `${height}px` }}>
      {chartType === 'bar' && <Bar {...chartProps} />}
      {chartType === 'line' && <Line {...chartProps} />}
      {chartType === 'pie' && <Pie {...chartProps} />}
    </div>
  );
};

export default SimpleChart;
