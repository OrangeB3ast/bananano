
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BananaSliderIcon } from './icons/BananaSliderIcon';

interface ImageComparatorProps {
    beforeImage: string;
    afterImage: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
    };
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
    };

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);
    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current) return;
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSliderPosition(pos => Math.max(0, pos - 2));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSliderPosition(pos => Math.min(100, pos + 2));
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full overflow-hidden select-none group focus:outline-none focus:ring-2 focus:ring-banana-yellow rounded-lg max-w-full max-h-full"
            onMouseLeave={handleMouseUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuenow={sliderPosition}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Image comparison slider"
        >
            {/* The after image is the base */}
            <img
                src={afterImage}
                alt="Generated poster"
                className="block w-full h-auto object-contain pointer-events-none max-h-[80vh]"
            />
            {/* The before image is clipped and layered on top */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Original uploaded image"
                    className="block w-full h-auto object-contain absolute inset-0 max-h-[80vh]"
                />
            </div>
            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-banana-yellow/70 cursor-ew-resize flex items-center justify-center shadow-lg transition-all duration-100 ease-out"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="bg-black text-black rounded-full p-1.5 shadow-lg transform group-hover:scale-110 transition-transform cursor-ew-resize border-2 border-banana-yellow">
                    <BananaSliderIcon />
                </div>
            </div>
            {/* Labels */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold uppercase px-2 py-1 rounded-md pointer-events-none backdrop-blur-sm">Before</div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold uppercase px-2 py-1 rounded-md pointer-events-none backdrop-blur-sm">After</div>
        </div>
    );
};
