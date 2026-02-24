import React, { useState, useRef } from 'react';
import { Camera, Loader2, Check, AlertCircle } from 'lucide-react';
import { Avatar } from './Avatar';
import { supabase } from '../supabase';

interface AvatarUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  userId: string;
  userName: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
  currentImageUrl, 
  onUploadSuccess, 
  userId,
  userName 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // 3. Update Database via Backend API (to maintain consistency with Prisma)
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: publicUrl })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Error al actualizar base de datos');

      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer" onClick={handleImageClick}>
        <Avatar src={currentImageUrl} alt={userName} size="xl" />
        <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {uploading ? (
            <Loader2 className="text-white animate-spin" size={24} />
          ) : (
            <Camera className="text-white" size={24} />
          )}
        </div>
        <button 
          className="absolute bottom-0 right-1 bg-primary text-white p-2 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform"
          type="button"
          disabled={uploading}
        >
          <Camera size={16} />
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp" 
        onChange={handleFileChange} 
        disabled={uploading}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {!uploading && !error && (
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toca para cambiar foto</p>
      )}
    </div>
  );
};
