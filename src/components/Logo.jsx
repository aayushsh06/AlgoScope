import React from 'react';

const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300">
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a237e" />
          <stop offset="100%" stopColor="#37474f" />
        </linearGradient>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#64ffda" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#64ffda" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background rectangle */}
      <rect width="600" height="300" fill="url(#bgGradient)" rx="15" ry="15" />

      {/* Grid - moved up to create more space */}
      <g stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3">
        {/* Vertical lines */}
        {[...Array(11)].map((_, i) => (
          <line
            key={i}
            x1={150 + i * 30}
            y1="40"
            x2={150 + i * 30}
            y2="180"
          />
        ))}
        {/* Horizontal lines */}
        {[...Array(6)].map((_, i) => (
          <line
            key={i}
            x1="150"
            y1={40 + i * 30}
            x2="450"
            y2={40 + i * 30}
          />
        ))}
      </g>

      {/* Barriers */}
      <g fill="#EF5350">
        {[
          [240, 40],
          [240, 70],
          [270, 70],
          [300, 70],
          [330, 70],
          [330, 100],
          [330, 130],
          [270, 130],
          [210, 100],
          [210, 130],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="30" height="30" />
        ))}
      </g>

      {/* Start node with glow */}
      <circle cx="165" cy="55" r="10" fill="#2979FF" />
      <circle cx="165" cy="55" r="15" fill="url(#nodeGlow)" />

      {/* Target node with glow */}
      <circle cx="435" cy="145" r="10" fill="#00E676" />
      <circle cx="435" cy="145" r="15" fill="url(#nodeGlow)" />

      {/* Path */}
      <g fill="none" stroke="#FFEB3B" strokeWidth="3">
        <path d="M165,55 L165,85 L195,85 L195,115 L195,145 L225,145 L255,145 L285,145 L315,145 L345,145 L375,145 L405,145 L435,145" />
      </g>

      {/* Visited nodes */}
      <g fill="#64ffda" fillOpacity="0.3">
        {[
          [150, 70],
          [180, 70],
          [180, 100],
          [180, 130],
          [180, 160],
          [210, 160],
          [240, 160],
          [270, 160],
          [300, 160],
          [300, 130],
          [300, 100],
          [360, 70],
          [360, 100],
          [360, 130],
          [390, 130],
          [390, 100],
          [390, 70],
          [420, 70],
          [420, 100],
          [420, 130],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="30" height="30" />
        ))}
      </g>

      {/* App Name - increased spacing */}
      <text
        x="300"
        y="230"
        fontFamily="Arial, sans-serif"
        fontSize="36"
        fontWeight="bold"
        textAnchor="middle"
        fill="#ffffff"
      >
        Algorithm Visualizer
      </text>
      <text
        x="300"
        y="265"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        textAnchor="middle"
        fill="#aefeff"
      >
        See Algorithms in Action
      </text>
    </svg>
  );
};

export default Logo;
