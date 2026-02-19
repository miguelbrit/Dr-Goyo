import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, Search, MapPin, X } from 'lucide-react';
import { LaboratoryCard } from '../components/LaboratoryCard';
import { Laboratory, LabService, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Pagination } from '../components/Pagination';
import { Carousel, CarouselItem } from '../components/Carousel';
import { SuggestedArticles } from '../components/SuggestedArticles';

// Dummy Services
const SERVICES: LabService[] = [
  { id: 's1', name: 'Hematología Completa', price: 25, preparation: 'Ayuno no requerido', duration: '24 horas' },
  { id: 's2', name: 'Perfil Lipídico', price: 40, preparation: 'Ayuno 12 horas', duration: '24 horas' },
  { id: 's3', name: 'Perfil Tiroideo', price: 55, preparation: 'Ayuno 8 horas', duration: '48 horas' },
  { id: 's4', name: 'Rayos X de Tórax', price: 35, preparation: 'Ninguna', duration: 'Entrega inmediata' },
  { id: 's5', name: 'Prueba de Embarazo', price: 15, preparation: 'Ninguna', duration: '2 horas' },
];

// Dummy Labs Data
export const LABS_DATA: Laboratory[] = [
  {
    id: '1',
    name: 'Laboratorio VidaLab',
    location: 'Caracas',
    address: 'Av. Francisco de Miranda, Chacao',
    rating: 4.6,
    reviews: 120,
    distance: '2.3 km',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400',
    services: SERVICES,
    hours: '7:00 AM - 5:00 PM',
    phone: '0212-999-1111'
  },
  {
    id: '2',
    name: 'Zulia Diagnósticos',
    location: 'Maracaibo',
    address: 'Av. 5 de Julio',
    rating: 4.8,
    reviews: 210,
    distance: '4.1 km',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400',
    services: [SERVICES[0], SERVICES[1], SERVICES[4]],
    hours: '6:30 AM - 6:00 PM',
    phone: '0261-999-2222'
  },
  {
    id: '3',
    name: 'Bolívar Clínico',
    location: 'Ciudad Bolívar',
    address: 'Paseo Meneses',
    rating: 4.4,
    reviews: 85,
    distance: '1.5 km',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400',
    services: [SERVICES[0], SERVICES[3]],
    hours: '8:00 AM - 4:00 PM',
    phone: '0285-999-3333'
  },
  {
    id: '4',
    name: 'Lara Salud Integral',
    location: 'Barquisimeto',
    address: 'Calle 24 entre 19 y 20',
    rating: 4.9,
    reviews: 340,
    distance: '3.0 km',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    services: SERVICES,
    hours: '24 Horas',
    phone: '0251-999-4444'
  },
  // Added dummy to test pagination
  {
    id: '5',
    name: 'Centro Médico Sucre',
    location: 'Sucre',
    address: 'Av. Principal',
    rating: 4.5,
    reviews: 110,
    distance: '1.0 km',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400',
    services: [SERVICES[0], SERVICES[2]],
    hours: '8:00 AM - 5:00 PM',
    phone: '0293-999-5555'
  }
];

// Banner Data for Labs
const LAB_BANNERS: CarouselItem[] = [
  {
    id: 'l1',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    title: 'Chequeo Anual',
    subtitle: 'Paquete de perfil 20 con 15% de descuento este mes.'
  },
  {
    id: 'l2',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    title: 'Resultados Express',
    subtitle: 'Obtén tus análisis de laboratorio en menos de 24 horas.'
  }
];

interface LabListScreenProps {
  onBack: () => void;
  onSelectLab: (lab: Laboratory) => void;
  onNavigate: (tab: string) => void;
  onNavigateToArticle?: (article: Article) => void; // New Prop
}

export const LabListScreen: React.FC<LabListScreenProps> = ({ 
  onBack, 
  onSelectLab,
  onNavigate,
  onNavigateToArticle
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, minRating]);

  // Filter Options
  const locations = ['Todos', 'Caracas', 'Maracaibo', 'Ciudad Bolívar', 'Barquisimeto', 'Sucre'];

  // Apply filters
  const filteredLabs = LABS_DATA.filter(lab => {
    // Search: Match Lab Name OR Service Name OR Location (Improved Logic)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lab.name.toLowerCase().includes(query) || 
      lab.location.toLowerCase().includes(query) || // Added Location to search
      lab.services.some(s => s.name.toLowerCase().includes(query));

    const matchesLocation = selectedLocation === '' || selectedLocation === 'Todos' || lab.location === selectedLocation;
    const matchesRating = lab.rating >= minRating;

    return matchesSearch && matchesLocation && matchesRating;
  });

  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  const currentLabs = filteredLabs.slice(
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
          <h1 className="font-heading font-bold text-xl text-gray-900">Laboratorios</h1>
          <button 
            onClick={() => setShowFilters(true)}
            className="ml-auto p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors relative"
          >
            <Filter size={20} />
            {(selectedLocation || minRating > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar laboratorio, examen o ciudad..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* --- ADVERTISING BANNER --- */}
        <div className="mb-4">
          <Carousel items={LAB_BANNERS} />
        </div>
        {/* -------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLabs.length > 0 ? (
            <>
              {currentLabs.map(lab => (
                <LaboratoryCard 
                  key={lab.id} 
                  lab={lab} 
                  onClick={() => onSelectLab(lab)}
                  highlightService={searchQuery}
                />
              ))}
            </>
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p>No se encontraron laboratorios.</p>
              <button 
                onClick={() => {
                  setSelectedLocation('');
                  setMinRating(0);
                  setSearchQuery('');
                }}
                className="mt-2 text-primary font-medium text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
        
        {filteredLabs.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* SUGGESTED ARTICLES BANNER */}
        <SuggestedArticles section="labs" onArticleClick={onNavigateToArticle} />
      </div>

      {/* Filter Modal - Fixed Layout */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl z-[70] flex flex-col max-h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="font-heading font-bold text-xl">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Ubicación</label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map(loc => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc === 'Todos' ? '' : loc)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                          (selectedLocation === loc || (loc === 'Todos' && selectedLocation === ''))
                            ? 'bg-secondary text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-secondary/50'
                        }`}
                      >
                        {loc !== 'Todos' && <MapPin size={12} />}
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Valoración mínima</label>
                  <div className="flex justify-between bg-gray-50 p-1 rounded-xl">
                    {[0, 3, 4, 4.5].map(rate => (
                       <button
                          key={rate}
                          onClick={() => setMinRating(rate)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            minRating === rate ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                          }`}
                       >
                          {rate === 0 ? 'Todas' : `${rate}+ ⭐`}
                       </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="sticky bottom-0 bg-white p-4 border-t shrink-0">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                Aplicar Filtros ({filteredLabs.length})
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav activeTab="labs" onTabChange={onNavigate} />
    </div>
  );
};