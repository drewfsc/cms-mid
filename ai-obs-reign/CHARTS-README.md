# Google Sheets Charts Integration

This project provides comprehensive chart functionality that can pull data directly from Google Sheets and render interactive bar charts, line charts, and pie charts using Chart.js.

## Features

- **Multiple Chart Types**: Bar, Line, and Pie charts
- **Google Sheets Integration**: Direct data fetching from Google Sheets URLs
- **AI-Powered Analysis**: Automatic chart type detection and data insights
- **Real-time Updates**: Auto-refresh capabilities
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Robust error handling with user-friendly messages
- **Export Functionality**: Download charts as PNG images
- **Customizable Styling**: Full control over chart appearance

## Components

### 1. GoogleSheetsChart (Advanced)

The main chart component with full customization options.

```tsx
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';

<GoogleSheetsChart
  googleSheetUrl="https://docs.google.com/spreadsheets/d/..."
  chartType="bar"
  title="Sales Dashboard"
  subtitle="Monthly sales data"
  height={500}
  showLegend={true}
  showTooltips={true}
  animation={true}
  refreshInterval={5}
  enableAI={true}
  onDataLoad={(data) => console.log('Data loaded:', data)}
  onError={(error) => console.error('Error:', error)}
/>
```

**Props:**
- `googleSheetUrl`: Google Sheets URL (required)
- `chartType`: 'bar' | 'line' | 'pie' (required)
- `title`: Chart title (optional)
- `subtitle`: Chart subtitle (optional)
- `height`: Chart height in pixels (default: 400)
- `showLegend`: Show/hide legend (default: true)
- `showTooltips`: Show/hide tooltips (default: true)
- `animation`: Enable animations (default: true)
- `refreshInterval`: Auto-refresh interval in minutes (default: 0)
- `enableAI`: Enable AI analysis (default: true)
- `apiKey`: Google Sheets API key (optional)
- `className`: Additional CSS classes
- `onDataLoad`: Callback when data loads
- `onError`: Callback when error occurs

### 2. SimpleChart (Basic)

A simplified chart component for quick implementations.

```tsx
import SimpleChart from '@/components/charts/SimpleChart';

<SimpleChart
  googleSheetUrl="https://docs.google.com/spreadsheets/d/..."
  chartType="bar"
  title="My Chart"
  height={300}
/>
```

**Props:**
- `googleSheetUrl`: Google Sheets URL (required)
- `chartType`: 'bar' | 'line' | 'pie' (required)
- `title`: Chart title (optional)
- `height`: Chart height in pixels (default: 300)
- `className`: Additional CSS classes

## Google Sheets Setup

### Public Sheets (Recommended)

1. **Make your sheet public:**
   - Open your Google Sheet
   - Click "Share" → "Change to anyone with the link"
   - Set permission to "Viewer"

2. **Use the sheet URL:**
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0
   ```

3. **No API key required** - the component will use CSV export method

### Private Sheets

1. **Get Google Sheets API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Restrict the key to Google Sheets API

2. **Provide the API key:**
   ```tsx
   <GoogleSheetsChart
     googleSheetUrl="https://docs.google.com/spreadsheets/d/..."
     apiKey="YOUR_API_KEY"
     // ... other props
   />
   ```

## Data Format Requirements

### Bar Charts
- **Column A**: Categories/Labels
- **Column B+**: Data series values
- **Headers**: Include column headers in your data range

Example:
```
Month        | Sales | Profit
January      | 1000  | 200
February     | 1200  | 250
March        | 1100  | 180
```

### Line Charts
- **Column A**: Time periods or categories
- **Column B+**: Data series values
- **Time Detection**: Automatic detection of date patterns

Example:
```
Date         | Revenue | Users
2024-01-01   | 5000    | 100
2024-01-02   | 5200    | 105
2024-01-03   | 4800    | 98
```

### Pie Charts
- **Column A**: Labels/Categories
- **Column B**: Values/Percentages
- **Perfect for**: Proportions, distributions, market share

Example:
```
Category     | Value
Desktop      | 45
Mobile       | 35
Tablet       | 20
```

## Usage Examples

### Basic Implementation

```tsx
import React from 'react';
import SimpleChart from '@/components/charts/SimpleChart';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SimpleChart
        googleSheetUrl="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
        chartType="bar"
        title="Sales Data"
        height={300}
      />
      
      <SimpleChart
        googleSheetUrl="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
        chartType="line"
        title="Trend Analysis"
        height={300}
      />
      
      <SimpleChart
        googleSheetUrl="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
        chartType="pie"
        title="Distribution"
        height={300}
      />
    </div>
  );
}
```

### Advanced Implementation

```tsx
import React, { useState } from 'react';
import GoogleSheetsChart from '@/components/charts/GoogleSheetsChart';

export default function AdvancedDashboard() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div>
      <GoogleSheetsChart
        googleSheetUrl="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
        chartType="bar"
        title="Advanced Analytics"
        subtitle="Real-time data from Google Sheets"
        height={500}
        showLegend={true}
        showTooltips={true}
        animation={true}
        refreshInterval={5}
        enableAI={true}
        onDataLoad={(data) => {
          setChartData(data);
          console.log('Chart data loaded:', data);
        }}
        onError={(error) => {
          setError(error);
          console.error('Chart error:', error);
        }}
      />
      
      {chartData && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            Data loaded successfully! {chartData.labels.length} categories, {chartData.datasets.length} series.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
```

## AI Analysis Features

When `enableAI={true}`, the component provides:

- **Automatic Chart Type Detection**: AI analyzes your data and suggests the best chart type
- **Data Insights**: Generates insights about your data patterns
- **Confidence Scoring**: Shows confidence level for AI recommendations
- **Data Quality Analysis**: Identifies data completeness and quality issues

## Error Handling

The components handle various error scenarios:

- **Invalid Google Sheets URL**: Clear error message with format requirements
- **Private Sheet Access**: Suggests making sheet public or providing API key
- **Insufficient Data**: Warns when data doesn't meet minimum requirements
- **Network Issues**: Retry functionality for failed requests
- **CORS Issues**: Fallback to CSV export method

## Styling and Customization

### CSS Classes

The components use Tailwind CSS classes and can be customized:

```tsx
<GoogleSheetsChart
  className="my-custom-chart rounded-xl shadow-2xl"
  // ... other props
/>
```

### Chart.js Options

For advanced customization, you can extend the chart options:

```tsx
// In GoogleSheetsChart.tsx, modify getChartOptions()
const getChartOptions = (): ChartOptions<any> => {
  return {
    // ... existing options
    plugins: {
      legend: {
        position: 'right', // Customize legend position
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };
};
```

## Performance Considerations

- **Data Caching**: Charts cache data to avoid unnecessary API calls
- **Lazy Loading**: Chart.js is loaded dynamically to reduce bundle size
- **Responsive Design**: Charts automatically resize based on container
- **Memory Management**: Chart instances are properly destroyed on unmount

## Troubleshooting

### Common Issues

1. **"Failed to fetch data from Google Sheets"**
   - Check if the sheet is public
   - Verify the URL format
   - Ensure the sheet has data in the specified range

2. **"Invalid Google Sheets URL format"**
   - Use the full Google Sheets URL
   - Include the `/edit#gid=0` part
   - Don't use shortened URLs

3. **"Insufficient data"**
   - Ensure your data range includes headers
   - Check that you have at least 2 rows of data
   - Verify the data range format (e.g., A1:C10)

4. **Charts not rendering**
   - Check browser console for errors
   - Ensure Chart.js dependencies are installed
   - Verify the data format matches chart type requirements

### Debug Mode

Enable debug logging:

```tsx
<GoogleSheetsChart
  // ... props
  onDataLoad={(data) => console.log('Chart data:', data)}
  onError={(error) => console.error('Chart error:', error)}
/>
```

## Dependencies

Required packages:

```bash
npm install chart.js react-chartjs-2
```

Optional (for advanced features):
```bash
npm install @types/chart.js
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This chart integration is part of the R.E.I.G.N project and follows the same license terms.
