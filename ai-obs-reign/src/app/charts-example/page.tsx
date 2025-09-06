'use client';

import React from 'react';
import SimpleChart from '@/components/charts/SimpleChart';
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';

export default function ChartsExamplePage() {
  // Example Google Sheets URL - replace with your own
  const exampleSheetUrl = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Google Sheets Charts Examples
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Interactive charts powered by Google Sheets data
          </p>
        </div>

        {/* Simple Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bar Chart
            </h3>
            <SimpleChart
              googleSheetUrl={exampleSheetUrl}
              chartType="bar"
              title="Sales Data"
              height={300}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Line Chart
            </h3>
            <SimpleChart
              googleSheetUrl={exampleSheetUrl}
              chartType="line"
              title="Trend Analysis"
              height={300}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pie Chart
            </h3>
            <SimpleChart
              googleSheetUrl={exampleSheetUrl}
              chartType="pie"
              title="Distribution"
              height={300}
            />
          </div>
        </div>

        {/* Advanced Chart */}
        <div className="mb-12">
          <GoogleSheetsChart
            googleSheetUrl={exampleSheetUrl}
            chartType="bar"
            title="Advanced Analytics Dashboard"
            subtitle="Comprehensive data visualization with AI insights"
            height={500}
            showLegend={true}
            showTooltips={true}
            animation={true}
            refreshInterval={5}
            enableAI={true}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6">
            How to Use These Charts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4">
                Simple Chart Component
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import SimpleChart from '@/components/charts/SimpleChart';

<SimpleChart
  googleSheetUrl="https://docs.google.com/spreadsheets/d/..."
  chartType="bar"
  title="My Chart"
  height={300}
/>`}
                </pre>
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Minimal configuration required</li>
                <li>• Perfect for quick implementations</li>
                <li>• Automatic error handling</li>
                <li>• Responsive design</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4">
                Advanced Chart Component
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';

<GoogleSheetsChart
  googleSheetUrl="https://docs.google.com/spreadsheets/d/..."
  chartType="line"
  title="Advanced Dashboard"
  height={500}
  showLegend={true}
  animation={true}
  refreshInterval={5}
  enableAI={true}
/>`}
                </pre>
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Full customization options</li>
                <li>• AI-powered data analysis</li>
                <li>• Auto-refresh capabilities</li>
                <li>• Download and export features</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
              Data Format Requirements:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-400">
              <div>
                <strong>Bar Charts:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Column A: Categories</li>
                  <li>• Column B+: Data series</li>
                  <li>• Include headers</li>
                </ul>
              </div>
              <div>
                <strong>Line Charts:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Column A: Time/Categories</li>
                  <li>• Column B+: Data series</li>
                  <li>• Time series auto-detected</li>
                </ul>
              </div>
              <div>
                <strong>Pie Charts:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Column A: Labels</li>
                  <li>• Column B: Values</li>
                  <li>• Perfect for proportions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
