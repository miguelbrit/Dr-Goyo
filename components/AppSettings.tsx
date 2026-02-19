import React from 'react';
import { Bell, Moon, Shield, Globe, ChevronRight } from 'lucide-react';

export const AppSettings: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-2">Suscripción Actual</h4>
        <div className="flex justify-between items-center">
          <span className="text-primary font-heading font-semibold">Plan Gratuito</span>
          <button className="text-xs bg-secondary text-white px-3 py-1.5 rounded-lg">Mejorar Plan</button>
        </div>
      </div>

      <SettingItem icon={Bell} title="Notificaciones" toggle />
      <SettingItem icon={Moon} title="Modo Oscuro" toggle />
      <SettingItem icon={Globe} title="Idioma" value="Español" />
      <SettingItem icon={Shield} title="Privacidad y Seguridad" />
      
      <div className="pt-8 text-center">
        <p className="text-xs text-gray-400">Dr. Goyo App v1.0.5</p>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{ icon: any, title: string, toggle?: boolean, value?: string }> = ({ icon: Icon, title, toggle, value }) => (
  <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="text-gray-500">
        <Icon size={20} />
      </div>
      <span className="font-medium text-gray-700">{title}</span>
    </div>
    
    {toggle ? (
      <div className="w-10 h-6 bg-gray-200 rounded-full relative">
        <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 left-1"></div>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-gray-400">
        {value && <span className="text-sm">{value}</span>}
        <ChevronRight size={18} />
      </div>
    )}
  </button>
);