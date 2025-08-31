# OpsCompanion - AI Observability Platform

A professional replica of the OpsCompanion website built with Next.js, TypeScript, and Tailwind CSS, featuring integrated content from the provided technical documentation.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive design that works on all devices
- **AI-Focused Content**: Comprehensive sections covering AI observability platform features
- **PDF Integration**: Direct access to technical documentation via embedded PDF
- **Professional UI**: Clean, modern interface matching industry standards
- **Performance Optimized**: Built for speed and SEO optimization

## 📋 Sections

1. **Hero Section**: Compelling introduction with key value propositions
2. **Features Section**: Comprehensive overview of platform capabilities
3. **Solutions Section**: Industry-specific solutions and use cases
4. **Content Section**: Integrated PDF documentation access
5. **About Section**: Company information and team values
6. **Contact Section**: Multiple contact methods and inquiry form

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Build Tool**: Next.js built-in bundler

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd ai-obs-reign
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── SolutionsSection.tsx
│       ├── ContentSection.tsx
│       ├── AboutSection.tsx
│       └── ContactSection.tsx
└── public/
    └── Content.pdf
```

## 📄 Content Integration

The website integrates the provided `Content.pdf` file in multiple ways:

- **Direct PDF Access**: Users can view and download the PDF directly from the Content Section
- **Contextual Integration**: PDF content is referenced throughout the site sections
- **Technical Documentation**: The PDF serves as comprehensive technical documentation

## 🎨 Design Features

- **Professional Color Scheme**: Blue and gray palette suitable for enterprise software
- **Modern Typography**: Inter font for excellent readability
- **Smooth Animations**: Subtle hover effects and transitions
- **Accessible Design**: Proper contrast ratios and semantic HTML
- **Mobile-First**: Responsive design optimized for all screen sizes

## 🔧 Customization

The website is built with modularity in mind:

- **Component-Based**: Each section is a separate, reusable component
- **CSS Variables**: Easy theme customization through CSS custom properties
- **TypeScript**: Full type safety for reliable development
- **Tailwind CSS**: Utility-first styling for rapid customization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Known Issues & Solutions

### Hydration Mismatch with Browser Extensions

If you encounter hydration mismatch errors related to SVG icons, this is likely caused by browser extensions like Dark Reader that modify the DOM after page load. 

**Solution implemented:**
- Added `suppressHydrationWarning` to icon containers
- Added CSS rules to prevent extension interference with Lucide icons
- Created a reusable `Icon` component for consistent handling

**User workaround:**
- Disable Dark Reader or similar extensions during development
- The issue only affects development mode; production builds are unaffected

## 🤝 Contributing

This project was built as a professional replica. For modifications:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for demonstration purposes. Please ensure you have appropriate permissions for any content usage.

---

Built with ❤️ using Next.js and modern web technologies.