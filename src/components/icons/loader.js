import React from 'react';

const IconLoader = () => (
  <svg
    id="logo"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    role="img"
  >
    <title>Loader Logo</title>

    {/* Hexagon outline */}
    <path
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      d="
        M 50, 5
        L 11, 27
        L 11, 72
        L 50, 95
        L 89, 73
        L 89, 28
        Z
      "
    />

    {/* Centered S */}
    <text
      x="50"
      y="70"
      textAnchor="middle"
      fill="currentColor"
      fontSize="55px"
      fontFamily="Consolas, serif"
    >
      S
    </text>
  </svg>
);

export default IconLoader;
