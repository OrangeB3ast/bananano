import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b border-[--muted]">
            <div className="container mx-auto px-4 lg:px-8 py-2 flex justify-center items-center">
                 <h1 className="text-5xl font-staatliches text-banana-yellow tracking-widest uppercase">
                    BANANANO <span className="text-white">Studios</span>
                </h1>
            </div>
        </header>
    );
};