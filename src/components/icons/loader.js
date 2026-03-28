import React from 'react';

const IconLoader = () => (
  <svg
    id="logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-labelledby="loader-logo"
    role="img"
  >
    <title id="loader-logo">Loader Logo</title>

    <g>
      {/* Hexagon outline */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M 50, 5
           L 11, 27
           L 11, 72
           L 50, 95
           L 89, 73
           L 89, 28 z"
      />

      {/* Center letter */}
      <text
        x="52"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        fontSize="55px"
        fontFamily="Consolas, serif"
      >
        S
      </text>
    </g>
  </svg>
);

export default IconLoader;
