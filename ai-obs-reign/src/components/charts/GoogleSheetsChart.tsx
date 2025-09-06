'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { GoogleSheetsManager, ParsedChartData, AIAnalysisResult } from '@/lib/google-sheets-api';
import { RefreshCw, Download, Settings, AlertCircle, CheckCircle, BarChart3, TrendingUp, PieChart, ExternalLink } from 'lucide-react';
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

export interface GoogleSheetsChartProps {
  googleSheetUrl: string;
  sheetName?: string;
  dataRange?: string;
  chartType: 'bar' | 'line' | 'pie';
  title?: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  showTooltips?: boolean;
  animation?: boolean;
  refreshInterval?: number; // in minutes
  enableAI?: boolean;
  apiKey?: string;
  className?: string;
  onDataLoad?: (data: ParsedChartData) => void;
  onError?: (error: string) => void;
}

const GoogleSheetsChart: React.FC<GoogleSheetsChartProps> = ({
  googleSheetUrl,
  sheetName = 'Sheet1',
  dataRange = 'A1:C10',
  chartType,
  title,
  subtitle,
  height = 400,
  showLegend = true,
  showTooltips = true,
  animation = true,
  refreshInterval = 0,
  enableAI = true,
  apiKey,
  className = '',
  onDataLoad,
  onError
}) => {
  const [chartData, setChartData] = useState<ParsedChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const chartRef = useRef<ChartJS>(null);

  const fetchData = async () => {
    if (!googleSheetUrl) {
      const errorMsg = 'Google Sheets URL is required';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract sheet ID from URL
      const sheetId = GoogleSheetsManager.extractSheetId(googleSheetUrl);
      if (!sheetId) {
        throw new Error('Invalid Google Sheets URL format');
      }

      // Use provided API key or try to get from environment
      const apiKeyToUse = apiKey || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
      if (!apiKeyToUse) {
        // Fallback to CSV export method for public sheets
        await fetchDataFromCSV();
        return;
      }

      const config = {
        apiKey: apiKeyToUse,
        sheetId,
        range: `${sheetName}!${dataRange}`,
        sheetName
      };

      // Fetch raw data from Google Sheets
      const rawData = await GoogleSheetsManager.fetchSheetData(config);
      
      if (!rawData || rawData.length < 2) {
        throw new Error('Insufficient data in Google Sheets');
      }

      let analysis: AIAnalysisResult | null = null;
      let dataInsights: string[] = [];

      // Perform AI analysis if enabled
      if (enableAI) {
        try {
          analysis = await GoogleSheetsManager.analyzeDataForChartType(rawData);
          dataInsights = await GoogleSheetsManager.generateDataInsights(rawData);
        } catch (aiError) {
          console.warn('AI analysis failed:', aiError);
        }
      }

      // Parse data for chart
      const parsedData = GoogleSheetsManager.parseDataForChart(
        rawData, 
        analysis?.chartType || chartType,
        analysis
      );

      setChartData(parsedData);
      setAiAnalysis(analysis);
      setInsights(dataInsights);
      setLastUpdated(new Date());
      onDataLoad?.(parsedData);

    } catch (err) {
      console.error('Chart data error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load chart data';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fallback method for public sheets using CSV export
  const fetchDataFromCSV = async () => {
    try {
      console.log('Fetching data from CSV export...');
      const rows = await GoogleSheetsManager.fetchSheetDataFromCSV(googleSheetUrl, sheetName, dataRange);
      
      if (rows.length < 2) {
        throw new Error('Insufficient data in CSV');
      }

      // Parse data for chart
      const parsedData = GoogleSheetsManager.parseDataForChart(rows, chartType);
      
      setChartData(parsedData);
      setLastUpdated(new Date());
      onDataLoad?.(parsedData);

    } catch (err) {
      console.error('CSV fetch error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load chart data from CSV';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  useEffect(() => {
    fetchData();
  }, [googleSheetUrl, sheetName, dataRange, chartType]);

  // Auto refresh effect
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleDownload = () => {
    if (!chartRef.current) return;

    const canvas = chartRef.current.canvas;
    const url = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `${chartType}-chart-${new Date().toISOString().split('T')[0]}.png`;
    link.href = url;
    link.click();
  };

  const getChartOptions = (): ChartOptions<'bar' | 'line' | 'pie'> => {
    const baseOptions: ChartOptions<'bar' | 'line' | 'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: 'top' as const,
        },
        tooltip: {
          enabled: showTooltips,
        },
        title: {
          display: !!title,
          text: title,
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
      },
      animation: animation ? {
        duration: 1000,
        easing: 'easeInOutQuart' as const,
      } : false,
    };

    // Chart-specific options
    if (chartType === 'line') {
      return {
        ...baseOptions,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Category',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
            },
            beginAtZero: true,
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 4,
            hoverRadius: 6,
          },
        },
      };
    } else if (chartType === 'bar') {
      return {
        ...baseOptions,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Category',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
            },
            beginAtZero: true,
          },
        },
      };
    } else if (chartType === 'pie') {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins?.legend,
            position: 'right' as const,
          },
        },
      };
    }

    return baseOptions;
  };

  const renderChart = () => {
    if (!chartData) return null;

    const chartProps = {
      ref: chartRef,
      data: chartData as ChartData<'bar' | 'line' | 'pie'>,
      options: getChartOptions(),
    };

    switch (chartType) {
      case 'bar':
        return <Bar {...chartProps} />;
      case 'line':
        return <Line {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  };

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'line':
        return <TrendingUp className="w-5 h-5" />;
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="flex flex-col items-center space-y-4">
            <SimpleLoader size="lg" />
            <p className="text-gray-600 dark:text-gray-400">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="flex flex-col items-center space-y-4 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Chart
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              
              {/* Troubleshooting tips */}
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                <p className="font-medium mb-2">Troubleshooting tips:</p>
                <ul className="space-y-1">
                  <li>• Ensure the Google Sheet is publicly accessible</li>
                  <li>• Check that the sheet contains data in the specified range</li>
                  <li>• Verify the sheet URL is correct</li>
                  <li>• Try using a Google Sheets API key for private sheets</li>
                </ul>
              </div>
              
              <div className="space-x-3">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Sheet
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getChartIcon()}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Download chart"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Chart settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      </div>

      {/* AI Insights */}
      {aiAnalysis && insights.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                AI Analysis Insights
              </h4>
              <div className="space-y-1">
                {insights.map((insight, index) => (
                  <p key={index} className="text-sm text-blue-700 dark:text-blue-400">
                    • {insight}
                  </p>
                ))}
              </div>
              {aiAnalysis.confidence && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Confidence: {(aiAnalysis.confidence * 100).toFixed(0)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Chart Configuration
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Chart Type:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                {chartType}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Data Range:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {dataRange}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Sheet Name:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {sheetName}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Auto Refresh:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {refreshInterval > 0 ? `${refreshInterval} min` : 'Off'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsChart;
