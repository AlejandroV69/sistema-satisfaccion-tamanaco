import React from 'react';

const CasinoLogo = ({ className = "h-16" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 600 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="casinoGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
          
          <filter id="casinoSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* main Wordmark */}
        <text
          x="50%"
          y="70"
          textAnchor="middle"
          fill="url(#casinoGoldGradient)"
          style={{
            fontFamily: "'Inter', 'Montserrat', sans-serif",
            fontSize: "64px",
            fontWeight: "800",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.5))"
          }}
        >
          TAMANACO
        </text>

        {/* Casino Subtext */}
        <text
          x="50%"
          y="130"
          textAnchor="middle"
          fill="url(#casinoGoldGradient)"
          style={{
            fontFamily: "'Inter', 'Montserrat', sans-serif",
            fontSize: "32px",
            fontWeight: "400",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            opacity: "0.9"
          }}
        >
          CASINO
        </text>
      </svg>
    </div>
  );
};

export default CasinoLogo;
