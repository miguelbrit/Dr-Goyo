import React, { useState, useEffect } from 'react';
import { X, User, FileText, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Avatar } from './Avatar';
import { ProfileDetails } from './ProfileDetails';
import { AppointmentHistory } from './AppointmentHistory';
import { AppSettings } from './AppSettings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userImage?: string;
  onLogout: () => void;
}

type SidebarView = 'menu' | 'details' | 'history' | 'settings';

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userName, userImage, onLogout }) => {
  const [currentView, setCurrentView] = useState<SidebarView>('menu');

  // Reset view when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCurrentView('menu'), 300);
    }
  }, [isOpen]);

  const menuItems = [
    { id: 'details', icon: User, label: 'Datos Personales' },
    { id: 'history', icon: FileText, label: 'Historial Médico' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
  ];

  const handleLogoutClick = () => {
    onClose();
    // Small delay to allow closing animation if desired, or immediate
    onLogout();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'details': return <ProfileDetails />;
      case 'history': return <AppointmentHistory />;
      case 'settings': return <AppSettings />;
      default:
        return (
          <>
            <div className="flex items-center gap-4 mb-8">
              <Avatar src={userImage} alt={userName} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-lg">{userName}</p>
                <p className="text-sm text-primary font-medium">Paciente</p>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setCurrentView(item.id as SidebarView)}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary bg-accent/30 p-2 rounded-lg group-hover:bg-accent group-hover:text-primary transition-colors">
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              ))}
            </div>

            <button 
              onClick={handleLogoutClick}
              className="flex items-center gap-2 text-red-500 font-medium p-4 hover:bg-red-50 rounded-xl transition-colors mt-auto"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </>
        );
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'details': return 'Datos Personales';
      case 'history': return 'Historial';
      case 'settings': return 'Configuración';
      default: return 'Mi Perfil';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {currentView !== 'menu' && (
                <button onClick={() => setCurrentView('menu')} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
                  <ChevronLeft size={24} />
                </button>
              )}
              <h2 className="font-heading font-bold text-xl text-secondary">{getTitle()}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={24} />
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </>
  );
};