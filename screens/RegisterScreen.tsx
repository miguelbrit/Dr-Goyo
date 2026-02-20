import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, User, Phone, Briefcase, FileText, MapPin, Building, Facebook, Apple } from 'lucide-react';

type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'lab' | 'admin';

interface RegisterScreenProps {
  role: UserRole;
  onBack: () => void;
  onSubmit: (role: UserRole, userName: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ role, onBack, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Specialized Fields State
  const [specialty, setSpecialty] = useState('');
  const [license, setLicense] = useState('');
  const [address, setAddress] = useState('');
  const [testTypes, setTestTypes] = useState('');

  const getRoleConfig = () => {
    switch (role) {
      case 'doctor': return { title: 'Registro Médico', subtitle: 'Únete a nuestra red de especialistas.' };
      case 'pharmacy': return { title: 'Registro Farmacia', subtitle: 'Registra tu sucursal para vender productos.' };
      case 'lab': return { title: 'Registro Laboratorio', subtitle: 'Ofrece tus servicios de análisis clínicos.' };
      case 'admin': return { title: 'Registro Administrador', subtitle: 'Acceso administrativo al sistema.' };
      default: return { title: 'Crear Cuenta', subtitle: 'Empieza a cuidar tu salud hoy mismo.' };
    }
  };

  const config = getRoleConfig();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map frontend roles to backend enum
    const roleMapping: Record<string, string> = {
      'patient': 'Paciente',
      'doctor': 'Medico',
      'pharmacy': 'Farmacia',
      'lab': 'Laboratorio'
    };

    const backendRole = roleMapping[role] || 'Paciente';

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || (role === 'pharmacy' || role === 'lab' ? 'Negocio' : 'Usuario'),
          email,
          password,
          type: backendRole,
          phone,
          // New specialized fields
          specialty: role === 'doctor' ? specialty : undefined,
          license: role === 'doctor' ? license : undefined,
          address: (role === 'pharmacy' || role === 'lab') ? address : undefined,
          testTypes: role === 'lab' ? testTypes : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Success
      localStorage.setItem('token', data.token);
      setLoading(false);
      onSubmit(data.user.role || role, name || data.user.name || 'Usuario');
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Social Button classes for consistency
  const socialBtnClasses = "flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]";

  return (
    <AuthLayout 
      title={config.title}
      subtitle={config.subtitle}
      onBack={onBack}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Common Fields */}
        <Input 
          label="Correo Electrónico" 
          type="email" 
          placeholder="correo@ejemplo.com" 
          icon={<Mail size={18} />} 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="Min. 8 caracteres" 
            icon={<Lock size={18} />} 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           <Input 
            label="Teléfono" 
            type="tel" 
            placeholder="55 1234 5678" 
            icon={<Phone size={18} />} 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Patient, Doctor & Admin Fields */}
        {(role === 'patient' || role === 'doctor' || role === 'admin') && (
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Nombre" 
              placeholder="Tu nombre" 
              icon={<User size={18} />} 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input label="Apellido" placeholder="Tus apellidos" required />
          </div>
        )}

        {/* Doctor Specific Fields */}
        {role === 'doctor' && (
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Especialidad" 
              placeholder="Ej. Cardiología" 
              icon={<Briefcase size={18} />} 
              required 
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
            <Input 
              label="Cédula" 
              placeholder="Número" 
              icon={<FileText size={18} />} 
              required 
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            />
          </div>
        )}

        {/* Pharmacy & Lab Specific Fields */}
        {(role === 'pharmacy' || role === 'lab') && (
          <>
            <Input 
              label={role === 'pharmacy' ? "Nombre del Negocio" : "Nombre del Laboratorio"} 
              placeholder="Ej. Dr. Goyo Care" 
              icon={<Building size={18} />} 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              label="Dirección Completa" 
              placeholder="Calle, Número, Colonia..." 
              icon={<MapPin size={18} />} 
              required 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </>
        )}

        {/* Lab Specific Input */}
        {role === 'lab' && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
              Tipo de Exámenes
            </label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
              placeholder="Sangre, Orina, Rayos X..."
              value={testTypes}
              onChange={(e) => setTestTypes(e.target.value)}
            />
          </div>
        )}

        <div className="pt-2">
          <Button 
            label={loading ? "Creando cuenta..." : "Registrarse"} 
            variant="primary" 
            fullWidth 
            type="submit"
            disabled={loading}
          />
        </div>
      </form>

      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400 font-medium">O continúa con</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Google Button */}
        <button type="button" className={socialBtnClasses}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold text-gray-700 text-sm">Continuar con Google</span>
        </button>

        {/* Apple Button */}
        <button type="button" className={socialBtnClasses}>
          <Apple size={20} className="text-black fill-current" />
          <span className="font-semibold text-gray-700 text-sm">Continuar con Apple</span>
        </button>

        {/* Facebook Button */}
        <button type="button" className={socialBtnClasses} onClick={() => console.log('Facebook Login Clicked')}>
          <Facebook size={20} className="text-[#1877F2] fill-current" />
          <span className="font-semibold text-gray-700 text-sm">Continuar con Facebook</span>
        </button>
      </div>
    </AuthLayout>
  );
};