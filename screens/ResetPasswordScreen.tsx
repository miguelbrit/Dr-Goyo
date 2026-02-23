import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ResetPasswordScreenProps {
  onSuccess: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  // We normally would extract the token from the URL here if using Supabase directly on frontend
  // But if the backend handles the email sending, the recovery link usually signs the user in 
  // automatically or provides a token in the hash.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real Supabase flow, you'd use supabase.auth.updateUser({ password }) 
      // since the recovery link already established a session.
      // For this architecture, we might need a backend endpoint that takes the new password.
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password }),
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Respuesta del servidor no válida');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'No se pudo restablecer la contraseña');
      }

      setResetDone(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (resetDone) {
    return (
      <AuthLayout 
        title="¡Contraseña cambiada!" 
        subtitle="Tu contraseña ha sido actualizada exitosamente."
        onBack={onSuccess}
      >
        <div className="flex flex-col items-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle size={48} />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Ahora puedes iniciar sesión con tu nueva clave. <br/>
            Redirigiendo...
          </p>
          <Button label="Ir al Ingreso" variant="primary" fullWidth onClick={onSuccess} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Nueva Contraseña" 
      subtitle="Ingresa tu nueva clave de acceso para asegurar tu cuenta."
      onBack={onSuccess}
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Nueva Contraseña" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock size={18} />}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input 
            label="Confirmar Contraseña" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock size={18} />}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button 
            label={loading ? "Actualizando..." : "Cambiar Contraseña"} 
            variant="primary" 
            fullWidth 
            type="submit"
            disabled={loading}
            icon={loading ? Loader2 : undefined}
          />
        </form>
      </div>
    </AuthLayout>
  );
};
