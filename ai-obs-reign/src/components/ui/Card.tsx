import React from 'react';

interface CardFeature {
  text: string;
}

interface CardProps {
  title: string;
  description: string;
  features: CardFeature[];
  buttonText?: string;
  onButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  features,
  buttonText = "Book a Call",
  onButtonClick
}) => {
  return (
    <div className="relative">
      <div className="card relative flex flex-col gap-4 p-4 w-76 bg-gray-900 rounded-2xl shadow-[0px_-16px_24px_0px_rgba(255,255,255,0.25)_inset] bg-gradient-to-br from-gray-900 via-gray-900 to-purple-600/20">
        {/* Rotating Border */}
        <div className="card__border overflow-hidden pointer-events-none absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+2px)] h-[calc(100%+2px)] bg-gradient-to-b from-white/50 to-gray-600 rounded-2xl">
          <div className="card__border-before absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-40 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-spin-slow"></div>
        </div>

        {/* Title Container */}
        <div className="card_title__container">
          <span className="card_title text-white text-base font-medium">{title}</span>
          <p className="card_paragraph mt-1 w-[65%] text-gray-300 text-xs leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <hr className="line w-full h-0.5 bg-gray-700 border-none" />

        {/* Features List */}
        <ul className="card__list flex flex-col gap-2">
          {features.map((feature, index) => (
            <li key={index} className="card__list_item flex items-center gap-2">
              <span className="check flex justify-center items-center w-4 h-4 bg-purple-500 rounded-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 16 16" 
                  fill="currentColor" 
                  className="check_svg w-3 h-3 fill-gray-900"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
              <span className="list_text text-white text-xs">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <button 
          className="button cursor-pointer p-2 w-full bg-gradient-to-b from-purple-600 to-pink-500 text-white text-xs border-0 rounded-full shadow-[inset_0_-2px_25px_-4px_white] hover:from-purple-700 hover:to-pink-600 transition-all duration-200"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
