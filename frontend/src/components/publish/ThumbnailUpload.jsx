import React, { useState } from 'react';
import uploadService from '../../services/uploadService';

export default function ThumbnailUpload({ value, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation checks
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload PNG, JPG, or WebP format.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const data = await uploadService.uploadThumbnail(file);
            onChange(data.url);
        } catch (err) {
            setError('Image upload failed. Try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3 text-left">
            <div className="border-2 border-dashed border-gray-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-all duration-300 bg-[#111827]/30 group relative overflow-hidden">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-3">
                        <div className="h-9 w-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-mono text-indigo-400">Uploading File to Server...</span>
                    </div>
                ) : value ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-900">
                        <img src={value} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs font-bold text-white bg-gray-900/80 px-4 py-2 rounded-lg">Replace Banner</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 flex flex-col items-center justify-center">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform duration-200">
                            ⇪
                        </div>
                        <p className="text-sm font-semibold text-gray-200">Drag and drop your project preview image</p>
                        <p className="text-xs text-gray-550 mt-1.5 text-gray-550">Supports PNG, JPG, or WebP (Max 5MB)</p>
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-400 font-mono">⚠️ {error}</p>}
        </div>
    );
}