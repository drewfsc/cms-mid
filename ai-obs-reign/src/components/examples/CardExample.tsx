import React from 'react';
import Card from '@/components/ui/Card';

const CardExample: React.FC = () => {
  const features = [
    { text: "10 Launch Weeks" },
    { text: "10 Influencers Post" },
    { text: "100.000 Views" },
    { text: "10 Reddit Posts" },
    { text: "2 Hours Marketing Consultation" }
  ];

  const handleBookCall = () => {
    console.log('Book a call clicked');
    // Add your booking logic here
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <Card
        title="Explosive Growth"
        description="Perfect for your next content, leave to us and enjoy the result!"
        features={features}
        buttonText="Book a Call"
        onButtonClick={handleBookCall}
      />
    </div>
  );
};

export default CardExample;
