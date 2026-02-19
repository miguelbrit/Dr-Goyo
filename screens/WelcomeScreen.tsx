import React from 'react';
import { Button } from '../components/Button';
import { Activity } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onAdminAccess?: () => void; // New prop for admin simulation
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister, onAdminAccess }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-primary/10 to-transparent rounded-b-[3rem] -z-0"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center z-10 pt-10">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-soft flex items-center justify-center mb-8 text-primary transform rotate-3">
          <Activity size={48} />
        </div>
        
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-4">
          Tu salud, <br />
          <span className="text-primary">simplificada.</span>
        </h1>
        
        <p className="text-gray-500 text-lg leading-relaxed max-w-xs">
          Gestiona citas, recetas y estudios de laboratorio en un solo lugar.
        </p>
      </div>

      <div className="p-6 pb-12 space-y-4 z-10 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <Button 
          label="Iniciar Sesión" 
          variant="primary" 
          fullWidth 
          onClick={onLogin} 
        />
        <Button 
          label="Crear cuenta nueva" 
          variant="outline" 
          fullWidth 
          onClick={onRegister}
        />
        <div className="text-center pt-2 flex flex-col items-center">
          <p className="text-xs text-gray-400">
            Al continuar, aceptas nuestros Términos y Condiciones.
          </p>
          
          {/* Simulated Internal Link - Hidden on mobile/tablet (default), visible only on Large screens (lg:block) */}
          <button 
            onClick={onAdminAccess}
            className="mt-6 text-[10px] text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest hidden lg:block"
          >
            Internal Server Access
          </button>
        </div>
      </div>
    </div>
  );
};