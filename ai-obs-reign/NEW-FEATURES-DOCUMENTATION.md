# New Section Layouts & Email Marketing Integration

## Overview
This update adds three new dynamic section layouts and enhanced email marketing capabilities with support for both Mailchimp and Constant Contact.

## New Section Layouts

### 1. Social Media Feed Section (`social-feed`)
Display social media posts from LinkedIn, X/Twitter, Instagram, or Facebook.

**Features:**
- Multiple platform support (LinkedIn, Twitter, Instagram, Facebook)
- Three layout styles: grid, carousel, timeline
- Real-time engagement metrics (likes, comments, shares)
- Auto-refresh capability
- Profile information display
- Responsive design

**Configuration Options:**
- Platform selection
- Username/handle
- Number of posts to display
- Layout style
- Show/hide profile info and engagement metrics
- Auto-refresh toggle

### 2. Charts & Analytics Section (`charts`)
Interactive charts and graphs powered by Google Sheets data.

**Features:**
- Multiple chart types: bar, line, pie, area, scatter, donut, gauge
- Google Sheets integration for live data
- Auto-refresh capabilities
- Customizable chart height and styling
- Legend and tooltip controls
- Animation options

**Configuration Options:**
- Chart type selection
- Google Sheets URL
- Sheet name and data range
- Chart height
- Show/hide legend and tooltips
- Animation toggle
- Auto-refresh interval

### 3. Video Section (`video`)
Embed videos from YouTube, Vimeo, or upload custom videos.

**Features:**
- Multiple video sources: YouTube, Vimeo, direct upload, URL
- Custom aspect ratios (16:9, 4:3, 1:1, 21:9)
- Autoplay, mute, and loop controls
- Custom video controls overlay
- Poster image support
- Fullscreen capability

**Configuration Options:**
- Video source type
- Video URL or file upload
- Aspect ratio selection
- Autoplay, mute, loop toggles
- Show/hide controls
- Poster image
- Caption text

## Enhanced Email Marketing Integration

### Unified Email Marketing Service
A comprehensive service that supports both Mailchimp and Constant Contact with intelligent fallback capabilities.

**Features:**
- Dual provider support (Mailchimp + Constant Contact)
- Automatic fallback between providers
- Unified contact format
- Multiple list management
- Enhanced form validation
- Provider status monitoring

### New Components

#### EnhancedNewsletterSignup
A flexible newsletter signup component with multiple variants and provider support.

**Variants:**
- `default`: Full-featured signup form
- `compact`: Condensed version for sidebars
- `inline`: Horizontal layout for headers
- `minimal`: Simple email-only input

**Features:**
- Provider status display
- Custom field support (firstName, lastName, company)
- Real-time validation
- Success/error messaging
- Loading states

### Configuration

#### Environment Variables
Add these to your `.env.local` file:

```env
# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER=us21

# Constant Contact
CONSTANT_CONTACT_API_KEY=your_constant_contact_api_key
CONSTANT_CONTACT_ACCESS_TOKEN=your_access_token
```

#### Email Marketing Setup
```typescript
import { emailMarketingService, defaultEmailConfig } from '@/lib/unified-email-marketing';

// Configure providers
const config = {
  primaryProvider: 'mailchimp', // or 'constant-contact' or 'both'
  mailchimpEnabled: true,
  constantContactEnabled: true,
  fallbackEnabled: true
};

// Test connections
const status = await emailMarketingService.testConnections();
console.log(status);
```

## Usage Examples

### Social Feed Section
```typescript
// In your CMS, create a new section with layout: 'social-feed'
const socialFeedSection = {
  layout: 'social-feed',
  fields: {
    title: 'Latest Updates',
    platform: 'linkedin',
    username: 'your-company',
    postCount: 6,
    layout: 'grid',
    showProfile: true,
    showEngagement: true,
    autoRefresh: false
  }
};
```

### Charts Section
```typescript
// Create a charts section
const chartsSection = {
  layout: 'charts',
  fields: {
    title: 'Analytics Dashboard',
    chartType: 'bar',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/...',
    sheetName: 'Sheet1',
    dataRange: 'A1:C10',
    chartHeight: 400,
    showLegend: true,
    showTooltips: true,
    animation: true,
    refreshInterval: 5
  }
};
```

### Video Section
```typescript
// Create a video section
const videoSection = {
  layout: 'video',
  fields: {
    title: 'Product Demo',
    videoType: 'youtube',
    videoUrl: 'https://youtube.com/watch?v=...',
    aspectRatio: '16:9',
    autoplay: false,
    muted: true,
    showControls: true,
    caption: 'Watch our product demonstration'
  }
};
```

### Newsletter Signup
```typescript
import EnhancedNewsletterSignup from '@/components/ui/EnhancedNewsletterSignup';

// Basic usage
<EnhancedNewsletterSignup 
  title="Stay Updated"
  description="Get the latest insights"
  variant="default"
  showProviderStatus={true}
  customFields={{
    firstName: true,
    lastName: true,
    company: true
  }}
/>
```

## Implementation Notes

### Chart.js Integration
The charts section uses Chart.js for rendering. Make sure to install it:
```bash
npm install chart.js
```

### Google Sheets API
For Google Sheets integration, you'll need to:
1. Make your Google Sheet publicly readable
2. Use the published CSV export URL format
3. Ensure proper CORS headers

### Social Media APIs
The social feed section currently uses mock data. For production:
1. Implement actual API integrations (LinkedIn API, Twitter API v2, etc.)
2. Handle rate limiting and authentication
3. Add proper error handling for API failures

### Email Marketing Lists
Update the list IDs in your configuration files:
- `src/lib/mailchimp.ts` - Update `MAILCHIMP_LISTS`
- `src/lib/constant-contact.ts` - Update `CONSTANT_CONTACT_LISTS`

## Security Considerations

1. **API Keys**: Store sensitive API keys in environment variables
2. **CORS**: Configure proper CORS policies for external API calls
3. **Rate Limiting**: Implement rate limiting for form submissions
4. **Validation**: Always validate user input on both client and server side
5. **Error Handling**: Don't expose sensitive error details to users

## Performance Optimization

1. **Lazy Loading**: Charts and videos are loaded on demand
2. **Caching**: Implement caching for Google Sheets data
3. **Debouncing**: Use debouncing for auto-refresh features
4. **Image Optimization**: Optimize social media images and video thumbnails

## Future Enhancements

1. **Real Social Media APIs**: Replace mock data with actual API integrations
2. **Advanced Chart Types**: Add more chart types and customization options
3. **Video Analytics**: Track video engagement metrics
4. **A/B Testing**: Add A/B testing capabilities for email marketing
5. **Automation**: Add automated email sequences and workflows
