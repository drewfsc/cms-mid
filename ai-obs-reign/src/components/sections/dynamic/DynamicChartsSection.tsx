'use client';

import React, { useState } from 'react';
import { DynamicSection } from '@/lib/dynamic-sections';
import { SectionStylingUtils } from '@/lib/section-styling';
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';
import { BarChart3, RefreshCw, AlertCircle, ExternalLink, Brain, Lightbulb, Edit, Save, X } from 'lucide-react';

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

  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (isEditMode) {
      const newFields = { ...editFields, [fieldName]: value };
      setEditFields(newFields);
      onUpdate?.(newFields);
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

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'line':
        return <RefreshCw className="w-5 h-5" />;
      case 'pie':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chart Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Type
                </label>
                <select
                  value={editFields.chartType as string || chartType}
                  onChange={(e) => handleFieldChange('chartType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              {/* Google Sheets URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Sheets URL
                </label>
                <input
                  type="url"
                  value={editFields.googleSheetUrl as string || googleSheetUrl}
                  onChange={(e) => handleFieldChange('googleSheetUrl', e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Sheet Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sheet Name
                </label>
                <input
                  type="text"
                  value={editFields.sheetName as string || sheetName}
                  onChange={(e) => handleFieldChange('sheetName', e.target.value)}
                  placeholder="Sheet1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Data Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Range
                </label>
                <input
                  type="text"
                  value={editFields.dataRange as string || dataRange}
                  onChange={(e) => handleFieldChange('dataRange', e.target.value)}
                  placeholder="A1:C10"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Chart Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Height (px)
                </label>
                <input
                  type="number"
                  value={editFields.chartHeight as number || chartHeight}
                  onChange={(e) => handleFieldChange('chartHeight', parseInt(e.target.value))}
                  min="200"
                  max="800"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Refresh Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto Refresh (minutes)
                </label>
                <input
                  type="number"
                  value={editFields.refreshInterval as number || refreshInterval}
                  onChange={(e) => handleFieldChange('refreshInterval', parseInt(e.target.value))}
                  min="0"
                  max="60"
                  placeholder="0 = no auto refresh"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Toggle Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editFields.showLegend as boolean ?? showLegend}
                  onChange={(e) => handleFieldChange('showLegend', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Legend</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editFields.showTooltips as boolean ?? showTooltips}
                  onChange={(e) => handleFieldChange('showTooltips', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Tooltips</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editFields.animation as boolean ?? animation}
                  onChange={(e) => handleFieldChange('animation', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable Animation</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editFields.enableAI as boolean ?? enableAI}
                  onChange={(e) => handleFieldChange('enableAI', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable AI Analysis</span>
              </label>
            </div>
          </div>
        )}

        {/* Chart Display */}
        <div className="relative">
          {googleSheetUrl ? (
            <GoogleSheetsChart
              googleSheetUrl={googleSheetUrl}
              sheetName={sheetName}
              dataRange={dataRange}
              chartType={chartType as 'bar' | 'line' | 'pie'}
              title=""
              subtitle=""
              height={chartHeight}
              showLegend={showLegend}
              showTooltips={showTooltips}
              animation={animation}
              refreshInterval={refreshInterval}
              enableAI={enableAI}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                {getChartIcon()}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Chart Data
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Configure Chart
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {isEditMode && !isEditing && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Chart Setup Instructions
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <p>• Make your Google Sheet publicly readable or provide an API key</p>
                  <p>• Use the first column for categories/labels, other columns for data series</p>
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