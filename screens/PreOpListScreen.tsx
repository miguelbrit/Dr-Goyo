import React from 'react';
import { ChevronLeft, ClipboardCheck, FileText, CheckSquare, AlertTriangle } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

interface PreOpListScreenProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const PreOpListScreen: React.FC<PreOpListScreenProps> = ({ onBack, onNavigate }) => {
  const requirements = [
    {
        category: "Exámenes de Laboratorio",
        items: [
            "Hematología Completa",
            "Tiempos de Coagulación (PT y PTT)",
            "Glicemia, Urea y Creatinina",
            "Grupo Sanguíneo y Factor Rh",
            "Prueba de VIH y VDRL"
        ]
    },
    {
        category: "Evaluación Cardiovascular",
        items: [
            "Electrocardiograma (ECG)",
            "Evaluación por Cardiólogo",
            "Rx de Tórax PA (Radiografía)"
        ]
    },
    {
        category: "Indicaciones Generales",
        items: [
            "Ayuno absoluto 8 horas antes de la cirugía",
            "Suspender aspirina o anticoagulantes (según indicación)",
            "Baño con jabón antiséptico",
            "No llevar joyas, maquillaje ni esmalte de uñas"
        ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Listas Pre-Operatorias</h1>
            <p className="text-xs text-gray-500">Guía general para cirugía electiva</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">
           <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
           <p className="text-sm text-blue-800">
             Estas listas son referenciales. Tu cirujano puede solicitar exámenes adicionales dependiendo de tu edad y tipo de intervención.
           </p>
        </div>

        {requirements.map((section, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                        <ClipboardCheck size={20} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900">{section.category}</h3>
                </div>
                <ul className="space-y-3">
                    {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckSquare size={18} className="text-gray-300 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
        
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <FileText size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-4">¿Necesitas realizar tus exámenes?</p>
            <button 
                onClick={() => onNavigate('labs')}
                className="text-primary font-bold text-sm hover:underline"
            >
                Buscar Laboratorios Cercanos
            </button>
        </div>

      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};