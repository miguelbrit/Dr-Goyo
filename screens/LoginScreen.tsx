import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Facebook, Apple } from 'lucide-react';
import { RoleSelector, UserRole } from '../components/RoleSelector';
import { SocialAuthButtons } from '../components/SocialAuthButtons';

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

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Error parseando login JSON:', text);
        throw new Error('Error de servidor (Respuesta no válida)');
      }

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

          <SocialAuthButtons 
            onGooglePress={() => console.log('Google Login')}
            onApplePress={() => console.log('Apple Login')}
            onFacebookPress={() => console.log('Facebook Login')}
          />
        </div>
      )}
    </AuthLayout>
  );
};