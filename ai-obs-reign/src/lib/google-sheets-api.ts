/* eslint-disable @typescript-eslint/no-unused-vars */
// Google Sheets API integration with AI-powered data interpretation

export interface GoogleSheetsConfig {
  apiKey: string;
  sheetId: string;
  range: string;
  sheetName?: string;
}

export interface ParsedChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
  metadata: {
    totalRows: number;
    totalColumns: number;
    dataTypes: string[];
    lastUpdated: string;
  };
}

export interface AIAnalysisResult {
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'donut' | 'gauge';
  confidence: number;
  reasoning: string;
  suggestedTitle: string;
  insights: string[];
}

export class GoogleSheetsManager {
  private static readonly GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

  /**
   * Extract sheet ID from Google Sheets URL
   */
  static extractSheetId(url: string): string | null {
    try {
      const patterns = [
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        /\/d\/([a-zA-Z0-9-_]+)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    } catch (err) {
      console.error('Error extracting sheet ID:', err);
      return null;
    }
  }

  /**
   * Fetch raw data from Google Sheets
   */
  static async fetchSheetData(config: GoogleSheetsConfig): Promise<string[][]> {
    try {
      const { apiKey, sheetId, range } = config;
      const url = `${this.GOOGLE_SHEETS_API_BASE}/${sheetId}/values/${range}?key=${apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (err) {
      console.error('Error fetching sheet data:', err);
      throw new Error('Failed to fetch data from Google Sheets');
    }
  }

  /**
   * Fetch data from Google Sheets using CSV export (for public sheets)
   */
  static async fetchSheetDataFromCSV(sheetUrl: string, sheetName: string = 'Sheet1', range: string = 'A1:C10'): Promise<string[][]> {
    try {
      // Extract sheet ID from URL
      const sheetId = this.extractSheetId(sheetUrl);
      if (!sheetId) {
        throw new Error('Invalid Google Sheets URL format');
      }

      console.log('Attempting to fetch CSV data for sheet ID:', sheetId);
      
      // Try multiple CSV export URL formats
      const csvUrls = [
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&range=${range}`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0&range=${range}`
      ];

      let lastError: Error | null = null;
      
      for (const csvUrl of csvUrls) {
        try {
          console.log('Trying CSV URL:', csvUrl);
          
          const response = await fetch(csvUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/csv,text/plain,*/*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            mode: 'cors'
          });

          if (!response.ok) {
            console.log(`URL failed with status: ${response.status} ${response.statusText}`);
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            continue;
          }

          const csvText = await response.text();
          console.log('CSV response length:', csvText.length);
          console.log('CSV preview:', csvText.substring(0, 200) + '...');

          if (!csvText || csvText.trim() === '') {
            console.log('Empty CSV response');
            lastError = new Error('Empty CSV response');
            continue;
          }

          // Parse CSV data with better error handling
          const rows = csvText.split('\n')
            .map(row => {
              // Handle CSV parsing more robustly
              const cells: string[] = [];
              let currentCell = '';
              let inQuotes = false;
              
              for (let i = 0; i < row.length; i++) {
                const char = row[i];
                
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  cells.push(currentCell.trim());
                  currentCell = '';
                } else {
                  currentCell += char;
                }
              }
              
              // Add the last cell
              cells.push(currentCell.trim());
              
              return cells.map(cell => cell.replace(/^"|"$/g, ''));
            })
            .filter(row => row.some(cell => cell.trim() !== '')); // Remove empty rows

          if (rows.length === 0) {
            console.log('No data rows found after parsing');
            lastError = new Error('No data found in CSV export');
            continue;
          }

          console.log('Successfully parsed CSV data:', rows.length, 'rows');
          console.log('Sample data:', rows.slice(0, 3));
          return rows;
          
        } catch (urlError) {
          console.log('URL attempt failed:', urlError);
          lastError = urlError instanceof Error ? urlError : new Error(String(urlError));
          continue;
        }
      }

      // If all URLs failed, throw the last error
      throw lastError || new Error('All CSV export attempts failed');
      
    } catch (err) {
      console.error('Error fetching CSV data:', err);
      throw new Error(`Failed to fetch data from CSV export: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  /**
   * AI-powered data analysis to determine optimal chart type
   */
  static async analyzeDataForChartType(data: string[][]): Promise<AIAnalysisResult> {
    // Simulate AI analysis - in a real implementation, you would call an AI service
    // like OpenAI, Claude, or Google's Gemini API
    
    if (!data || data.length < 2) {
      return {
        chartType: 'bar',
        confidence: 0.5,
        reasoning: 'Insufficient data for analysis',
        suggestedTitle: 'Data Visualization',
        insights: ['Limited data available for analysis']
      };
    }

    const headers = data[0];
    const rows = data.slice(1);
    const numericColumns = this.identifyNumericColumns(headers, rows);
    const categoricalColumns = this.identifyCategoricalColumns(headers, rows);

    // AI-powered analysis logic
    let chartType: AIAnalysisResult['chartType'] = 'bar';
    let confidence = 0.7;
    let reasoning = '';
    let suggestedTitle = 'Data Analysis';
    const insights: string[] = [];

    if (numericColumns.length >= 2) {
      if (this.hasTimeSeriesPattern(headers, rows)) {
        chartType = 'line';
        confidence = 0.9;
        reasoning = 'Time series data detected - line chart recommended';
        suggestedTitle = 'Trend Analysis';
        insights.push('Data shows temporal patterns');
      } else if (numericColumns.length === 2) {
        chartType = 'scatter';
        confidence = 0.8;
        reasoning = 'Two numeric variables detected - scatter plot recommended';
        suggestedTitle = 'Correlation Analysis';
        insights.push('Potential correlation between variables');
      } else {
        chartType = 'bar';
        confidence = 0.8;
        reasoning = 'Multiple numeric variables detected - bar chart recommended';
        suggestedTitle = 'Comparative Analysis';
        insights.push('Multiple data series for comparison');
      }
    } else if (categoricalColumns.length > 0 && numericColumns.length === 1) {
      chartType = 'pie';
      confidence = 0.9;
      reasoning = 'Categorical data with single numeric value - pie chart recommended';
      suggestedTitle = 'Distribution Analysis';
      insights.push('Data represents proportions or percentages');
    }

    // Add more insights based on data characteristics
    if (rows.length > 50) {
      insights.push('Large dataset - consider aggregation');
    }
    if (numericColumns.length > 5) {
      insights.push('High-dimensional data - consider dimensionality reduction');
    }

    return {
      chartType,
      confidence,
      reasoning,
      suggestedTitle,
      insights
    };
  }

  /**
   * Parse raw sheet data into Chart.js format
   */
  static parseDataForChart(
    data: string[][], 
    chartType: string,
    aiAnalysis?: AIAnalysisResult
  ): ParsedChartData {
    if (!data || data.length < 2) {
      throw new Error('Insufficient data for chart generation');
    }

    const headers = data[0];
    const rows = data.slice(1);
    const numericColumns = this.identifyNumericColumns(headers, rows);
    const categoricalColumns = this.identifyCategoricalColumns(headers, rows);

    let labels: string[] = [];
    let datasets: ParsedChartData['datasets'] = [];

    // Generate colors for datasets
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // blue
      'rgba(16, 185, 129, 0.8)',   // green
      'rgba(245, 101, 101, 0.8)',  // red
      'rgba(251, 191, 36, 0.8)',   // yellow
      'rgba(139, 92, 246, 0.8)',   // purple
      'rgba(236, 72, 153, 0.8)',   // pink
    ];

    if (chartType === 'pie' || chartType === 'donut') {
      // For pie charts, use first categorical column as labels and first numeric as data
      const labelColumn = categoricalColumns[0] || 0;
      const dataColumn = numericColumns[0] || 1;
      
      labels = rows.map(row => row[labelColumn] || 'Unknown');
      const dataValues = rows.map(row => parseFloat(row[dataColumn]) || 0);
      
      datasets = [{
        label: headers[dataColumn] || 'Values',
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(c => c.replace('0.8', '1')),
        borderWidth: 2
      }];
    } else {
      // For other chart types, use first column as labels
      const labelColumn = categoricalColumns[0] || 0;
      labels = rows.map(row => row[labelColumn] || 'Unknown');
      
      // Create datasets for each numeric column
      datasets = numericColumns.map((colIndex, i) => {
        const dataValues = rows.map(row => parseFloat(row[colIndex]) || 0);
        return {
          label: headers[colIndex] || `Series ${i + 1}`,
          data: dataValues,
          backgroundColor: colors[i % colors.length],
          borderColor: colors[i % colors.length].replace('0.8', '1'),
          borderWidth: 2
        };
      });
    }

    return {
      labels,
      datasets,
      metadata: {
        totalRows: rows.length,
        totalColumns: headers.length,
        dataTypes: headers.map((_, i) => 
          numericColumns.includes(i) ? 'numeric' : 'categorical'
        ),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Identify columns containing numeric data
   */
  private static identifyNumericColumns(headers: string[], rows: string[][]): number[] {
    const numericColumns: number[] = [];
    
    for (let col = 0; col < headers.length; col++) {
      const sampleValues = rows.slice(0, Math.min(10, rows.length))
        .map(row => row[col])
        .filter(val => val && val.trim() !== '');
      
      if (sampleValues.length === 0) continue;
      
      const numericCount = sampleValues.filter(val => 
        !isNaN(parseFloat(val)) && isFinite(parseFloat(val))
      ).length;
      
      // Consider column numeric if >70% of sample values are numbers
      if (numericCount / sampleValues.length > 0.7) {
        numericColumns.push(col);
      }
    }
    
    return numericColumns;
  }

  /**
   * Identify columns containing categorical data
   */
  private static identifyCategoricalColumns(headers: string[], rows: string[][]): number[] {
    const categoricalColumns: number[] = [];
    
    for (let col = 0; col < headers.length; col++) {
      const sampleValues = rows.slice(0, Math.min(10, rows.length))
        .map(row => row[col])
        .filter(val => val && val.trim() !== '');
      
      if (sampleValues.length === 0) continue;
      
      const numericCount = sampleValues.filter(val => 
        !isNaN(parseFloat(val)) && isFinite(parseFloat(val))
      ).length;
      
      // Consider column categorical if <30% of sample values are numbers
      if (numericCount / sampleValues.length < 0.3) {
        categoricalColumns.push(col);
      }
    }
    
    return categoricalColumns;
  }

  /**
   * Detect if data has time series patterns
   */
  private static hasTimeSeriesPattern(headers: string[], rows: string[][]): boolean {
    const timeKeywords = ['date', 'time', 'year', 'month', 'day', 'week', 'quarter'];
    
    // Check headers for time-related keywords
    const hasTimeHeader = headers.some(header => 
      timeKeywords.some(keyword => 
        header.toLowerCase().includes(keyword)
      )
    );
    
    if (hasTimeHeader) return true;
    
    // Check first column for date patterns
    const firstColumnValues = rows.slice(0, Math.min(5, rows.length))
      .map(row => row[0])
      .filter(val => val && val.trim() !== '');
    
    const datePatternCount = firstColumnValues.filter(val => {
      // Simple date pattern detection
      return /^\d{4}-\d{2}-\d{2}/.test(val) || // YYYY-MM-DD
             /^\d{2}\/\d{2}\/\d{4}/.test(val) || // MM/DD/YYYY
             /^\d{1,2}\/\d{1,2}\/\d{4}/.test(val); // M/D/YYYY
    }).length;
    
    return datePatternCount / firstColumnValues.length > 0.5;
  }

  /**
   * Get AI-powered insights about the data
   */
  static async generateDataInsights(data: string[][]): Promise<string[]> {
    const insights: string[] = [];
    
    if (!data || data.length < 2) {
      return ['Insufficient data for analysis'];
    }

    const headers = data[0];
    const rows = data.slice(1);
    const numericColumns = this.identifyNumericColumns(headers, rows);
    const categoricalColumns = this.identifyCategoricalColumns(headers, rows);

    // Basic insights
    insights.push(`Dataset contains ${rows.length} rows and ${headers.length} columns`);
    
    if (numericColumns.length > 0) {
      insights.push(`${numericColumns.length} numeric columns detected`);
    }
    
    if (categoricalColumns.length > 0) {
      insights.push(`${categoricalColumns.length} categorical columns detected`);
    }

    // Data quality insights
    const emptyCells = rows.reduce((total, row) => 
      total + row.filter(cell => !cell || cell.trim() === '').length, 0
    );
    
    const totalCells = rows.length * headers.length;
    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    
    if (completeness < 90) {
      insights.push(`Data completeness: ${completeness.toFixed(1)}% (consider data cleaning)`);
    } else {
      insights.push(`High data quality: ${completeness.toFixed(1)}% completeness`);
    }

    // Pattern detection
    if (this.hasTimeSeriesPattern(headers, rows)) {
      insights.push('Time series pattern detected - suitable for trend analysis');
    }

    return insights;
  }
}
