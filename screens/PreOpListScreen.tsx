import React from 'react';
import { ChevronLeft, ClipboardCheck, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useGlossary } from '../hooks/useGlossary';

interface PreOpListScreenProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const PreOpListScreen: React.FC<PreOpListScreenProps> = ({ onBack, onNavigate }) => {
  const { items, loading } = useGlossary('PRE_OP_LIST');

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 size={40} className="animate-spin mb-4 text-primary opacity-20" />
            <p className="text-sm font-medium">Cargando guías...</p>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                        <ClipboardCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900">{item.term}</h3>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">{item.category}</p>
                    </div>
                </div>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
            <ClipboardCheck size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm font-medium">Contenido próximamente.</p>
          </div>
        )}
        
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