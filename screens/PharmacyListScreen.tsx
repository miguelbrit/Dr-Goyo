import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, Search, MapPin, X } from 'lucide-react';
import { PharmacyCard } from '../components/PharmacyCard';
import { Pharmacy, Medicament, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Pagination } from '../components/Pagination';
import { Carousel, CarouselItem } from '../components/Carousel';
import { SuggestedArticles } from '../components/SuggestedArticles';

// Dummy Medicaments for reuse
const COMMON_MEDS: Medicament[] = [
  { id: 'm1', name: 'Paracetamol 500mg', price: 5.50, available: true, description: 'Analgésico y antipirético.' },
  { id: 'm2', name: 'Ibuprofeno 400mg', price: 8.00, available: true, description: 'Antiinflamatorio no esteroideo.' },
  { id: 'm3', name: 'Amoxicilina 500mg', price: 12.00, available: true, description: 'Antibiótico de amplio espectro.' },
  { id: 'm4', name: 'Loratadina 10mg', price: 4.50, available: false, description: 'Antihistamínico.' },
  { id: 'm5', name: 'Vitamina C', price: 15.00, available: true, description: 'Suplemento vitamínico.' },
];

// Dummy Data
export const PHARMACY_DATA: Pharmacy[] = [
  {
    id: '1',
    name: 'Farmacia Central',
    location: 'Caracas',
    address: 'Av. Urdaneta, Centro',
    distance: '1.2 km',
    rating: 4.5,
    reviews: 320,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
    inventory: [...COMMON_MEDS],
    hours: '24 Horas',
    phone: '0212-555-001'
  },
  {
    id: '2',
    name: 'Farmacia San José',
    location: 'Maracaibo',
    address: 'Av. Bella Vista',
    distance: '3.5 km',
    rating: 4.7,
    reviews: 150,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
    inventory: [COMMON_MEDS[0], COMMON_MEDS[2], COMMON_MEDS[4]],
    hours: '8:00 AM - 10:00 PM',
    phone: '0261-555-002'
  },
  {
    id: '3',
    name: 'Farmacia Bolívar',
    location: 'Ciudad Bolívar',
    address: 'Paseo Orinoco',
    distance: '0.8 km',
    rating: 4.3,
    reviews: 89,
    isOpen: false,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400',
    inventory: [COMMON_MEDS[1], COMMON_MEDS[3]],
    hours: '8:00 AM - 8:00 PM',
    phone: '0285-555-003'
  },
  {
    id: '4',
    name: 'Farmacia Lara Salud',
    location: 'Barquisimeto',
    address: 'Av. Lara, Este',
    distance: '2.1 km',
    rating: 4.9,
    reviews: 410,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    inventory: [...COMMON_MEDS],
    hours: '24 Horas',
    phone: '0251-555-004'
  },
  // Added dummy items to demonstrate pagination
  {
    id: '5',
    name: 'Farmacia Los Andes',
    location: 'Mérida',
    address: 'Av. Las Américas',
    distance: '1.5 km',
    rating: 4.6,
    reviews: 120,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    inventory: [...COMMON_MEDS],
    hours: '8:00 AM - 10:00 PM',
    phone: '0274-555-005'
  }
];

// Banner Data for Pharmacies
const PHARMACY_BANNERS: CarouselItem[] = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    title: 'Suplementos y Vitaminas',
    subtitle: 'Refuerza tu sistema inmunológico con nuestras ofertas del mes.'
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    title: 'Delivery Gratis',
    subtitle: 'En pedidos superiores a $20. ¡Recibe tus medicinas en casa!'
  }
];

interface PharmacyListScreenProps {
  onBack: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onNavigate: (tab: string) => void;
  initialSearchQuery?: string;
  onNavigateToArticle?: (article: Article) => void; // New Prop
}

export const PharmacyListScreen: React.FC<PharmacyListScreenProps> = ({ 
  onBack, 
  onSelectPharmacy,
  onNavigate,
  initialSearchQuery = '',
  onNavigateToArticle
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  // Filter States
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(PHARMACY_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/entities/pharmacies');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const mapped = result.data.map((p: any) => ({
            id: p.id,
            name: p.profile?.name || p.name,
            location: p.city || 'Venezuela',
            address: p.address || 'Consultar dirección',
            distance: '--',
            rating: 4.6, 
            reviews: Math.floor(Math.random() * 200),
            isOpen: true,
            image: p.profile?.imageUrl || 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
            inventory: [...COMMON_MEDS], // Placeholder inventory
            hours: `${p.openingHours || '08:00'} - ${p.closingHours || '20:00'}`,
            phone: p.phone || 'N/A'
          }));
          setPharmacies(mapped);
        }
      } catch (err) {
        console.error("Error loading pharmacies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, []);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, minRating]);

  // Filter Options
  const locations = ['Todos', 'Caracas', 'Maracaibo', 'Ciudad Bolívar', 'Barquisimeto', 'Mérida'];

  // Apply filters
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    // Search logic: Name of pharmacy OR name of medicine in inventory
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      pharmacy.name.toLowerCase().includes(query) || 
      (pharmacy.inventory && pharmacy.inventory.some(med => med.name.toLowerCase().includes(query)));

    const matchesLocation = selectedLocation === '' || selectedLocation === 'Todos' || pharmacy.location === selectedLocation;
    const matchesRating = pharmacy.rating >= minRating;

    return matchesSearch && matchesLocation && matchesRating;
  });

  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);
  const currentPharmacies = filteredPharmacies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="bg-card px-4 py-4 shadow-soft sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-bg rounded-full text-gray-light">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text-main">Farmacias</h1>
          <button 
            onClick={() => setShowFilters(true)}
            className="ml-auto p-2 bg-gray-bg rounded-full text-gray-light hover:bg-primary/10 hover:text-primary transition-colors relative"
          >
            <Filter size={20} />
            {(selectedLocation || minRating > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light" size={18} />
          <input 
            type="text" 
            placeholder="Buscar farmacia o medicamento..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-bg border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-main placeholder:text-gray-light"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* --- ADVERTISING BANNER --- */}
        <div className="mb-4">
          <Carousel items={PHARMACY_BANNERS} />
        </div>

        {initialSearchQuery && (
           <div className="mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-primary/20">
              <Search size={14} />
              <span>Buscando disponibilidad de: <strong className="text-text-main">{initialSearchQuery}</strong></span>
           </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPharmacies.length > 0 ? (
            <>
              {currentPharmacies.map(pharmacy => (
                <PharmacyCard 
                  key={pharmacy.id} 
                  pharmacy={pharmacy} 
                  onClick={() => onSelectPharmacy(pharmacy)}
                  highlightMedicine={searchQuery} // Pass query to highlight matched medicine
                />
              ))}
            </>
          ) : (
            <div className="col-span-full text-center py-12 text-gray-light">
              <p>No se encontraron resultados.</p>
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
        
        {filteredPharmacies.length > 0 && (
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* SUGGESTED ARTICLES BANNER */}
        <SuggestedArticles section="pharmacy" onArticleClick={onNavigateToArticle} />
      </div>

      {/* Filter Modal - Fixed Layout */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 w-full bg-card rounded-t-3xl z-[70] flex flex-col max-h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-border-main shrink-0">
              <h2 className="font-heading font-bold text-xl text-text-main">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 text-gray-light hover:bg-gray-bg rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-text mb-3">Ubicación</label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map(loc => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc === 'Todos' ? '' : loc)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                          (selectedLocation === loc || (loc === 'Todos' && selectedLocation === ''))
                            ? 'bg-secondary text-neutral shadow-md'
                            : 'bg-card border border-border-main text-gray-text hover:border-secondary/50'
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
                  <label className="block text-sm font-bold text-gray-text mb-3">Valoración mínima</label>
                  <div className="flex justify-between bg-gray-bg p-1 rounded-xl">
                    {[0, 3, 4, 4.5].map(rate => (
                       <button
                          key={rate}
                          onClick={() => setMinRating(rate)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            minRating === rate ? 'bg-card shadow-sm text-text-main' : 'text-gray-light'
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
             <div className="sticky bottom-0 bg-card p-4 border-t border-border-main shrink-0">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl bg-primary text-neutral font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                Aplicar Filtros ({filteredPharmacies.length})
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav activeTab="pharmacy" onTabChange={onNavigate} />
    </div>
  );
};