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
      console.log(`[DEBUG] Iniciando subida para usuario (Prop): ${userId}`);
      
      // 1. Garantizar Sesión y UID real de Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      let currentSession = (await supabase.auth.getSession()).data.session;

      if (!user || userError || !currentSession) {
        console.warn("[WARN] Sesión no detectada, intentando refrescar...");
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          throw new Error('AUTH_SESSION_EXPIRED');
        }
        currentSession = refreshData.session;
      }

      // Usamos el ID del usuario de la sesión para la ruta (Garantiza match con RLS)
      const authUserId = user?.id || currentSession?.user?.id;
      if (!authUserId) throw new Error('No se pudo determinar el ID de usuario autenticado.');

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      // ESTRUCTURA CRÍTICA: La política ahora espera strictly: auth_id/archivo.ext
      const filePath = `${authUserId}/${fileName}`;
      const bucketName = 'profiles';

      console.log(`[DEBUG] RUTA FINAL DE SUBIDA: "${filePath}" en bucket "${bucketName}"`);

      // 2. Subida a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("[ERROR] Detalle del fallo en Storage:", uploadError);
        // Lanzamos el error original para que el catch discriminado lo maneje
        throw uploadError;
      }

      // 3. Obtener URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log(`[DEBUG] Subida exitosa. Public URL: ${publicUrl}`);

      // 4. Actualizar Base de Datos (Estrategia Frontend-first)
      // Usamos el userId del prop que es el que Prisma conoce (deberían ser iguales)
      const targetId = userId || authUserId;

      const { data: existingProfile, error: checkError } = await supabase
        .from('Profile')
        .select('id')
        .eq('id', targetId)
        .single();

      let dbError;
      if (existingProfile) {
        const { error } = await supabase
          .from('Profile')
          .update({ image_url: publicUrl })
          .eq('id', targetId);
        dbError = error;
      } else {
        const { error } = await supabase
          .from('Profile')
          .insert({ 
            id: targetId, 
            image_url: publicUrl,
            name: userName,
            email: currentSession?.user?.email || (targetId + "@placeholder.com")
          });
        dbError = error;
      }

      if (dbError) {
        console.error("[ERROR] Error al vincular imagen en Profile table:", dbError);
        throw dbError;
      }

      // 5. Notificar éxito al componente padre
      onUploadSuccess(publicUrl);

      // Sincronización secundaria con Backend (Opcional)
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/users/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ imageUrl: publicUrl })
        });
      } catch (e) {}

    } catch (err: any) {
      console.error('[CRITICAL] Error en proceso de subida:', err);
      
      const message = err.message || '';
      const status = (err as any).status || (err as any).code;

      if (message === 'AUTH_SESSION_EXPIRED' || message.includes('JWT expired')) {
        setError('Tu sesión ha expirado realmente. Por favor, vuelve a iniciar sesión.');
      } else if (status === 400 || status === 403 || message.toLowerCase().includes('row-level security')) {
        setError(`Error de permisos (Status: ${status}): El servidor rechazó la ruta del archivo. Verifica que la política de Storage permita la ruta "userId/archivo".`);
      } else if (message.includes('network')) {
        setError('Error de conexión. Revisa tu internet.');
      } else {
        setError(message || 'Error inesperado al subir.');
      }
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
