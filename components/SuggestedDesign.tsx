import React from 'react';
import type { DesignAnalysis } from '../services/geminiService';

interface SuggestedDesignProps {
    analysis: DesignAnalysis | null;
    onApply: (analysis: DesignAnalysis) => void;
}

export const SuggestedDesign: React.FC<SuggestedDesignProps> = ({ analysis, onApply }) => {
    if (!analysis) return null;

    const { palette, font_recommendation, typography_overlay } = analysis;

    return (
        <div className="p-4 border-2 border-dashed border-[--banana] bg-[--panel] space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-[--subtext] font-mono uppercase tracking-wide">AI Design Suggestion</h3>
            
            <div className="space-y-2">
                <p className="font-mono text-sm uppercase text-[--subtext]">Suggested Palette:</p>
                <div className="flex gap-2">
                    <div title={`Primary: ${palette.primary}`} className="w-8 h-8 rounded border border-white/10" style={{ background: palette.primary }}></div>
                    <div title={`Accent: ${palette.accent}`} className="w-8 h-8 rounded border border-white/10" style={{ background: palette.accent }}></div>
                    <div title={`Background: ${palette.bg}`} className="w-8 h-8 rounded border border-white/10" style={{ background: palette.bg }}></div>
                    <div title={`Text: ${palette.text}`} className="w-8 h-8 rounded border border-white/10" style={{ background: palette.text }}></div>
                </div>
            </div>

             <div className="space-y-1">
                <p className="font-mono text-sm uppercase text-[--subtext]">Suggested Fonts:</p>
                <p className="text-sm"><b>Display:</b> {font_recommendation.display}, <b>Body:</b> {font_recommendation.body}</p>
            </div>
            
             <div className="space-y-1">
                <p className="font-mono text-sm uppercase text-[--subtext]">Suggested Title:</p>
                <p className="text-lg font-bold italic">"{typography_overlay.suggested_title}"</p>
            </div>

            <button 
                onClick={() => onApply(analysis)}
                className="w-full p-3 font-bold text-black transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-grad)'}}
            >
                Apply AI Suggestion
            </button>
        </div>
    );
};