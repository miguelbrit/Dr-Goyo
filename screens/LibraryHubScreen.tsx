import React from 'react';
import { ChevronLeft, Pill, Activity } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

interface LibraryHubScreenProps {
  onBack: () => void;
  onNavigateToMedicines: () => void;
  onNavigateToPathologies: () => void;
  onNavigate: (tab: string) => void;
}

export const LibraryHubScreen: React.FC<LibraryHubScreenProps> = ({
  onBack,
  onNavigateToMedicines,
  onNavigateToPathologies,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-gray-bg flex flex-col pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 shadow-sm sticky top-0 z-20 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-2xl text-secondary">Biblioteca</h1>
            <p className="text-gray-500 text-sm">Información de salud verificada</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        
        {/* Medicines Card */}
        <button 
          onClick={onNavigateToMedicines}
          className="w-full bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Pill size={40} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Medicamentos</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Guía completa de fármacos, dosis recomendadas, efectos secundarios y contraindicaciones.
            </p>
          </div>
          <span className="text-primary font-bold text-sm mt-2 group-hover:underline">Explorar Medicamentos</span>
        </button>

        {/* Pathologies Card */}
        <button 
          onClick={onNavigateToPathologies}
          className="w-full bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all group"
        >
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Activity size={40} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Patologías</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Información detallada sobre enfermedades, síntomas, causas y especialistas recomendados.
            </p>
          </div>
          <span className="text-primary font-bold text-sm mt-2 group-hover:underline">Explorar Patologías</span>
        </button>

      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};