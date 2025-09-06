/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState } from 'react';
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';
import { BarChart3, TrendingUp, PieChart, Settings, Info } from 'lucide-react';

export default function ChartsDemoPage() {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie'>('bar');
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [dataRange, setDataRange] = useState('A1:C10');
  const [apiKey, setApiKey] = useState('');

  // Example Google Sheets URLs for demonstration
  const exampleSheets = [
    {
      name: 'Sales Data',
      url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      description: 'Monthly sales data with categories and values',
      range: 'A1:C13'
    },
    {
      name: 'Website Analytics',
      url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      description: 'Website traffic and conversion data',
      range: 'A1:D12'
    },
    {
      name: 'Product Performance',
      url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      description: 'Product sales distribution',
      range: 'A1:B8'
    }
  ];

  const chartTypes = [
    {
      type: 'bar' as const,
      name: 'Bar Chart',
      icon: BarChart3,
      description: 'Compare values across categories',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      type: 'line' as const,
      name: 'Line Chart',
      icon: TrendingUp,
      description: 'Show trends over time',
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    },
    {
      type: 'pie' as const,
      name: 'Pie Chart',
      icon: PieChart,
      description: 'Display data proportions',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    }
  ];

  const handleExampleSelect = (example: typeof exampleSheets[0]) => {
    setGoogleSheetUrl(example.url);
    setDataRange(example.range);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Google Sheets Charts Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create interactive bar charts, line charts, and pie charts from your Google Sheets data
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chart Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Chart Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {chartTypes.map((chart) => {
                  const Icon = chart.icon;
                  return (
                    <button
                      key={chart.type}
                      onClick={() => setActiveChart(chart.type)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        activeChart === chart.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-2 rounded-lg ${chart.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {chart.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {chart.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Sheets Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Sheets URL
                </label>
                <input
                  type="url"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sheet Name
                  </label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="Sheet1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Range
                  </label>
                  <input
                    type="text"
                    value={dataRange}
                    onChange={(e) => setDataRange(e.target.value)}
                    placeholder="A1:C10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Sheets API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Leave empty to use CSV export method"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  For private sheets, provide your Google Sheets API key
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Sheets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Example Google Sheets
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click on any example to load sample data and see how different chart types work:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exampleSheets.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleSelect(example)}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {example.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {example.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Range: {example.range}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Display */}
        {googleSheetUrl && (
          <div className="mb-8">
            <GoogleSheetsChart
              googleSheetUrl={googleSheetUrl}
              sheetName={sheetName}
              dataRange={dataRange}
              chartType={activeChart}
              title={`${chartTypes.find(c => c.type === activeChart)?.name} - ${googleSheetUrl.split('/').pop()?.split('?')[0] || 'Data'}`}
              subtitle={`Data from ${sheetName} (${dataRange})`}
              height={500}
              showLegend={true}
              showTooltips={true}
              animation={true}
              refreshInterval={5}
              enableAI={true}
              apiKey={apiKey}
              onDataLoad={(data) => {
                console.log('Chart data loaded:', data);
              }}
              onError={(error) => {
                console.error('Chart error:', error);
              }}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            How to Use
          </h3>
          <div className="space-y-3 text-blue-800 dark:text-blue-400">
            <div className="flex items-start space-x-3">
              <span className="font-semibold">1.</span>
              <p>Make your Google Sheet publicly readable or provide an API key for private sheets</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-semibold">2.</span>
              <p>Copy the Google Sheets URL and paste it in the configuration panel</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-semibold">3.</span>
              <p>Specify the sheet name and data range (e.g., &quot;Sheet1&quot; and &quot;A1:C10&quot;)</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="font-semibold">4.</span>
              <p>Choose your chart type and watch the magic happen!</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Data Format Tips:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• <strong>Bar/Line Charts:</strong> First column = categories, other columns = data series</li>
              <li>• <strong>Pie Charts:</strong> First column = labels, second column = values</li>
              <li>• <strong>Time Series:</strong> Use date columns for automatic line chart detection</li>
              <li>• <strong>Headers:</strong> Include column headers in your data range</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              Important: Make Your Sheet Public
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-2">
              For the CSV export to work, your Google Sheet must be publicly accessible:
            </p>
            <ol className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1 list-decimal list-inside">
              <li>Open your Google Sheet</li>
              <li>Click &quot;Share&quot; in the top-right corner</li>
              <li>Change permissions to &quot;Anyone with the link can view&quot;</li>
              <li>Copy the shareable link and paste it above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
