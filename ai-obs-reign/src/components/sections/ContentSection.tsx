import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const ContentSection = () => {
  return (
    <section id="content" className="py-20 bg-gray-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <FileText className="w-4 h-4 mr-2" />
            Platform Documentation
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-4">
            Comprehensive
            <span className="text-blue-600 block">Technical Documentation</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access detailed technical specifications, implementation guides, and best practices 
            for maximizing your observability platform deployment.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content Description */}
          <div className="space-y-6">
            <div className="bg-blue-950/20 rounded-xl p-8 shadow-sm border border-blue-800/30">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                Platform Technical Specifications
              </h3>
              
              <div className="space-y-4 text-gray-100">
                <p>
                  Our comprehensive documentation covers all aspects of the R.E.I.G.N platform, 
                  including architecture details, API specifications, and integration guidelines.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-green-400">System Architecture:</strong> Detailed overview of platform components and data flow
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-green-400">API Reference:</strong> Complete API documentation with examples and best practices
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-green-400">Integration Guides:</strong> Step-by-step instructions for common integrations
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-green-400">Security Protocols:</strong> Security implementation and compliance requirements
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="/Content.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                
                <a
                  href="/Content.pdf"
                  download
                  className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Preview */}
          <div className="relative">
          <div className="bg-blue-950/20 rounded-xl p-8 shadow-sm border border-blue-800/30">
          <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold text-gray-400 mb-4">
                  Technical Documentation</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>PDF Format</span>
                </div>
              </div>
              
              {/* Mock PDF Preview */}
              <div className="bg-purple-700/10 rounded-lg p-6 min-h-[400px] flex flex-col">
                <div className="space-y-4">
                  <div className="h-4 bg-blue-300/15 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-300/15 rounded w-full"></div>
                  <div className="h-4 bg-blue-300/15 rounded w-5/6"></div>
                  
                  <div className="mt-6">
                    <div className="h-6 bg-blue-200/15 rounded w-1/2 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-300/15 rounded w-full"></div>
                      <div className="h-3 bg-blue-300/15 rounded w-4/5"></div>
                      <div className="h-3 bg-blue-300/15 rounded w-full"></div>
                      <div className="h-3 bg-blue-300/15 rounded w-3/4"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="h-6 bg-green-200/15 rounded w-2/3 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-300/15 rounded w-full"></div>
                      <div className="h-3 bg-blue-300/15 rounded w-5/6"></div>
                      <div className="h-3 bg-blue-300/15 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-200/30">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Page 1 of 4</span>
                    <span>Last updated: Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
