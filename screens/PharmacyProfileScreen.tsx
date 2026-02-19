import React from 'react';
import { ChevronLeft, MessageCircle, MapPin, Clock, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Pharmacy } from '../types';
import { Button } from '../components/Button';
import { Rating } from '../components/Rating';
import { BottomNav } from '../components/BottomNav';

interface PharmacyProfileScreenProps {
  pharmacy: Pharmacy;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
}

export const PharmacyProfileScreen: React.FC<PharmacyProfileScreenProps> = ({ 
  pharmacy, 
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
            src={pharmacy.image} 
            alt={pharmacy.name} 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-700 z-10 hover:bg-white"
         >
            <ChevronLeft size={24} />
         </button>

         <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="font-heading text-2xl font-bold mb-2">{pharmacy.name}</h1>
            <div className="flex items-center gap-2 text-sm text-white/90">
               <MapPin size={14} />
               <span>{pharmacy.location}</span>
               <span>•</span>
               <Rating value={pharmacy.rating} count={pharmacy.reviews} size={14} />
            </div>
         </div>
      </div>

      {/* Content Container - Removed negative margin (-mt) and added positive margin (mt-4) to avoid overlap */}
      <div className="px-6 mt-4 relative z-10 space-y-4">
         {/* Status Card */}
         <div className="bg-white p-4 rounded-2xl shadow-soft flex justify-between items-center">
             <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Horario</p>
                <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                   <Clock size={16} className="text-primary" />
                   <span>{pharmacy.hours}</span>
                </div>
             </div>
             <div>
                {pharmacy.isOpen ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> ABIERTO
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <XCircle size={12} /> CERRADO
                    </span>
                )}
             </div>
         </div>

         {/* Info */}
         <div className="bg-white p-4 rounded-2xl shadow-soft space-y-3">
            <div className="flex items-start gap-3">
               <MapPin className="text-gray-400 mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-gray-900">Dirección</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{pharmacy.address}</p>
               </div>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="flex items-start gap-3">
               <Phone className="text-gray-400 mt-1" size={20} />
               <div>
                  <p className="text-sm font-bold text-gray-900">Teléfono</p>
                  <p className="text-sm text-gray-600">{pharmacy.phone}</p>
               </div>
            </div>
         </div>

         {/* Medicine List */}
         <div className="pt-2">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">Medicamentos Disponibles</h3>
            <div className="space-y-3">
               {pharmacy.inventory && pharmacy.inventory.length > 0 ? (
                  pharmacy.inventory.map((med) => (
                     <div key={med.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                           <p className="font-medium text-gray-900">{med.name}</p>
                           <p className="text-xs text-gray-500">{med.description}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-primary">${med.price.toFixed(2)}</p>
                           {med.available ? (
                              <span className="text-[10px] text-green-600 font-medium">En stock</span>
                           ) : (
                              <span className="text-[10px] text-red-400 font-medium">Agotado</span>
                           )}
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-gray-400 text-center text-sm py-4">No hay información de inventario disponible.</p>
               )}
            </div>
         </div>
      </div>

      {/* Action Bar - Shifted up to sit on top of BottomNav */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
         <div className="flex gap-4 max-w-md mx-auto">
            <Button 
               label="Chatear con Farmacia" 
               icon={MessageCircle}
               variant="secondary" 
               fullWidth 
               className="shadow-lg"
               onClick={onChat}
            />
         </div>
      </div>

      <BottomNav activeTab="pharmacy" onTabChange={onNavigate} />
    </div>
  );
};