import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Facebook, Apple } from 'lucide-react';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLoginSuccess, onForgotPassword }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <AuthLayout 
      title="¡Hola de nuevo!" 
      subtitle="Ingresa tus credenciales para acceder a tu cuenta."
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Correo Electrónico" 
          type="email" 
          placeholder="ejemplo@correo.com" 
          icon={<Mail size={18} />}
          required
        />
        
        <div className="space-y-2">
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock size={18} />}
            required
          />
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-primary hover:text-teal-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <Button 
          label={loading ? "Ingresando..." : "Ingresar"} 
          variant="primary" 
          fullWidth 
          type="submit"
          disabled={loading}
        />
      </form>

      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400 font-medium">O continúa con</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Google Button */}
        <button type="button" className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold text-gray-700 text-sm">Continuar con Google</span>
        </button>

        {/* Apple Button */}
        <button type="button" className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]">
          <Apple size={20} className="text-black fill-current" />
          <span className="font-semibold text-gray-700 text-sm">Continuar con Apple</span>
        </button>

        {/* Facebook Button */}
        <button type="button" className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]" onClick={() => console.log('Facebook Login Clicked')}>
          <Facebook size={20} className="text-[#1877F2] fill-current" />
          <span className="font-semibold text-gray-700 text-sm">Continuar con Facebook</span>
        </button>
      </div>
    </AuthLayout>
  );
};