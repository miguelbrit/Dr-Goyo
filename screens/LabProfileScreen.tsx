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
    <div className="min-h-screen bg-gray-bg pb-48 transition-colors duration-300">
      {/* Header Image Area - Increased height to h-64 for better visibility */}
      <div className="relative h-64 bg-card">
         <img 
            src={lab.image} 
            alt={lab.name} 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-card/90 p-2 rounded-full shadow-sm text-text-main z-10 hover:bg-card transition-colors"
         >
            <ChevronLeft size={24} />
         </button>

         <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="font-heading text-2xl font-bold mb-2 drop-shadow-md">{lab.name}</h1>
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
         <div className="bg-card p-4 rounded-2xl shadow-soft space-y-3 border border-border-main">
             <div className="flex items-start gap-3">
               <MapPin className="text-gray-light mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-text-main">Ubicación</p>
                  <p className="text-sm text-gray-text leading-relaxed">{lab.address}</p>
               </div>
            </div>
             <div className="h-px bg-border-main"></div>
             <div className="flex items-start gap-3">
               <Clock className="text-gray-light mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-text-main">Horario de Atención</p>
                  <p className="text-sm text-gray-text">{lab.hours}</p>
               </div>
            </div>
         </div>

         {/* Services List */}
         <div>
            <h3 className="font-heading font-bold text-lg text-text-main mb-3 px-1">Exámenes Disponibles</h3>
            <div className="space-y-3">
               {lab.services.map((service) => (
                  <div key={service.id} className="bg-card p-4 rounded-xl shadow-sm border border-border-main transition-all hover:border-primary/30">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                              <FlaskConical size={16} />
                           </div>
                           <h4 className="font-bold text-text-main">{service.name}</h4>
                        </div>
                        <span className="font-bold text-lg text-primary">${service.price}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs text-gray-light mt-3">
                        <div className="bg-gray-bg px-3 py-2 rounded-lg flex flex-col gap-1">
                           <span className="font-semibold text-text-main">Preparación:</span>
                           <span>{service.preparation}</span>
                        </div>
                        <div className="bg-gray-bg px-3 py-2 rounded-lg flex flex-col gap-1">
                           <span className="font-semibold text-text-main">Resultados:</span>
                           <span>{service.duration}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Action Bar - Shifted up to sit on top of BottomNav */}
      <div className="fixed bottom-[64px] left-0 w-full bg-card border-t border-border-main p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transition-colors">
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