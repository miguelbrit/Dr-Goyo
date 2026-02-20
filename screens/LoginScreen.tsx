import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Facebook, Apple } from 'lucide-react';
import { RoleSelector, UserRole } from '../components/RoleSelector';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLoginSuccess, onForgotPassword }) => {
  const [step, setStep] = useState<'role' | 'login'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || 'Error al iniciar sesión');
      }

      // Success: result.token contains the JWT
      localStorage.setItem('token', result.token);
      setLoading(false);
      onLoginSuccess(result.user.role || selectedRole, result.user.name || 'Usuario');
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleBack = () => {
    if (step === 'login') {
      setStep('role');
    } else {
      onBack();
    }
  };

  return (
    <AuthLayout 
      title={step === 'role' ? "" : "¡Hola de nuevo!"} 
      subtitle={step === 'role' ? "" : "Ingresa tus credenciales para acceder a tu cuenta."}
      onBack={handleBack}
    >
      {step === 'role' ? (
        <RoleSelector 
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          onContinue={() => setStep('login')}
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
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
            
            <div className="space-y-2">
              <Input 
                label="Contraseña" 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock size={18} />}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="relative pt-6 pb-2">
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
        </div>
      )}
    </AuthLayout>
  );
};