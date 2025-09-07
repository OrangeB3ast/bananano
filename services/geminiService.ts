import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { PromptTemplate, DesignAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface PosterData {
    imageUrl: string;
    title?: string;
    tagline?: string;
}
export type { DesignAnalysis };

const META_PROMPT = `ROLE: You are Bananano Studios' Image Design Architect. INPUT: a single image. TASK: analyze the image and return a single JSON object (no extra text) with the fields described below. Be precise, deterministic, and concise.

REQUIRE JSON schema exactly:
{
  "palette": {"primary":"#hex","accent":"#hex","bg":"#hex","text":"#hex","secondary":"#hex"},
  "dominant_colors": [{"hex":"#hex","percent":float},...],
  "mood_tags": ["cinematic","warm","noir",...],
  "font_recommendation": {"display":"GoogleFontName","body":"GoogleFontName"},
  "layout_suggestion": {"title_position":"top|bottom|left|right|center","overlay_style":"bold_center|vertical_spine|subtitle_below","title_color":"#hex","title_size":"px"},
  "typography_overlay": {"suggested_title":"string (short)","suggested_subtitle":"string (short)","text_color":"#hex","shadow":"soft|hard|none"},
  "prompt_suggestion": {"short":"text","medium":"text","long":"text"},
  "preserve_identity": true,
  "suggested_seeds": [int,int,int],
  "confidence": {"overall":0.0,"palette":0.0,"mood":0.0},
  "synthid_flag": false,
  "alt_text": "short alt text for accessibility"
}

GUIDELINES:
- Use real hex colors. dominant_colors must include at least 3 entries summing to <=100%.
- prompt_suggestion entries must be ready-to-send to Gemini 2.5 Flash Image with placeholders: use {{image_url}}, {{overlay_text}}, {{seed}}.
- font_recommendation must be Google Fonts names.
- confidence values [0.0-1.0].
- synthid_flag set true if model detects any watermark/synthid presence.
- Output MUST be strict JSON only. NO explanation text.

ANALYTICAL STEPS (internal, but produce only JSON):
1) detect colors, lighting, contrast, face vs background, dominant subject hue,
2) decide genre/mood tags,
3) pick a bold banana-accent-safe palette while preserving photo skin tones,
4) choose fonts and overlay style that read on the detected background,
5) craft 3 prompt variants tuned for Gemini 2.5 Flash Image that will (a) preserve identity, (b) apply stylistic edits and banana-yellow accents, (c) generate poster + thumbnail.`;


export async function analyzeImage(base64ImageData: string, mimeType: string): Promise<DesignAnalysis> {
    const model = 'gemini-2.5-flash';

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: META_PROMPT },
                ],
            },
            config: {
                responseMimeType: "application/json",
            },
        });

        const jsonString = response.text;
        const analysis = JSON.parse(jsonString);
        return analysis as DesignAnalysis;

    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error(`Image Analysis Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}


const fillTemplate = (template: string, customText: string): string => {
    const customTextInstruction = customText
        ? `The user has provided specific text: "${customText}". Use this for the movie title and/or tagline. If only a title is provided, generate a matching tagline. If only a tagline is provided, generate a matching title.`
        : `Generate a creative and plausible movie title and a tagline that fits the genre.`;
    
    return template.replace('{{overlay_text}}', customTextInstruction);
};


export async function generatePoster(
    base64ImageData: string,
    mimeType: string,
    prompt: PromptTemplate,
    customText: string,
    analysis: DesignAnalysis | null
): Promise<PosterData> {
    const model = 'gemini-2.5-flash-image-preview';
    
    let finalPrompt = fillTemplate(prompt.template_variants.medium, customText);

    if (analysis) {
        const guidance = `Apply the following design guidance based on a previous image analysis:
        - Suggested Title: ${analysis.typography_overlay.suggested_title}
        - Mood/Tags: ${analysis.mood_tags.join(', ')}
        - Palette: Use colors inspired by this palette: ${Object.values(analysis.palette).join(', ')}.
        - Font Style: A good display font would be ${analysis.font_recommendation.display}.
        This guidance should inform your creative choices.`;
        finalPrompt = `${guidance}\n\n---\n\n${finalPrompt}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: finalPrompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text)?.text;

        if (imagePart?.inlineData) {
            const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
            let title: string | undefined;
            let tagline: string | undefined;

            if (textPart) {
                const titleMatch = textPart.match(/Title:\s*(.*)/i);
                const taglineMatch = textPart.match(/Tagline:\s*(.*)/i);
                title = titleMatch?.[1]?.trim();
                tagline = taglineMatch?.[1]?.trim();
            }
            return { imageUrl, title, tagline };
        }
        
        let detailedError = "Image generation failed. The model did not return an image.";
        const candidate = response.candidates?.[0];

        if (!candidate) {
            detailedError = "The request was blocked, and the model returned no response. Please try a different image or adjust the genre.";
        } else {
             const finishReason = candidate.finishReason;
             if (finishReason) {
                 switch (finishReason) {
                     case 'STOP':
                         const responseText = candidate.content?.parts?.find(p => p.text)?.text || response.text;
                         if (responseText) {
                             detailedError = `The model finished but only returned text: "${responseText.substring(0, 150)}..."`;
                         }
                         break;
                     case 'SAFETY':
                     case 'PROHIBITED_CONTENT':
                         detailedError = "Generation failed due to safety settings. Please try a different image or adjust your custom text.";
                         break;
                     default:
                         detailedError = `Generation failed with an unexpected reason: ${finishReason}`;
                         break;
                 }
             }
        }
        throw new Error(detailedError);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}