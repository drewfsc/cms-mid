import React from 'react';

const LoaderBkp = () => {
  return (
    <div className="flex justify-center items-center relative cursor-not-allowed scale-75">
      <div className="loader">
        <div className="intern absolute text-white z-[9999] before:content-['100%'] before:animate-percent">
        </div>
        <div className="external-shadow w-56 h-56 rounded-full flex justify-center items-center relative shadow-[0.5em_0.5em_3em_rgb(175,0,166),-0.5em_0.5em_3em_rgb(2,0,141),0.5em_-0.5em_3em_rgb(0,218,18),-0.5em_-0.5em_3em_rgb(0,167,209)] z-[999] animate-rotate bg-gray-800">
          <div className="central flex justify-center items-center relative w-56 h-56 rounded-full shadow-[0.5em_0.5em_3em_rgb(175,0,166),-0.5em_0.5em_3em_rgb(2,0,141),0.5em_-0.5em_3em_rgb(0,218,18),-0.5em_-0.5em_3em_rgb(0,167,209)]">
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoaderBkp;
