import React from 'react';
import { ChevronLeft, Info, Activity, AlertCircle, Stethoscope, Search } from 'lucide-react';
import { PathologyProfile } from '../types';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';

interface PathologyDetailScreenProps {
  pathology: PathologyProfile;
  onBack: () => void;
  onConsultDoctors: (specialty: string) => void;
  onNavigate: (tab: string) => void;
}

export const PathologyDetailScreen: React.FC<PathologyDetailScreenProps> = ({
  pathology,
  onBack,
  onConsultDoctors,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Image */}
      <div className="relative h-64 bg-teal-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
         <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-700 z-10 hover:bg-white"
         >
            <ChevronLeft size={24} />
         </button>
         
         <div className="z-10 text-teal-200">
            <Activity size={120} strokeWidth={1} />
         </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-t-3xl pt-2">
            <span className="bg-teal-100 text-teal-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
               {pathology.specialty}
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-900 mt-3 mb-6">{pathology.name}</h1>
            
            <div className="space-y-8">
               {/* Description */}
               <section>
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold">
                     <Info size={20} className="text-primary" />
                     <h3>¿Qué es?</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                     {pathology.fullDescription}
                  </p>
               </section>

               {/* Symptoms */}
               <section>
                  <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold">
                     <AlertCircle size={20} className="text-orange-500" />
                     <h3>Síntomas Comunes</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     {pathology.symptoms.map((symptom, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                           <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></div>
                           <span>{symptom}</span>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Causes & Risk Factors */}
               <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <h3 className="font-bold text-gray-900 mb-2 text-sm">Causas Principales</h3>
                     <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {pathology.causes}
                     </p>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 mb-2 text-sm">Factores de Riesgo</h3>
                     <ul className="text-gray-500 text-sm list-disc pl-5 space-y-1">
                        {pathology.riskFactors.map((rf, i) => (
                           <li key={i}>{rf}</li>
                        ))}
                     </ul>
                  </div>
               </section>
            </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[64px] left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
         <div className="max-w-md mx-auto">
            <Button 
               label={`Consultar ${pathology.specialty}s`} 
               icon={Search}
               variant="primary" 
               fullWidth 
               className="shadow-lg shadow-primary/25"
               onClick={() => onConsultDoctors(pathology.specialty)}
            />
         </div>
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};