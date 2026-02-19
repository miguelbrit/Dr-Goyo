import React from 'react';
import { ChevronLeft, MessageCircle, MapPin, Clock, FlaskConical, Info } from 'lucide-react';
import { Laboratory } from '../types';
import { Button } from '../components/Button';
import { Rating } from '../components/Rating';
import { BottomNav } from '../components/BottomNav';

interface LabProfileScreenProps {
  lab: Laboratory;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
}

export const LabProfileScreen: React.FC<LabProfileScreenProps> = ({ 
  lab, 
  onBack, 
  onChat, 
  onNavigate 
}) => {
  return (
    // Increased padding-bottom to pb-48 (192px) to account for BottomNav (64px) + Fixed Action Bar (~90px) + Safe Area
    <div className="min-h-screen bg-gray-50 pb-48">
      {/* Header Image Area - Increased height to h-64 for better visibility */}
      <div className="relative h-64 bg-white">
         <img 
            src={lab.image} 
            alt={lab.name} 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-700 z-10 hover:bg-white"
         >
            <ChevronLeft size={24} />
         </button>

         <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="font-heading text-2xl font-bold mb-2">{lab.name}</h1>
            <div className="flex items-center gap-3 text-sm text-white/90">
               <div className="flex items-center gap-1">
                 <MapPin size={14} />
                 <span>{lab.location}</span>
               </div>
               <span>•</span>
               <Rating value={lab.rating} count={lab.reviews} size={14} />
            </div>
         </div>
      </div>

      {/* Content Container - Removed negative margin (-mt) and added positive margin (mt-4) to avoid overlap */}
      <div className="px-6 mt-4 relative z-10 space-y-4">
         
         {/* Info Card */}
         <div className="bg-white p-4 rounded-2xl shadow-soft space-y-3">
             <div className="flex items-start gap-3">
               <MapPin className="text-gray-400 mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-gray-900">Ubicación</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{lab.address}</p>
               </div>
            </div>
             <div className="h-px bg-gray-100"></div>
             <div className="flex items-start gap-3">
               <Clock className="text-gray-400 mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-gray-900">Horario de Atención</p>
                  <p className="text-sm text-gray-600">{lab.hours}</p>
               </div>
            </div>
         </div>

         {/* Services List */}
         <div>
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-3 px-1">Exámenes Disponibles</h3>
            <div className="space-y-3">
               {lab.services.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className="bg-orange-50 p-1.5 rounded-lg text-orange-600">
                              <FlaskConical size={16} />
                           </div>
                           <h4 className="font-bold text-gray-900">{service.name}</h4>
                        </div>
                        <span className="font-bold text-lg text-primary">${service.price}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                        <div className="bg-gray-50 px-3 py-2 rounded-lg flex flex-col gap-1">
                           <span className="font-semibold text-gray-700">Preparación:</span>
                           <span>{service.preparation}</span>
                        </div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg flex flex-col gap-1">
                           <span className="font-semibold text-gray-700">Resultados:</span>
                           <span>{service.duration}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Action Bar - Shifted up to sit on top of BottomNav */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
         <div className="flex gap-3 max-w-md mx-auto">
            <button 
               onClick={onChat}
               className="p-3.5 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
            >
               <MessageCircle size={24} />
            </button>
            <Button 
               label="Agendar Cita" 
               variant="primary" 
               fullWidth 
               className="shadow-lg shadow-primary/25"
            />
         </div>
      </div>

      <BottomNav activeTab="labs" onTabChange={onNavigate} />
    </div>
  );
};