import React from 'react';
import { User, Stethoscope, Store, FlaskConical } from 'lucide-react';
import { Button } from './Button';

export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'lab';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  selectedRole, 
  onSelectRole, 
  onContinue 
}) => {
  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'Paciente',
      icon: User,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      activeColor: 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200',
    },
    {
      id: 'doctor' as UserRole,
      title: 'Médico',
      icon: Stethoscope,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
      activeColor: 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200',
    },
    {
      id: 'pharmacy' as UserRole,
      title: 'Farmacia',
      icon: Store,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      activeColor: 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200',
    },
    {
      id: 'lab' as UserRole,
      title: 'Laboratorio',
      icon: FlaskConical,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      activeColor: 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">¿Cómo deseas ingresar a Dr Goyo?</h2>
        <p className="text-gray-500 mt-2">Selecciona tu perfil para continuar</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => {
          const isActive = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300
                ${isActive 
                  ? role.activeColor 
                  : `${role.color} hover:border-gray-200 hover:bg-white hover:shadow-md active:scale-95`
                }
              `}
            >
              <div className={`mb-3 p-3 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/50'}`}>
                <Icon size={32} strokeWidth={2.5} />
              </div>
              <span className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-gray-700'}`}>
                {role.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <Button 
          label="Continuar" 
          variant="primary" 
          fullWidth 
          onClick={onContinue}
          disabled={!selectedRole}
        />
      </div>
    </div>
  );
};
