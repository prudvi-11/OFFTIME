import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const dimensions = {
    small: { svg: 40, text: '1.25rem' },
    medium: { svg: 60, text: '1.75rem' },
    large: { svg: 80, text: '2.5rem' }
  }[size];

  return (
    <div className={`offtime-logo ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={dimensions.svg} height={dimensions.svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Graduation Cap */}
        <path d="M50 8 L75 18 L50 28 L25 18 Z" fill="#60A5FA" />
        <path d="M30 22 L30 32 C30 36, 70 36, 70 32 L70 22" fill="none" stroke="#60A5FA" strokeWidth="4" />
        {/* Tassel */}
        <path d="M50 8 L22 25 L22 40" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="22" cy="42" r="3" fill="#60A5FA" />
        
        {/* Top Half Circle - Teal */}
        <path d="M15 55 A 35 35 0 0 1 85 55" fill="none" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" />
        
        {/* Bottom Half Circle - Blue */}
        <path d="M15 55 A 35 35 0 0 0 85 55" fill="none" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" />
        
        {/* Clock Hands */}
        <circle cx="50" cy="55" r="4" fill="#0D9488" />
        {/* Minute Hand (points at 2 o'clock) */}
        <path d="M50 55 L70 35" fill="none" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
        {/* Hour Hand (points at 10 o'clock) */}
        <path d="M50 55 L35 45" fill="none" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
        
        {/* Calendar Grid */}
        <g fill="#60A5FA">
          {/* Row 1 */}
          <rect x="25" y="62" width="6" height="6" rx="1.5" />
          <rect x="35" y="62" width="6" height="6" rx="1.5" />
          <rect x="45" y="62" width="6" height="6" rx="1.5" />
          <rect x="55" y="62" width="6" height="6" rx="1.5" />
          <rect x="65" y="62" width="6" height="6" rx="1.5" />
          
          {/* Row 2 */}
          <rect x="30" y="72" width="6" height="6" rx="1.5" />
          <rect x="40" y="72" width="6" height="6" rx="1.5" />
          <rect x="50" y="72" width="6" height="6" rx="1.5" />
          <rect x="60" y="72" width="6" height="6" rx="1.5" />
          
          {/* Row 3 */}
          <rect x="35" y="82" width="6" height="6" rx="1.5" />
          <rect x="45" y="82" width="6" height="6" rx="1.5" />
          <rect x="55" y="82" width="6" height="6" rx="1.5" />
        </g>
      </svg>
      <div style={{ 
        fontSize: dimensions.text, 
        fontWeight: '800', 
        color: '#1E3A8A', 
        marginTop: '-2px', 
        letterSpacing: '-0.5px',
        fontFamily: 'Inter, system-ui, sans-serif' 
      }}>
        OffTime
      </div>
    </div>
  );
};

export default Logo;
