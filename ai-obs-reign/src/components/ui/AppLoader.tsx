import React from 'react';

const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center items-center">
      <div className="flex justify-center items-center relative cursor-not-allowed scale-75">
        <div className="loader">
          <div className="intern absolute text-white z-[9999] h-full w-full flex items-center align-middle before:content-['100%'] before:animate-percent">
          </div>
          <div className="external-shadow w-56 h-56 rounded-full flex justify-center items-center relative shadow-[0.5em_0.5em_3em_rgb(175,0,166),-0.5em_0.5em_3em_rgb(2,0,141),0.5em_-0.5em_3em_rgb(0,218,18),-0.5em_-0.5em_3em_rgb(0,167,209)] z-[999] animate-rotate bg-black">
            <div className="central flex justify-center items-center relative w-56 h-56 rounded-full shadow-[0.5em_0.5em_3em_rgb(175,0,166),-0.5em_0.5em_3em_rgb(2,0,141),0.5em_-0.5em_3em_rgb(0,218,18),-0.5em_-0.5em_3em_rgb(0,167,209)]">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
