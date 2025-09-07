import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GenreSelector } from './components/GenreSelector';
import { PosterDisplay } from './components/PosterDisplay';
import { generatePoster, analyzeImage } from './services/geminiService';
import type { PosterData, DesignAnalysis } from './services/geminiService';
import type { PromptTemplate } from './types';

const App: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<{ data: string; type: string; url: string } | null>(null);
    const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);
    const [customText, setCustomText] = useState<string>('');
    const [generatedPoster, setGeneratedPoster] = useState<PosterData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [appliedAnalysis, setAppliedAnalysis] = useState<DesignAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isZenMode, setIsZenMode] = useState<boolean>(false);

    useEffect(() => {
        fetch('/prompts/library.json')
            .then(res => {
                if (!res.ok) throw new Error("Could not load prompt library.");
                return res.json();
            })
            .then(setPrompts)
            .catch(err => {
                console.error("Failed to fetch prompts:", err);
                setError("Failed to load creative prompts. Please refresh the page.");
            });
    }, []);

    const showUploadToast = () => {
        const t = document.getElementById('upload-toast');
        if (t) {
            t.classList.add('show');
            setTimeout(() => { t.classList.remove('show'); }, 3000);
        }
    };

    const handleImageUpload = async (imageData: string, imageType: string, dataUrl: string) => {
        setUploadedImage({ data: imageData, type: imageType, url: dataUrl });
        setGeneratedPoster(null);
        setAppliedAnalysis(null);
        setError(null);
        showUploadToast();

        if (!customText.trim()) {
            try {
                // Run analysis in the background without blocking UI
                const analysis = await analyzeImage(imageData, imageType);
                setAppliedAnalysis(analysis); // Store analysis directly for generation
            } catch (err) {
                console.error("Analyze failed", err);
                // Non-blocking error, generation can still proceed
                setError("Image analysis failed, but you can still generate a poster.");
            }
        }
    };

    const handleGenerateClick = useCallback(async () => {
        if (!uploadedImage || !selectedPrompt) {
            setError("Please upload an image and select a style.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedPoster(null);

        try {
            const textForPoster = customText.trim() || appliedAnalysis?.typography_overlay.suggested_title || '';
            const posterData = await generatePoster(uploadedImage.data, uploadedImage.type, selectedPrompt, textForPoster, appliedAnalysis);
            setGeneratedPoster(posterData);
        } catch (err)
 {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during poster generation.");
        } finally {
            setIsLoading(false);
        }
    }, [uploadedImage, selectedPrompt, customText, appliedAnalysis]);

    return (
        <div className={`min-h-screen font-sans ${isZenMode ? 'overflow-hidden' : ''}`}>
            {!isZenMode && <Header />}
            <main className={`container mx-auto px-4 lg:px-8 py-8 ${isZenMode ? 'p-0 m-0 max-w-full' : ''}`}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isZenMode ? 'grid-cols-1' : ''}`}>
                    {/* Left Column: Controls */}
                    {!isZenMode && (
                        <div className="flex flex-col space-y-10">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-[--subtext] font-mono uppercase tracking-wide pb-2 border-b-2 border-banana-yellow/30">1. Upload Portrait</h2>
                                <ImageUploader onImageUpload={handleImageUpload} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-[--subtext] font-mono uppercase tracking-wide pb-2 border-b-2 border-banana-yellow/30">2. Select Style</h2>
                                <GenreSelector
                                    prompts={prompts}
                                    selectedPrompt={selectedPrompt}
                                    onSelectPrompt={setSelectedPrompt}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-[--subtext] font-mono uppercase tracking-wide pb-2 border-b-2 border-banana-yellow/30">2.5 (Optional) Add Text</h2>
                                 <textarea
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="Add a title, or leave empty for the AI to analyze your image and create one!"
                                    className="w-full h-24 p-3 bg-[--panel] border-2 border-[--muted] rounded-lg text-[--text] font-mono focus:outline-none focus:border-[--banana] transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex flex-col">
                                <h2 className="text-2xl font-bold mb-4 text-[--subtext] font-mono uppercase tracking-wide pb-2 border-b-2 border-banana-yellow/30">3. Create Poster</h2>
                                <button
                                    onClick={handleGenerateClick}
                                    disabled={!uploadedImage || !selectedPrompt || isLoading}
                                    className="
                                        w-full py-5 px-8 rounded-xl text-2xl font-bold font-mono uppercase tracking-widest
                                        transition-all duration-300 ease-in-out transform
                                        focus:outline-none focus:ring-4 focus:ring-banana-yellow/50
                                        disabled:cursor-wait disabled:bg-[--muted] disabled:text-gray-400 disabled:shadow-none disabled:scale-100
                                        bg-gradient-to-r from-banana-yellow to-banana-yellow-light text-black 
                                        shadow-lg shadow-yellow-500/20
                                        hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/40 hover:brightness-105
                                        active:scale-95 active:brightness-90
                                    "
                                >
                                    {isLoading 
                                        ? <span className="animate-pulse">Creating...</span> 
                                        : 'Generate Poster'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Column: Display */}
                    <div className={`flex flex-col ${isZenMode ? 'col-span-1' : ''}`}>
                        <PosterDisplay
                            posterData={generatedPoster}
                            isLoading={isLoading}
                            error={error}
                            uploadedImagePreview={uploadedImage?.url}
                            isZenMode={isZenMode}
                            toggleZenMode={() => setIsZenMode(prev => !prev)}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;