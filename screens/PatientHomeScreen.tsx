import React, { useState } from 'react';
import { MapPin, Send, Pill, Activity, ClipboardCheck, Mic } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Carousel, CarouselItem } from '../components/Carousel';
import { BottomNav } from '../components/BottomNav';
import { Sidebar } from '../components/Sidebar';

interface PatientHomeScreenProps {
  userName?: string;
  onLogout: () => void;
  onNavigateToChat: (initialMessage?: string) => void;
  onNavigateToMedicines: () => void;
  onNavigateToPathologies: () => void;
  onNavigateToPreOp: () => void;
  onNavigate: (tab: string) => void; // For BottomNav
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({ 
  userName = "Alejandro", 
  onLogout, 
  onNavigateToChat,
  onNavigateToMedicines,
  onNavigateToPathologies,
  onNavigateToPreOp,
  onNavigate
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Reorganized cards according to new requirements
  const interestItems = [
    { 
      id: 'medicines', 
      icon: Pill, 
      label: 'Medicamentos', 
      color: 'text-blue-600 bg-blue-50', 
      action: onNavigateToMedicines 
    },
    { 
      id: 'pathologies', 
      icon: Activity, 
      label: 'Patologías', 
      color: 'text-teal-600 bg-teal-50', 
      action: onNavigateToPathologies 
    },
    { 
      id: 'preop', 
      icon: ClipboardCheck, 
      label: 'Listas Pre Operatoria', 
      color: 'text-orange-600 bg-orange-50', 
      action: onNavigateToPreOp 
    },
  ];

  const bannerItems: CarouselItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      title: 'Tu Salud Primero',
      subtitle: 'Agenda citas con los mejores especialistas de la ciudad.'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      title: 'Farmacia Express',
      subtitle: 'Medicamentos a domicilio en menos de 45 minutos.'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
      title: 'Laboratorio Clínico',
      subtitle: 'Resultados confiables y seguros directamente en tu perfil.'
    }
  ];

  const handleBannerClick = (item: CarouselItem) => {
    console.log("Navegando a home desde banner:", item.title);
  };

  const handleChatInputSubmit = () => {
    if (message.trim()) {
      onNavigateToChat(message);
      setMessage('');
    } else {
      onNavigateToChat();
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg pb-24">
      
      {/* Header */}
      <header className="bg-white px-6 pt-6 pb-4 rounded-b-3xl shadow-soft sticky top-0 z-30">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-heading text-lg text-gray-700 truncate max-w-[70%]">
            Hola, <span className="font-bold text-secondary">{userName}</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(true)} className="flex-shrink-0">
            <Avatar 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200" 
              alt={userName} 
              size="md" 
            />
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
          <MapPin size={15} className="text-primary" />
          <span>Caracas, Venezuela</span>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        
        {/* Chat Section */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg shadow-primary/5 p-2 border border-primary/10 flex items-center gap-2">
             <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 flex items-center">
                <input 
                  type="text"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder:text-gray-400 text-sm"
                  placeholder="Escríbele a Dr. Goyo qué te ocurre..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatInputSubmit()}
                />
             </div>
             
             {message.length > 0 ? (
                <button 
                  onClick={handleChatInputSubmit}
                  className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                >
                   <Send size={18} />
                </button>
             ) : (
                <button 
                  onClick={() => onNavigateToChat()}
                  className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                   <Mic size={18} />
                </button>
             )}
          </div>
        </section>

        {/* Carousel Banner */}
        <section>
          <Carousel 
            items={bannerItems} 
            onItemClick={handleBannerClick}
          />
        </section>

        {/* "Te puede Interesar" Grid */}
        <section>
          <h2 className="font-heading font-semibold text-gray-800 mb-3 text-lg">Te puede Interesar</h2>
          <div className="grid grid-cols-1 gap-3">
            {interestItems.map((item) => (
              <button 
                key={item.id}
                onClick={item.action}
                className="bg-white p-4 rounded-2xl shadow-soft flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] group border border-transparent hover:border-gray-50 text-left"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <item.icon size={26} />
                </div>
                <div>
                   <h3 className="font-bold text-gray-800 text-base group-hover:text-primary transition-colors">{item.label}</h3>
                   <p className="text-xs text-gray-500 mt-0.5">Accede a información verificada</p>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>

      <BottomNav activeTab="home" onTabChange={onNavigate} />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userName={userName}
        userImage="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
        onLogout={onLogout}
      />
    </div>
  );
};