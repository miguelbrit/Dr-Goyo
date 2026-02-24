import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Activity, ChevronRight, Stethoscope, Loader2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { PathologyProfile } from '../types';
import { Pagination } from '../components/Pagination';
import { useGlossary } from '../hooks/useGlossary';

interface PathologyLibraryScreenProps {
  onBack: () => void;
  onSelectPathology: (pathology: PathologyProfile) => void;
  onNavigate: (tab: string) => void;
}

export const PathologyLibraryScreen: React.FC<PathologyLibraryScreenProps> = ({
  onBack,
  onSelectPathology,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { items: glossaryItems, loading } = useGlossary('PATHOLOGY');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Map GlossaryItem to PathologyProfile
  const pathologies: PathologyProfile[] = (glossaryItems || []).map(item => ({
    id: item.id,
    name: item.term,
    shortDescription: item.description.substring(0, 100) + '...',
    fullDescription: item.description,
    symptoms: [],
    causes: "Ver descripción.",
    riskFactors: [],
    specialty: item.category || 'General',
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1a44?auto=format&fit=crop&q=80&w=200'
  }));

  const filteredPathologies = pathologies
    .filter(pat => pat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredPathologies.length / itemsPerPage);
  const currentPathologies = filteredPathologies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl text-gray-900">Patologías</h1>
            <p className="text-xs text-gray-500">Información médica</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar enfermedad (ej. Migraña)..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 size={40} className="animate-spin mb-4 text-primary opacity-20" />
            <p className="text-sm font-medium">Cargando patologías...</p>
          </div>
        ) : currentPathologies.length > 0 ? (
          <>
            {currentPathologies.map((pat) => (
              <button
                key={pat.id}
                onClick={() => onSelectPathology(pat)}
                className="w-full bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group text-left"
              >
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Activity size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-gray-900 truncate">{pat.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{pat.shortDescription}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                    <Stethoscope size={12} />
                    <span>{pat.specialty}</span>
                  </div>
                </div>

                <div className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Activity size={48} className="mx-auto mb-4 opacity-20" />
            <p>{searchQuery ? 'No se encontraron resultados.' : 'Contenido próximamente.'}</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};