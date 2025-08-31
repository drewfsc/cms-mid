import React from 'react';
import Link from 'next/link';

import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Play,
  ArrowRight,
  Clock, 
  Network, 
  Cpu,
  Database
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms analyze patterns and predict potential issues before they impact your systems.',
      color: 'text-blue-300',
      bg: 'bg-blue-900/20'
    },
    {
      icon: AlertTriangle,
      title: 'Intelligent Alerting',
      description: 'Smart alert system that reduces noise and focuses on what matters most, with contextual information for faster resolution.',
      color: 'text-red-300',
      bg: 'bg-red-900/20'

    },
    {
      icon: Zap,
      title: 'Automated Response',
      description: 'Automated incident response workflows that can resolve common issues without human intervention.',
      color: 'text-yellow-300',
      bg: 'bg-yelow-900/20'
    },
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description: 'Comprehensive monitoring of infrastructure, applications, and services with real-time metrics and dashboards.',
      color: 'text-green-300',
      bg: 'bg-green-900/20'
    },
    {
      icon: Network,
      title: 'Service Mapping',
      description: 'Automatic discovery and mapping of service dependencies to understand the impact of issues across your stack.',
      color: 'text-purple-300',
      bg: 'bg-purple-900/20'
    },
    {
      icon: Clock,
      title: 'Historical Analysis',
      description: 'Deep historical analysis with trend identification and capacity planning recommendations.',
      color: 'text-indigo-300',
      bg: 'bg-indigo-900/20'
    },
    {
      icon: Shield,
      title: 'Security Monitoring',
      description: 'Integrated security monitoring with threat detection and compliance reporting capabilities.',
      color: 'text-cyan-300',
      bg: 'bg-cyan-900/20'
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Seamless integration with existing tools and data sources for unified observability.',
      color: 'text-pink-300',
      bg: 'bg-pink-900/20'
    },
    {
      icon: Cpu,
      title: 'Performance Optimization',
      description: 'AI-driven performance recommendations and automated optimization suggestions.',
      color: 'text-orange-300',
      bg: 'bg-orange-900/20'
    }
  ];

  return (
    <section id="features" className="py-20 bg-black-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-lg font-extralight mb-4">
            <Cpu className="w-4 h-4 mr-2 bg-purple-800/20" />
            Platform Features
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for
            <span className="text-blue-400 block">Complete Observability</span>
          </h2>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and insights you need to monitor, 
            analyze, and optimize your DevOps infrastructure with AI-powered intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative ${feature.bg} backdrop-blur-sm border border-purple-300/10 rounded-xl p-8 hover:shadow-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-200 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400 transition-colors pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-200 mb-6 text-2xl">
            Ready to experience the power of AI-driven observability?
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-800 to-green-600 hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
              <Link
                href="#get-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
        </div>
      </div>
      
      {/* Gradient transition to white background */}
      <div className="h-2"></div>
    </section>
  );
};

export default FeaturesSection;
