import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  const benefits = [
    'Real-time AI-powered monitoring',
    'Automated incident response',
    'Predictive analytics and insights',
    'Seamless DevOps integration'
  ];

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                AI-Powered Observability Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-blue-600 block">DevOps Operations</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                OpsCompanion delivers intelligent observability and automation for modern DevOps teams. 
                Monitor, analyze, and optimize your infrastructure with AI-powered insights that scale with your business.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#get-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading DevOps teams</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-gray-400 font-semibold">TechCorp</div>
                <div className="text-gray-400 font-semibold">DataFlow</div>
                <div className="text-gray-400 font-semibold">CloudOps</div>
                <div className="text-gray-400 font-semibold">ScaleUp</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
              {/* Mock Dashboard */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">All Systems Operational</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">2.1s</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">847</div>
                    <div className="text-sm text-gray-600">Active Services</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-gray-600">Alerts Resolved</div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Performance Trend</div>
                  <div className="h-20 bg-gradient-to-r from-blue-200 to-blue-400 rounded opacity-50"></div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
