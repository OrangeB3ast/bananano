
import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import type { PosterData } from '../services/geminiService';
import { ImageComparator } from './ImageComparator';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { ExitFullscreenIcon } from './icons/ExitFullscreenIcon';

interface PosterDisplayProps {
    posterData: PosterData | null;
    isLoading: boolean;
    error: string | null;
    uploadedImagePreview: string | null;
    isZenMode: boolean;
    toggleZenMode: () => void;
}

const loadingMessages = [
    "Warming up the director's chair...",
    "Scouting for cinematic locations...",
    "Casting the perfect digital actors...",
    "Adjusting the virtual lighting rigs...",
    "Applying special effects...",
    "Rendering the final cut...",
];

export const PosterDisplay: React.FC<PosterDisplayProps> = ({ posterData, isLoading, error, uploadedImagePreview, isZenMode, toggleZenMode }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="banana-loader" aria-hidden="true">🍌</div>
                    <p className="mt-4 text-lg font-semibold text-[--text]">Generating Poster</p>
                    <p className="text-[--subtext] mt-2 transition-opacity duration-500">{loadingMessages[currentMessageIndex]}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 border-2 border-red-500/50 bg-red-900/20 rounded-lg">
                    <p className="text-lg font-bold text-red-400">Request Failed</p>
                    <p className="text-red-300 mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (posterData && uploadedImagePreview) {
            return (
                 <div className="w-full">
                    <ImageComparator
                        beforeImage={uploadedImagePreview}
                        afterImage={posterData.imageUrl}
                    />
                    {!isZenMode && (
                        <div className="bg-black/50 p-4 mt-4 border border-[--muted] rounded-lg flex justify-between items-center gap-4">
                            <div className="flex-grow">
                                {posterData.title && <h3 className="text-2xl font-bold font-mono uppercase text-banana-yellow">{posterData.title}</h3>}
                                {posterData.tagline && <p className="text-md italic text-[--subtext] mt-1">{posterData.tagline}</p>}
                            </div>
                             <a
                                href={posterData.imageUrl}
                                download="bananano-studios-poster.png"
                                className="flex-shrink-0 bg-banana-yellow text-black p-3 rounded-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
                                aria-label="Download Poster"
                                title="Download Poster"
                            >
                                <DownloadIcon />
                            </a>
                        </div>
                    )}
                </div>
            );
        }

        return (
             <div className="aspect-[2/3] w-full bg-[--panel] border-2 border-dashed border-[--muted] rounded-lg flex items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    {uploadedImagePreview ? 
                         (
                            <div className="relative w-full h-full">
                                <img src={uploadedImagePreview} alt="Awaiting generation" className="w-full h-full object-contain opacity-20" /> 
                                <p className="absolute bottom-4 left-4 right-4 text-gray-400 font-mono">Ready to create magic!</p>
                            </div>
                        )
                        : <p className="font-mono">Your generated poster will appear here.</p>
                    }
                </div>
            </div>
        );
    };

    return (
        <div className={`w-full flex items-center justify-center relative ${isZenMode ? 'fixed inset-0 bg-black/90 z-[100] p-4 flex items-center justify-center' : ''}`}>
             {posterData && (
                <button
                    onClick={toggleZenMode}
                    className="absolute top-4 right-4 z-[110] bg-black/50 text-white p-2 rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
                    title={isZenMode ? 'Exit Fullscreen' : 'View Fullscreen'}
                >
                    {isZenMode ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </button>
             )}
            {renderContent()}
        </div>
    );
};
