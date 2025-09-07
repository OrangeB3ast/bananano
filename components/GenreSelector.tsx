import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { PromptTemplate } from '../types';

interface GenreSelectorProps {
    prompts: PromptTemplate[];
    selectedPrompt: PromptTemplate | null;
    onSelectPrompt: (prompt: PromptTemplate) => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({ prompts, selectedPrompt, onSelectPrompt }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollTo({
                left: el.scrollLeft + e.deltaY,
                behavior: 'smooth'
            });
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        setIsDown(true);
        el.classList.add('active');
        setStartX(e.pageX - el.offsetLeft);
        setScrollLeft(el.scrollLeft);
    };

    const onMouseLeave = () => {
        const el = ref.current;
        if(el) {
            setIsDown(false);
            el.classList.remove('active');
        }
    };

    const onMouseUp = () => {
        const el = ref.current;
        if(el) {
            setIsDown(false);
            el.classList.remove('active');
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDown) return;
        e.preventDefault();
        const el = ref.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        el.scrollLeft = scrollLeft - walk;
    };

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            el.scrollBy({ left: 200, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            el.scrollBy({ left: -200, behavior: 'smooth' });
        }
    }, []);

    return (
        <div
            ref={ref}
            className="genre-carousel cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-banana-yellow/50 rounded-lg"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Selectable movie genres carousel"
            tabIndex={0}
        >
            {prompts.map((prompt) => (
                <div
                    key={prompt.id}
                    onClick={() => onSelectPrompt(prompt)}
                    className={`
                        genre-card relative flex-shrink-0 w-40 h-60 cursor-pointer 
                        transform transition-all duration-300 ease-in-out
                        overflow-hidden group border-2 border-solid rounded-lg bg-zinc-900
                        ${selectedPrompt?.id === prompt.id ? 'border-banana-yellow scale-105' : 'border-transparent hover:scale-105 hover:border-[--muted]'}
                    `}
                    role="button"
                    aria-pressed={selectedPrompt?.id === prompt.id}
                    tabIndex={-1}
                >
                    <img 
                        src={prompt.coverImage} 
                        alt={prompt.title} 
                        className="w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-110"
                        // Add a dark background to the image tag itself to prevent white flashes and act as a fallback
                        style={{ backgroundColor: 'var(--muted)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all group-hover:from-black/90"></div>
                    <div className="absolute bottom-0 left-0 p-3 w-full">
                        <h3 className="font-bold text-white text-base leading-tight drop-shadow-md whitespace-normal">{prompt.title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};
