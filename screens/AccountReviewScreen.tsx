import React from 'react';
import { Button } from '../components/Button';
import { ShieldCheck, Clock } from 'lucide-react';

interface AccountReviewScreenProps {
  onGoHome: () => void;
}

export const AccountReviewScreen: React.FC<AccountReviewScreenProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 flex flex-col justify-center items-center text-center">
      <div className="bg-white p-8 rounded-3xl shadow-soft w-full max-w-md">
        <div className="w-20 h-20 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary relative">
          <ShieldCheck size={40} />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
             <div className="bg-yellow-400 p-1.5 rounded-full text-white">
                <Clock size={16} />
             </div>
          </div>
        </div>
        
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">
          Cuenta en Revisión
        </h1>
        
        <p className="text-gray-500 mb-6 leading-relaxed">
          Gracias por registrarte en Dr. Goyo. Para garantizar la seguridad de nuestros pacientes, debemos verificar tus credenciales y licencias profesionales.
        </p>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-secondary mb-8 text-left">
          <p className="font-semibold mb-1">¿Cuánto tarda?</p>
          <p>El proceso suele tomar entre 24 y 48 horas hábiles. Te notificaremos por correo electrónico cuando tu cuenta esté activa.</p>
        </div>

        <Button 
          label="Entendido, volver al inicio" 
          variant="secondary" 
          fullWidth 
          onClick={onGoHome}
        />
      </div>
    </div>
  );
};