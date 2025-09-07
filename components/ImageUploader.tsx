import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
    onImageUpload: (base64Data: string, mimeType: string, dataUrl: string) => void;
}

const MAX_DIMENSION = 1024;

const resizeImage = (file: File): Promise<{ dataUrl: string; base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error("FileReader failed to read the file."));
            }
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    } else {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context.'));
                }
                ctx.drawImage(img, 0, 0, width, height);

                const outputMimeType = 'image/jpeg';
                const dataUrl = canvas.toDataURL(outputMimeType, 0.9);
                const base64String = dataUrl.split(',')[1];

                resolve({ dataUrl, base64Data: base64String, mimeType: outputMimeType });
            };
            img.onerror = () => reject(new Error("Failed to load image for processing."));
            img.src = event.target.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback(async (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setUploadError(null);
            setFileName(file.name); // Show filename immediately for better UX
            try {
                const { dataUrl, base64Data, mimeType } = await resizeImage(file);
                setPreview(dataUrl);
                onImageUpload(base64Data, mimeType, dataUrl);
            } catch (error) {
                console.error("Error processing image:", error);
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                setUploadError(`Error: ${errorMessage}`);
                setPreview(null);
                setFileName(''); // Clear filename on error
            }
        }
    }, [onImageUpload]);

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };
    
    return (
        <div>
            <label
                htmlFor="file-upload"
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-[--muted] cursor-pointer bg-[--panel] hover:border-[--banana] transition-colors duration-200 ${isDragging ? 'border-[--banana]' : 'border-[--muted]'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {preview ? (
                    <img src={preview} alt="Image preview" className="object-contain h-full w-full" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadIcon />
                        <p className="mb-2 text-sm text-[--subtext]"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                    </div>
                )}
                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={onFileInputChange} />
            </label>
            {fileName && !uploadError && <p className="text-sm text-[--subtext] mt-2">File: {fileName}</p>}
            {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}
        </div>
    );
};