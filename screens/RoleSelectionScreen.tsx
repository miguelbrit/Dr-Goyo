import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { User, Stethoscope, Store, FlaskConical, ChevronRight } from 'lucide-react';

interface RoleSelectionScreenProps {
  onBack: () => void;
  onSelectRole: (role: 'patient' | 'doctor' | 'pharmacy' | 'lab') => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onBack, onSelectRole }) => {
  
  const roles = [
    {
      id: 'patient',
      title: 'Soy Paciente',
      desc: 'Busco atención médica',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'doctor',
      title: 'Soy Médico',
      desc: 'Quiero ofrecer consultas',
      icon: Stethoscope,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      id: 'pharmacy',
      title: 'Soy Farmacia',
      desc: 'Venta de medicamentos',
      icon: Store,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'lab',
      title: 'Soy Laboratorio',
      desc: 'Ofrezco análisis clínicos',
      icon: FlaskConical,
      color: 'bg-orange-100 text-orange-600'
    }
  ] as const;

  return (
    <AuthLayout 
      title="¿Cómo usarás Dr. Goyo?" 
      subtitle="Selecciona el tipo de perfil que deseas crear."
      onBack={onBack}
    >
      <div className="grid gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.color} mr-4`}>
              <role.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-gray-900">{role.title}</h3>
              <p className="text-sm text-gray-500">{role.desc}</p>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </AuthLayout>
  );
};