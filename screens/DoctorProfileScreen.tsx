import React from 'react';
import { ChevronLeft, MessageCircle, MapPin, Award, Users, Star } from 'lucide-react';
import { Doctor } from '../types';
import { Calendar } from '../components/Calendar';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';

interface DoctorProfileScreenProps {
  doctor: Doctor;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ 
  doctor, 
  onBack, 
  onChat,
  onNavigate 
}) => {
  return (
    // Increased padding-bottom to pb-48 (192px) to account for BottomNav (64px) + Fixed Action Bar (~90px) + Safe Area
    <div className="min-h-screen bg-gray-bg pb-48 transition-colors duration-300">
      {/* Header Image Area */}
      <div className="relative h-48 bg-secondary">
         <img 
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover opacity-30"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral/90"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-card/90 p-2 rounded-full shadow-sm text-text-main z-10 hover:bg-card transition-colors"
         >
            <ChevronLeft size={24} />
         </button>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-6 -mt-12 relative z-10">
         <div className="flex justify-between items-end">
            <div className="w-24 h-24 rounded-2xl border-4 border-card shadow-lg overflow-hidden bg-card">
               <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="mb-2">
               <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                  {doctor.specialty}
               </span>
            </div>
         </div>
         
         <div className="mt-4">
            <h1 className="font-heading text-2xl font-bold text-text-main">{doctor.name}</h1>
            <div className="flex items-center gap-2 mt-1">
               <MapPin size={16} className="text-gray-light" />
               <span className="text-gray-text text-sm">{doctor.location} • {doctor.distance}</span>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card p-3 rounded-2xl text-center shadow-sm">
               <div className="flex justify-center text-blue-500 mb-1"><Users size={20} /></div>
               <span className="block font-bold text-text-main">{doctor.patients}+</span>
               <span className="text-xs text-gray-light">Pacientes</span>
            </div>
            <div className="bg-card p-3 rounded-2xl text-center shadow-sm">
               <div className="flex justify-center text-yellow-500 mb-1"><Star size={20} /></div>
               <span className="block font-bold text-text-main">{doctor.rating}</span>
               <span className="text-xs text-gray-light">Rating</span>
            </div>
            <div className="bg-card p-3 rounded-2xl text-center shadow-sm">
               <div className="flex justify-center text-purple-500 mb-1"><Award size={20} /></div>
               <span className="block font-bold text-text-main">{doctor.experience} Años</span>
               <span className="text-xs text-gray-light">Exp.</span>
            </div>
         </div>

         {/* Bio */}
         <div className="mt-8">
            <h3 className="font-heading font-bold text-lg text-text-main mb-2">Biografía</h3>
            <p className="text-gray-text text-sm leading-relaxed">
               {doctor.about}
            </p>
         </div>

         {/* Mini Map */}
         <div className="mt-8">
            <h3 className="font-heading font-bold text-lg text-text-main mb-2">Ubicación</h3>
            <div className="h-32 bg-gray-bg rounded-xl overflow-hidden relative border border-border-main">
               <div className="absolute inset-0 flex items-center justify-center bg-gray-bg/50">
                  <span className="text-gray-light text-xs font-medium">Mapa de Google simulado</span>
                  <MapPin size={32} className="text-secondary absolute drop-shadow-md" />
               </div>
            </div>
         </div>

         {/* Calendar */}
         <div className="mt-8 mb-4">
            <h3 className="font-heading font-bold text-lg text-text-main mb-2">Disponibilidad</h3>
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border-main overflow-hidden">
               <Calendar />
            </div>
         </div>
      </div>

      {/* Floating Action Bar - Shifted up to sit on top of BottomNav */}
      <div className="fixed bottom-[64px] left-0 w-full bg-card border-t border-border-main p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transition-colors">
         <div className="flex gap-4 max-w-md mx-auto">
            <button 
               onClick={onChat}
               className="p-4 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
            >
               <MessageCircle size={24} />
            </button>
            <Button 
               label={`Agendar Cita - $${doctor.price}`} 
               variant="primary" 
               fullWidth 
               className="shadow-lg shadow-primary/25"
            />
         </div>
      </div>

      <BottomNav activeTab="doctors" onTabChange={onNavigate} />
    </div>
  );
};