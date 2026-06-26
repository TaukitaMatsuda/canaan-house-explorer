import React from 'react';

interface SkullIconProps {
  className?: string;
  size?: number;
  house?: number;
}

export const SkullIcon: React.FC<SkullIconProps> = ({ className = '', size = 24, house }) => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      <path d="M30 25 Q30 10 50 10 Q70 10 70 25 L70 45 Q75 50 75 60 L70 70 L65 70 L65 80 L60 85 L40 85 L35 80 L35 70 L30 70 L25 60 Q25 50 30 45 Z" />
      <circle cx="40" cy="40" r="8" fill="var(--tomb-black)" />
      <circle cx="60" cy="40" r="8" fill="var(--tomb-black)" />
      <rect x="42" y="55" width="16" height="6" rx="2" fill="var(--tomb-black)" />
      {house && house >= 1 && house <= 9 && (
        <text 
          x="50" 
          y="32" 
          textAnchor="middle" 
          fill="var(--tomb-ivory)" 
          fontSize="14" 
          fontFamily="Cinzel"
        >
          {romanNumerals[house - 1]}
        </text>
      )}
    </svg>
  );
};
