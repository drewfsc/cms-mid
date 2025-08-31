import React from 'react';
import { Users, Target, Zap, Award } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { number: '500+', label: 'Enterprise Customers' },
    { number: '99.9%', label: 'Platform Uptime' },
    { number: '50M+', label: 'Events Processed Daily' },
    { number: '24/7', label: 'Support Coverage' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We exist to simplify DevOps complexity and empower teams to focus on innovation.'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Every feature and decision is made with our customers\' success as the primary consideration.'
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI and machine learning to stay ahead of industry challenges.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in security, reliability, and performance.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            About R.E.I.G.N
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Empowering DevOps Teams
            <span className="text-blue-600 block">Worldwide</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded by experienced DevOps engineers, R.E.I.G.N was created to solve the 
            observability challenges we faced in our own careers. Today, we help teams 
            around the world achieve operational excellence.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Built by DevOps Engineers, for DevOps Engineers
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our team combines decades of experience in DevOps, Site Reliability Engineering, 
            and AI/ML to create solutions that truly understand your challenges.
          </p>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Meet the Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
