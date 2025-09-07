import React from 'react';

export const BananaSliderIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" style={{ transform: 'rotate(45deg)'}}>
        <defs>
            <linearGradient id="gban-slider" x1="0" x2="1">
                <stop offset="0" stopColor="#FFD400" />
                <stop offset="1" stopColor="#FFEE58" />
            </linearGradient>
        </defs>
        <path fill="url(#gban-slider)" stroke="#050505" strokeWidth="3" d="M5 40c10-20 40-30 50-30 0 8-4 20-14 28-10 8-28 12-36 12 0 0-6-6 0-10z" />
    </svg>
);
