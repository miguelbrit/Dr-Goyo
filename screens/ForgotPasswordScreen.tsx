import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Unexpected non-JSON response:', text);
        throw new Error('El servidor respondió con un formato inesperado (HTML). Verifica que el backend esté corriendo correctamente.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Error al enviar el enlace');
      }

      setSent(true);
      // Wait 3 seconds then return to login
      setTimeout(() => {
        onSuccess();
      }, 4000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout 
        title="¡Enlace enviado!" 
        subtitle="Hemos enviado instrucciones a tu correo para restablecer tu contraseña."
        onBack={onBack}
      >
        <div className="flex flex-col items-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle size={48} />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Revisa tu bandeja de entrada y sigue los pasos allí indicados. <br/>
            Redirigiendo al inicio de sesión...
          </p>
          <Button label="Volver ahora" variant="outline" fullWidth onClick={onSuccess} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
      onBack={onBack}
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
            label="Correo Electrónico" 
            type="email" 
            placeholder="ejemplo@correo.com" 
            icon={<Mail size={18} />}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button 
            label={loading ? "Enviando..." : "Enviar Enlace"} 
            variant="primary" 
            fullWidth 
            type="submit"
            disabled={loading}
            icon={loading ? Loader2 : undefined}
          />
          
          <button 
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm font-medium text-gray-500 hover:text-primary transition-colors pt-2"
          >
            Cancelar y volver
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
