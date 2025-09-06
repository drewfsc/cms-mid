/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';


import React, { useState } from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils } from '@/lib/section-styling';
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';
import { BarChart3, RefreshCw, AlertCircle, ExternalLink, Brain, Lightbulb, Edit, Save, X, Plus, Trash2, Layout } from 'lucide-react';

interface ChartConfig {
  id: string;
  title: string;
  chartType: 'bar' | 'line' | 'pie';
  googleSheetUrl: string;
  sheetName: string;
  dataRange: string;
  chartHeight: number;
  showLegend: boolean;
  showTooltips: boolean;
  animation: boolean;
  refreshInterval: number;
  enableAI: boolean;
}

interface DynamicChartsSectionProps {
  section: DynamicSection;
  isEditMode?: boolean;
  onUpdate?: (fields: Record<string, unknown>) => void;
}

const DynamicChartsSection: React.FC<DynamicChartsSectionProps> = ({
  section,
  isEditMode = false,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<Record<string, unknown>>({});

  // Extract field values with defaults
  const title = section.fields.title as string || 'Analytics Dashboard';
  const subtitle = section.fields.subtitle as string || 'Data visualization from Google Sheets';
  const layout = section.fields.layout as string || 'single'; // 'single', 'two-column', 'three-column'
  
  // Get charts array or create default single chart
  const charts: ChartConfig[] = (section.fields.charts as ChartConfig[]) || [
    {
      id: 'chart-1',
      title: 'Chart 1',
      chartType: 'bar',
      googleSheetUrl: '',
      sheetName: 'Sheet1',
      dataRange: 'A1:C10',
      chartHeight: 400,
      showLegend: true,
      showTooltips: true,
      animation: true,
      refreshInterval: 0,
      enableAI: true
    }
  ];

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (isEditMode) {
      const newFields = { ...editFields, [fieldName]: value };
      setEditFields(newFields);
      onUpdate?.(newFields);
    }
  };

  const handleChartChange = (chartId: string, fieldName: string, value: unknown) => {
    if (isEditMode) {
      const updatedCharts = charts.map(chart => 
        chart.id === chartId ? { ...chart, [fieldName]: value } : chart
      );
      handleFieldChange('charts', updatedCharts);
    }
  };

  const addChart = () => {
    if (charts.length < 3) {
      const newChart: ChartConfig = {
        id: `chart-${Date.now()}`,
        title: `Chart ${charts.length + 1}`,
        chartType: 'bar',
        googleSheetUrl: '',
        sheetName: 'Sheet1',
        dataRange: 'A1:C10',
        chartHeight: 400,
        showLegend: true,
        showTooltips: true,
        animation: true,
        refreshInterval: 0,
        enableAI: true
      };
      handleFieldChange('charts', [...charts, newChart]);
    }
  };

  const removeChart = (chartId: string) => {
    if (charts.length > 1) {
      const updatedCharts = charts.filter(chart => chart.id !== chartId);
      handleFieldChange('charts', updatedCharts);
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case 'two-column':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8';
      case 'three-column':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-6';
      default:
        return 'grid grid-cols-1 gap-8';
    }
  };

  const handleSave = () => {
    onUpdate?.(editFields);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFields({});
    setIsEditing(false);
  };

  const getSectionStyles = () => {
    return SectionStylingUtils.getSectionStyles(section.styling);
  };


  const { containerStyle, containerClass } = getSectionStyles();

  return (
    <section 
      className={containerClass}
      style={containerStyle}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          {isEditMode && !isEditing ? (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Edit section"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          ) : isEditMode && isEditing ? (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <input
                type="text"
                value={editFields.title as string || title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none"
                placeholder="Section title"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20"
                  title="Save changes"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                  title="Cancel editing"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}

          {isEditMode && !isEditing ? (
            <div className="flex items-center justify-center space-x-4">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Edit subtitle"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ) : isEditMode && isEditing ? (
            <div className="flex items-center justify-center space-x-4">
              <input
                type="text"
                value={editFields.subtitle as string || subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="text-xl text-gray-600 dark:text-gray-400 bg-transparent border-b border-blue-500 focus:outline-none"
                placeholder="Section subtitle"
              />
            </div>
          ) : (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Chart Configuration Panel (Edit Mode) */}
        {isEditMode && isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chart Configuration
              </h3>
              <div className="flex items-center space-x-4">
                {/* Layout Selection */}
                <div className="flex items-center space-x-2">
                  <Layout className="w-4 h-4 text-gray-500" />
                  <select
                    value={editFields.layout as string || layout}
                    onChange={(e) => handleFieldChange('layout', e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="single">Single Chart</option>
                    <option value="two-column">Two Charts</option>
                    <option value="three-column">Three Charts</option>
                  </select>
                </div>
                
                {/* Add Chart Button */}
                {charts.length < 3 && (
                  <button
                    onClick={addChart}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Chart</span>
                  </button>
                )}
              </div>
            </div>

            {/* Individual Chart Configurations */}
            <div className="space-y-6">
              {charts.map((chart, index) => (
                <div key={chart.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Chart {index + 1}
                    </h4>
                    {charts.length > 1 && (
                      <button
                        onClick={() => removeChart(chart.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded"
                        title="Remove chart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chart Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chart Title
                      </label>
                      <input
                        type="text"
                        value={chart.title}
                        onChange={(e) => handleChartChange(chart.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Chart Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chart Type
                      </label>
                      <select
                        value={chart.chartType}
                        onChange={(e) => handleChartChange(chart.id, 'chartType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                      </select>
                    </div>

                    {/* Google Sheets URL */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Google Sheets URL
                      </label>
                      <input
                        type="url"
                        value={chart.googleSheetUrl}
                        onChange={(e) => handleChartChange(chart.id, 'googleSheetUrl', e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Sheet Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sheet Name
                      </label>
                      <input
                        type="text"
                        value={chart.sheetName}
                        onChange={(e) => handleChartChange(chart.id, 'sheetName', e.target.value)}
                        placeholder="Sheet1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Data Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data Range
                      </label>
                      <input
                        type="text"
                        value={chart.dataRange}
                        onChange={(e) => handleChartChange(chart.id, 'dataRange', e.target.value)}
                        placeholder="A1:C10"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Chart Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chart Height (px)
                      </label>
                      <input
                        type="number"
                        value={chart.chartHeight}
                        onChange={(e) => handleChartChange(chart.id, 'chartHeight', parseInt(e.target.value))}
                        min="200"
                        max="800"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Refresh Interval */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Auto Refresh (minutes)
                      </label>
                      <input
                        type="number"
                        value={chart.refreshInterval}
                        onChange={(e) => handleChartChange(chart.id, 'refreshInterval', parseInt(e.target.value))}
                        min="0"
                        max="60"
                        placeholder="0 = no auto refresh"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chart.showLegend}
                        onChange={(e) => handleChartChange(chart.id, 'showLegend', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Show Legend</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chart.showTooltips}
                        onChange={(e) => handleChartChange(chart.id, 'showTooltips', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Show Tooltips</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chart.animation}
                        onChange={(e) => handleChartChange(chart.id, 'animation', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Enable Animation</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chart.enableAI}
                        onChange={(e) => handleChartChange(chart.id, 'enableAI', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Enable AI Analysis</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart Display */}
        <div className={`${getLayoutClass()}`}>
          {charts.map((chart, index) => (
            <div key={chart.id} className="relative">
              {chart.googleSheetUrl ? (
                <GoogleSheetsChart
                  googleSheetUrl={chart.googleSheetUrl}
                  sheetName={chart.sheetName}
                  dataRange={chart.dataRange}
                  chartType={chart.chartType}
                  title={chart.title}
                  subtitle=""
                  height={chart.chartHeight}
                  showLegend={chart.showLegend}
                  showTooltips={chart.showTooltips}
                  animation={chart.animation}
                  refreshInterval={chart.refreshInterval}
                  enableAI={chart.enableAI}
                  className="rounded-lg shadow-lg"
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {chart.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {isEditMode 
                          ? 'Add a Google Sheets URL to display your chart data'
                          : 'Chart data will appear here once configured'
                        }
                      </p>
                      {isEditMode && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Configure Chart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {isEditMode && !isEditing && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Multi-Chart Dashboard Setup
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <p>• <strong>Up to 3 charts</strong> per section with flexible layouts</p>
                  <p>• Each chart can have different data sources and chart types</p>
                  <p>• Make your Google Sheets publicly readable or provide API keys</p>
                  <p>• Use first column for categories/labels, other columns for data series</p>
                  <p>• For pie charts: first column = labels, second column = values</p>
                  <p>• Include headers in your data range (e.g., A1:C10)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicChartsSection;