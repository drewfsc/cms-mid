import React from 'react';
import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
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
      color: 'text-blue-600'
    },
    {
      icon: AlertTriangle,
      title: 'Intelligent Alerting',
      description: 'Smart alert system that reduces noise and focuses on what matters most, with contextual information for faster resolution.',
      color: 'text-red-600'
    },
    {
      icon: Zap,
      title: 'Automated Response',
      description: 'Automated incident response workflows that can resolve common issues without human intervention.',
      color: 'text-yellow-600'
    },
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description: 'Comprehensive monitoring of infrastructure, applications, and services with real-time metrics and dashboards.',
      color: 'text-green-600'
    },
    {
      icon: Network,
      title: 'Service Mapping',
      description: 'Automatic discovery and mapping of service dependencies to understand the impact of issues across your stack.',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Historical Analysis',
      description: 'Deep historical analysis with trend identification and capacity planning recommendations.',
      color: 'text-indigo-600'
    },
    {
      icon: Shield,
      title: 'Security Monitoring',
      description: 'Integrated security monitoring with threat detection and compliance reporting capabilities.',
      color: 'text-cyan-600'
    },
    {
      icon: Database,
      title: 'Data Integration',
      description: 'Seamless integration with existing tools and data sources for unified observability.',
      color: 'text-pink-600'
    },
    {
      icon: Cpu,
      title: 'Performance Optimization',
      description: 'AI-driven performance recommendations and automated optimization suggestions.',
      color: 'text-orange-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for
            <span className="text-blue-600 block">Complete Observability</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="group relative bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Ready to experience the power of AI-driven observability?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Start Free Trial
            </button>
            <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
