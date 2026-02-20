import React from 'react';
import { Bell, Moon, Sun, Shield, Globe, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AppSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="bg-gray-bg p-4 rounded-xl mb-6">
        <h4 className="text-sm font-bold text-text-main mb-2">Suscripción Actual</h4>
        <div className="flex justify-between items-center">
          <span className="text-primary font-heading font-semibold">Plan Gratuito</span>
          <button className="text-xs bg-secondary text-neutral px-3 py-1.5 rounded-lg active:scale-95 transition-transform">Mejorar Plan</button>
        </div>
      </div>

      <SettingItem icon={Bell} title="Notificaciones" toggle />
      <SettingItem 
        icon={theme === 'dark' ? Sun : Moon} 
        title="Modo Oscuro" 
        toggle 
        active={theme === 'dark'}
        onToggle={toggleTheme}
      />
      <SettingItem icon={Globe} title="Idioma" value="Español" />
      <SettingItem icon={Shield} title="Privacidad y Seguridad" />
      
      <div className="pt-8 text-center">
        <p className="text-xs text-gray-light">Dr. Goyo App v1.0.5</p>
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: any;
  title: string;
  toggle?: boolean;
  active?: boolean;
  onToggle?: () => void;
  value?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, toggle, active, onToggle, value }) => (
  <button 
    onClick={onToggle}
    disabled={!toggle && !value}
    className="w-full flex items-center justify-between p-4 bg-card border border-border-main rounded-xl hover:bg-gray-bg/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="text-gray-light">
        <Icon size={20} />
      </div>
      <span className="font-medium text-text-main">{title}</span>
    </div>
    
    {toggle ? (
      <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-gray-bg'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-300 ${active ? 'left-5' : 'left-1'}`}></div>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-gray-light">
        {value && <span className="text-sm">{value}</span>}
        <ChevronRight size={18} />
      </div>
    )}
  </button>
);