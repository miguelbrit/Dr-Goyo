import React from 'react';
import { Home, Stethoscope, MessageCircle, Store, FlaskConical } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'doctors', icon: Stethoscope, label: 'Médicos' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', isMain: true },
    { id: 'pharmacy', icon: Store, label: 'Farmacia' },
    { id: 'labs', icon: FlaskConical, label: 'Labs' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe z-50">
      <div className="flex justify-around items-end h-16 max-w-md mx-auto relative px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          if (item.isMain) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative -top-5 flex flex-col items-center justify-center"
              >
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105
                  ${isActive ? 'bg-secondary text-white' : 'bg-primary text-white'}
                `}>
                  <item.icon size={28} />
                </div>
                <span className="text-xs font-semibold text-gray-600 mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 pb-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};