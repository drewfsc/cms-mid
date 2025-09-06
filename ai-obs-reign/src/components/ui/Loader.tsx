'use client';


import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="loader loader-1">
          <span />
        </div>
        <div className="loader loader-2">
          <span />
        </div>
        <div className="loader loader-3">
          <i />
        </div>
        <div className="loader loader-4">
          <i />
        </div>
      </div>
      
      <style jsx>{`
        .loader-container {
          position: relative;
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-box-reflect: below 0 linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.3));
        }

        .loader-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .loader {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          animation: animate 2s linear infinite;
        }

        .loader-2,
        .loader-4 {
          animation-delay: -1s;
        }

        @keyframes animate {
          0% {
            transform: rotate(0deg);
            filter: hue-rotate(360deg);
          }
          100% {
            transform: rotate(360deg);
            filter: hue-rotate(0deg);
          }
        }

        .loader-1::before,
        .loader-2::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to top, transparent, rgba(0, 255, 249, 0.4));
          background-size: 100px 180px;
          background-repeat: no-repeat;
          border-top-left-radius: 100px;
          border-bottom-left-radius: 100px;
        }

        .loader i {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: #00fff9;
          border-radius: 50%;
          z-index: 100;
          box-shadow: 
            0 0 10px #00fff9,
            0 0 30px #00fff9,
            0 0 40px #00fff9,
            0 0 50px #00fff9,
            0 0 60px #00fff9,
            0 0 70px #00fff9,
            0 0 80px #00fff9,
            0 0 90px #00fff9,
            0 0 100px #00fff9;
        }

        .loader span {
          position: absolute;
          inset: 20px;
          background: #212121;
          border-radius: 50%;
          z-index: 1;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .loader span {
            background: #1f2937;
          }
        }

        .dark .loader span {
          background: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default Loader;
