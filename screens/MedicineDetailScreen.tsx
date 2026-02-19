import React from 'react';
import { ChevronLeft, Info, AlertTriangle, FileText, ShoppingCart, Pill } from 'lucide-react';
import { MedicineProfile } from '../types';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';

interface MedicineDetailScreenProps {
  medicine: MedicineProfile;
  onBack: () => void;
  onFindInPharmacies: (medicineName: string) => void;
  onNavigate: (tab: string) => void;
}

export const MedicineDetailScreen: React.FC<MedicineDetailScreenProps> = ({
  medicine,
  onBack,
  onFindInPharmacies,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Image */}
      <div className="relative h-64 bg-blue-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-700 z-10 hover:bg-white"
         >
            <ChevronLeft size={24} />
         </button>
         
         <div className="z-10 text-blue-200">
            <Pill size={120} strokeWidth={1} />
         </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-t-3xl pt-2">
            <span className="bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
               {medicine.category}
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mt-3 mb-6">{medicine.name}</h1>
            
            <div className="space-y-8">
               {/* Description */}
               <section>
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold">
                     <Info size={20} className="text-primary" />
                     <h3>Descripción</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                     {medicine.description}
                  </p>
               </section>

               {/* Dosage */}
               <section>
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold">
                     <FileText size={20} className="text-primary" />
                     <h3>Dosis Recomendada</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border-l-4 border-primary">
                     {medicine.dosage}
                  </div>
               </section>

               {/* Side Effects */}
               <section>
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold">
                     <AlertTriangle size={20} className="text-orange-500" />
                     <h3>Efectos Secundarios</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {medicine.sideEffects.map((effect, idx) => (
                        <span key={idx} className="bg-orange-50 text-orange-800 text-xs px-3 py-1.5 rounded-lg font-medium">
                           {effect}
                        </span>
                     ))}
                  </div>
               </section>

               {/* Precautions */}
               <section>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">Precauciones</h3>
                  <p className="text-gray-500 text-sm italic">
                     {medicine.precautions}
                  </p>
               </section>
            </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
         <div className="max-w-md mx-auto">
            <Button 
               label={`Buscar ${medicine.name} en Farmacias`} 
               icon={ShoppingCart}
               variant="primary" 
               fullWidth 
               className="shadow-lg shadow-primary/25"
               onClick={() => onFindInPharmacies(medicine.name)}
            />
         </div>
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};