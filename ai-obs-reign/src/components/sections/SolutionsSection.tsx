import React from 'react';
import { 
  Cloud, 
  Container, 
  Server, 
  Smartphone, 
  Globe, 
  Database,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const SolutionsSection = () => {
  const solutions = [
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Monitor and optimize cloud resources across AWS, Azure, GCP, and hybrid environments.',
      features: ['Multi-cloud visibility', 'Cost optimization', 'Auto-scaling insights', 'Resource tracking'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Container,
      title: 'Container Orchestration',
      description: 'Complete observability for Kubernetes, Docker, and container-based applications.',
      features: ['Pod monitoring', 'Service mesh visibility', 'Resource allocation', 'Health checks'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Server,
      title: 'Infrastructure Monitoring',
      description: 'Traditional and modern infrastructure monitoring with AI-powered anomaly detection.',
      features: ['Server health', 'Network monitoring', 'Storage analytics', 'Performance metrics'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Smartphone,
      title: 'Application Performance',
      description: 'End-to-end application monitoring with user experience insights and error tracking.',
      features: ['APM integration', 'Error tracking', 'User sessions', 'Performance optimization'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Database,
      title: 'Database Observability',
      description: 'Database performance monitoring, query optimization, and capacity planning.',
      features: ['Query analysis', 'Index optimization', 'Connection pooling', 'Backup monitoring'],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Globe,
      title: 'Global Operations',
      description: 'Worldwide infrastructure monitoring with regional insights and compliance.',
      features: ['Multi-region monitoring', 'Compliance reporting', 'SLA tracking', 'Global dashboards'],
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <Server className="w-4 h-4 mr-2" />
            Solutions
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tailored Solutions for
            <span className="text-blue-600 block">Every Environment</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From cloud-native startups to enterprise data centers, OpsCompanion adapts to your 
            infrastructure and scales with your needs.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {solution.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {solution.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {solution.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Don&apos;t See Your Use Case?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our platform is highly customizable. Let&apos;s discuss how we can tailor 
            OpsCompanion to meet your specific observability requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg border border-blue-500 transition-colors">
              View All Solutions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
