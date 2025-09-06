'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { BarChart3, RefreshCw, AlertCircle, ExternalLink, Brain, Lightbulb } from 'lucide-react';
import { GoogleSheetsManager, ParsedChartData, AIAnalysisResult } from '@/lib/google-sheets-api';

interface DynamicChartsSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

const DynamicChartsSection: React.FC<DynamicChartsSectionProps> = ({
  section,
  isEditMode = false,
  onUpdate
}) => {
  const [chartData, setChartData] = useState<ParsedChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const chartType = section.fields.chartType as string || 'bar';
  const googleSheetUrl = section.fields.googleSheetUrl as string || '';
  const sheetName = section.fields.sheetName as string || 'Sheet1';
  const dataRange = section.fields.dataRange as string || 'A1:C10';
  const chartHeight = section.fields.chartHeight as number || 400;
  const showLegend = section.fields.showLegend as boolean ?? true;
  const showTooltips = section.fields.showTooltips as boolean ?? true;
  const animation = section.fields.animation as boolean ?? true;
  const refreshInterval = section.fields.refreshInterval as number || 0;
  const enableAI = section.fields.enableAI as boolean ?? true;

  // Fetch and parse Google Sheets data with AI analysis
  const fetchGoogleSheetsData = async (): Promise<ParsedChartData> => {
    if (!googleSheetUrl) {
      // Return empty chart data instead of throwing error when no URL is provided
      return {
        labels: [],
        datasets: [],
        metadata: {
          totalRows: 0,
          totalColumns: 0,
          dataTypes: [],
          lastUpdated: new Date().toISOString()
        }
      };
    }

    // Extract sheet ID from URL
    const sheetId = GoogleSheetsManager.extractSheetId(googleSheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format');
    }

    // For demo purposes, we'll use a mock API key
    // In production, you'd get this from environment variables or user settings
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || 'demo-key';
    
    const config = {
      apiKey,
      sheetId,
      range: `${sheetName}!${dataRange}`,
      sheetName
    };

    try {
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
          // Continue without AI analysis
        }
      }

      // Parse data for chart
      const parsedData = GoogleSheetsManager.parseDataForChart(
        rawData, 
        analysis?.chartType || chartType,
        analysis
      );

      // Update AI analysis state
      if (analysis) {
        setAiAnalysis(analysis);
      }
      setInsights(dataInsights);

      return parsedData;
    } catch (err) {
      console.error('Google Sheets fetch error:', err);
      throw new Error(`Failed to fetch data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    const loadChartData = async () => {
      if (!googleSheetUrl) {
        setError('Google Sheets URL is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchGoogleSheetsData();
        setChartData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load chart data from Google Sheets');
        console.error('Chart data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [googleSheetUrl, sheetName, dataRange, chartType]);

  // Auto refresh effect
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(async () => {
      try {
        const data = await fetchGoogleSheetsData();
        setChartData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Auto refresh error:', err);
      }
    }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(interval);
  }, [refreshInterval, googleSheetUrl, sheetName, dataRange, chartType]);

  // Chart rendering effect
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    // Dynamically import Chart.js
    const renderChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const config = {
        type: aiAnalysis?.chartType || chartType,
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: showLegend
            },
            tooltip: {
              enabled: showTooltips
            }
          },
          animation: animation ? {} : false,
          scales: (aiAnalysis?.chartType || chartType) !== 'pie' && (aiAnalysis?.chartType || chartType) !== 'donut' ? {
            y: {
              beginAtZero: true
            }
          } : undefined
        }
      };

      chartInstanceRef.current = new Chart(ctx, config);
    };

    renderChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartType, showLegend, showTooltips, animation]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchGoogleSheetsData();
      setChartData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to refresh chart data');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        ...section,
        fields: {
          ...section.fields,
          [fieldName]: value
        }
      });
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return '📊';
      case 'line':
        return '📈';
      case 'pie':
        return '🥧';
      case 'area':
        return '📉';
      case 'scatter':
        return '🔍';
      case 'donut':
        return '🍩';
      case 'gauge':
        return '⚡';
      default:
        return '📊';
    }
  };

  if (loading && !chartData) {
    return (
      <div className="py-16 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show configuration message when no Google Sheets URL is provided
  if (!googleSheetUrl) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {((section.fields.title as string) || (section.fields.subtitle as string)) && (
            <div className="text-center mb-12">
              {(section.fields.title as string) && (
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.fields.title as string}
                </h2>
              )}
              {(section.fields.subtitle as string) && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {section.fields.subtitle as string}
                </p>
              )}
            </div>
          )}

          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Configure Charts & Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a Google Sheets URL to display interactive charts
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Edit this section to add your Google Sheets configuration
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {((section.fields.title as string) || (section.fields.subtitle as string)) && (
          <div className="text-center mb-12">
            {(section.fields.title as string) && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {section.fields.title as string}
              </h2>
            )}
            {(section.fields.subtitle as string) && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {section.fields.subtitle as string}
              </p>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {isEditMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Chart Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={(section.fields.title as string) || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={(section.fields.subtitle as string) || ''}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter section subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Sheets URL
                  </label>
                  <input
                    type="url"
                    value={(section.fields.googleSheetUrl as string) || ''}
                    onChange={(e) => handleFieldChange('googleSheetUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paste your Google Sheets URL (make sure it's publicly accessible)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sheet Name
                  </label>
                  <input
                    type="text"
                    value={(section.fields.sheetName as string) || 'Sheet1'}
                    onChange={(e) => handleFieldChange('sheetName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Sheet1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Range
                  </label>
                  <input
                    type="text"
                    value={(section.fields.dataRange as string) || ''}
                    onChange={(e) => handleFieldChange('dataRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="A1:C10"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Specify the range to include (e.g., A1:C10)
                  </p>
                </div>
              </div>

              {/* Chart Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chart Type
                  </label>
                  <select
                    value={(section.fields.chartType as string) || 'bar'}
                    onChange={(e) => handleFieldChange('chartType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="scatter">Scatter Plot</option>
                    <option value="donut">Donut Chart</option>
                    <option value="gauge">Gauge Chart</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chart Height (px)
                  </label>
                  <input
                    type="number"
                    value={(section.fields.chartHeight as number) || 400}
                    onChange={(e) => handleFieldChange('chartHeight', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="200"
                    max="800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto Refresh (minutes)
                  </label>
                  <input
                    type="number"
                    value={(section.fields.refreshInterval as number) || 0}
                    onChange={(e) => handleFieldChange('refreshInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    placeholder="0 = no auto refresh"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableAI"
                      checked={(section.fields.enableAI as boolean) || true}
                      onChange={(e) => handleFieldChange('enableAI', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableAI" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable AI Analysis
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showLegend"
                      checked={(section.fields.showLegend as boolean) || true}
                      onChange={(e) => handleFieldChange('showLegend', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showLegend" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Show Legend
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showTooltips"
                      checked={(section.fields.showTooltips as boolean) || true}
                      onChange={(e) => handleFieldChange('showTooltips', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showTooltips" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Show Tooltips
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="animation"
                      checked={(section.fields.animation as boolean) || true}
                      onChange={(e) => handleFieldChange('animation', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="animation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable Animations
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getChartIcon(aiAnalysis?.chartType || chartType)}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {aiAnalysis?.suggestedTitle || `${chartType} Chart`}
                </h3>
                {lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
                {aiAnalysis && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-purple-600">
                      AI Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {aiAnalysis && (
                <button
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className={`p-2 rounded-lg transition-colors ${
                    showAIInsights 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  title="Toggle AI Insights"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              )}
              {refreshInterval > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto-refresh: {refreshInterval}min</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <a
                href={googleSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* AI Insights Panel */}
          {showAIInsights && aiAnalysis && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2">AI Analysis</h4>
                  <p className="text-sm text-purple-700 mb-3">{aiAnalysis.reasoning}</p>
                  
                  {insights.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-purple-800 mb-2">Data Insights:</h5>
                      <ul className="text-xs text-purple-700 space-y-1">
                        {insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative" style={{ height: `${chartHeight}px` }}>
            {chartData && chartData.labels.length > 0 ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Chart Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No data was found in the configured Google Sheets
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Data source: Google Sheets</p>
            <p>Range: {dataRange} | Sheet: {sheetName}</p>
            {chartData?.metadata && (
              <p>Rows: {chartData.metadata.totalRows} | Columns: {chartData.metadata.totalColumns}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicChartsSection;
