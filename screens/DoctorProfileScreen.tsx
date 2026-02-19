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
    <div className="min-h-screen bg-white pb-48">
      {/* Header Image Area */}
      <div className="relative h-48 bg-secondary">
         <img 
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover opacity-30"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-700 z-10 hover:bg-white"
         >
            <ChevronLeft size={24} />
         </button>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-6 -mt-12 relative z-10">
         <div className="flex justify-between items-end">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
               <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="mb-2">
               <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                  {doctor.specialty}
               </span>
            </div>
         </div>
         
         <div className="mt-4">
            <h1 className="font-heading text-2xl font-bold text-gray-900">{doctor.name}</h1>
            <div className="flex items-center gap-2 mt-1">
               <MapPin size={16} className="text-gray-400" />
               <span className="text-gray-500 text-sm">{doctor.location} • {doctor.distance}</span>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
               <div className="flex justify-center text-blue-500 mb-1"><Users size={20} /></div>
               <span className="block font-bold text-gray-900">{doctor.patients}+</span>
               <span className="text-xs text-gray-500">Pacientes</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
               <div className="flex justify-center text-yellow-500 mb-1"><Star size={20} /></div>
               <span className="block font-bold text-gray-900">{doctor.rating}</span>
               <span className="text-xs text-gray-500">Rating</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl text-center">
               <div className="flex justify-center text-purple-500 mb-1"><Award size={20} /></div>
               <span className="block font-bold text-gray-900">{doctor.experience} Años</span>
               <span className="text-xs text-gray-500">Exp.</span>
            </div>
         </div>

         {/* Bio */}
         <div className="mt-8">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Biografía</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
               {doctor.about}
            </p>
         </div>

         {/* Mini Map */}
         <div className="mt-8">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Ubicación</h3>
            <div className="h-32 bg-gray-200 rounded-xl overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-xs font-medium">Mapa de Google simulado</span>
                  <MapPin size={32} className="text-red-500 absolute drop-shadow-md" />
               </div>
            </div>
         </div>

         {/* Calendar */}
         <div className="mt-8 mb-4">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Disponibilidad</h3>
            <Calendar />
         </div>
      </div>

      {/* Floating Action Bar - Shifted up to sit on top of BottomNav */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
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