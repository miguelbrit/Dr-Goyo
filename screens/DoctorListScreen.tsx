import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, Search, MapPin, X } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Pagination } from '../components/Pagination';
import { Carousel, CarouselItem } from '../components/Carousel';
import { SuggestedArticles } from '../components/SuggestedArticles';

// Dummy Data
export const DOCTORS_DATA: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Pedro León',
    specialty: 'Cardiólogo',
    location: 'Caracas',
    distance: '2.5 km',
    rating: 4.5,
    reviews: 84,
    price: 80,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Hoy, 3:00 PM',
    about: 'Especialista en salud cardiovascular con enfoque en prevención y tratamiento de hipertensión. Egresado de la UCV con postgrado en España.',
    experience: 12,
    patients: 1500,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Dra. Lucia Mendez',
    specialty: 'Pediatra',
    location: 'Zulia',
    distance: '5.0 km',
    rating: 4.7,
    reviews: 120,
    price: 60,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Mañana, 9:00 AM',
    about: 'Atención integral para niños y adolescentes. Experta en desarrollo infantil y nutrición pediátrica.',
    experience: 8,
    patients: 950
  },
  {
    id: '3',
    name: 'Dr. Julian Lopez',
    specialty: 'Nutricionista',
    location: 'Bolivar',
    distance: '1.8 km',
    rating: 4.3,
    reviews: 45,
    price: 45,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Hoy, 5:00 PM',
    about: 'Planes nutricionales personalizados para control de peso, diabetes y rendimiento deportivo.',
    experience: 5,
    patients: 400
  },
  {
    id: '4',
    name: 'Dra. Marisela Rodriguez',
    specialty: 'Ginecólogo',
    location: 'Lara',
    distance: '3.2 km',
    rating: 4.9,
    reviews: 210,
    price: 90,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Jueves, 10:00 AM',
    about: 'Ginecología y obstetricia. Control prenatal, planificación familiar y cirugía laparoscópica.',
    experience: 15,
    patients: 3200,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Dr. Jon Snow',
    specialty: 'Neurólogo',
    location: 'Sucre',
    distance: '3.0 km',
    rating: 4.3,
    reviews: 56,
    price: 90,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da60a71?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Mañana, 4:00 PM',
    about: 'Especialista en trastornos del sistema nervioso central y periférico. Experiencia en tratamiento de migrañas crónicas y epilepsia.',
    experience: 7,
    patients: 600
  },
  {
    id: '6',
    name: 'Dra. Luisa Laine',
    specialty: 'Hematólogo',
    location: 'Mérida',
    distance: '1.5 km',
    rating: 4.9,
    reviews: 230,
    price: 75,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Hoy, 11:00 AM',
    about: 'Experta en enfermedades de la sangre. Atención dedicada a pacientes con anemia y trastornos de coagulación.',
    experience: 20,
    patients: 4500,
    isFeatured: true
  },
  {
    id: '7',
    name: 'Dr. Tony Stark',
    specialty: 'Neumonólogo',
    location: 'Aragua',
    distance: '4.2 km',
    rating: 4.6,
    reviews: 88,
    price: 120,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Jueves, 2:00 PM',
    about: 'Especialista en salud respiratoria y tecnología médica aplicada. Tratamiento avanzado para asma, EPOC y recuperación post-COVID.',
    experience: 15,
    patients: 2100
  },
  {
    id: '8',
    name: 'Dra. Yecenia Black',
    specialty: 'Endocrinólogo',
    location: 'Anzoátegui',
    distance: '2.8 km',
    rating: 4.5,
    reviews: 110,
    price: 85,
    image: 'https://images.unsplash.com/photo-1651008325513-37635f22ca17?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Viernes, 9:00 AM',
    about: 'Atención especializada en diabetes, tiroides y trastornos hormonales. Enfoque integral y personalizado para el bienestar metabólico.',
    experience: 10,
    patients: 1200
  }
];

// Banner Data for Doctors
const DOCTOR_BANNERS: CarouselItem[] = [
  {
    id: 'd1',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800',
    title: 'Seguros Médicos',
    subtitle: 'Conoce los especialistas afiliados a tu póliza de seguro.'
  },
  {
    id: 'd2',
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1a44?auto=format&fit=crop&q=80&w=800',
    title: 'Telemedicina',
    subtitle: 'Consulta con médicos certificados desde la comodidad de tu hogar.'
  }
];

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  initialOpenFilters?: boolean;
  onNavigate: (tab: string) => void;
  initialSearchQuery?: string;
  initialSpecialty?: string;
  onNavigateToArticle?: (article: Article) => void; // New Prop
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ 
  onBack, 
  onSelectDoctor,
  initialOpenFilters = false,
  onNavigate,
  initialSearchQuery = '',
  initialSpecialty = '',
  onNavigateToArticle
}) => {
  const [showFilters, setShowFilters] = useState(initialOpenFilters);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  
  // Filter States
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialty, selectedLocation, minRating]);

  // Filter Options
  const specialties = [
    'Todos', 
    'Cardiólogo', 
    'Pediatra', 
    'Nutricionista', 
    'Ginecólogo', 
    'Neurólogo', 
    'Hematólogo', 
    'Neumonólogo', 
    'Endocrinólogo'
  ];
  const locations = [
    'Todos', 
    'Caracas', 
    'Zulia', 
    'Bolivar', 
    'Lara', 
    'Sucre', 
    'Mérida', 
    'Aragua', 
    'Anzoátegui'
  ];

  // Apply filters
  const filteredDoctors = DOCTORS_DATA.filter(doc => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(query) || 
                          doc.specialty.toLowerCase().includes(query);
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'Todos' || doc.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === '' || selectedLocation === 'Todos' || doc.location === selectedLocation;
    const matchesRating = doc.rating >= minRating;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesRating;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice(
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
          <h1 className="font-heading font-bold text-xl text-gray-900">Especialistas</h1>
          <button 
            onClick={() => setShowFilters(true)}
            className="ml-auto p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors relative"
          >
            <Filter size={20} />
            {(selectedSpecialty || selectedLocation || minRating > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o especialidad..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* --- ADVERTISING BANNER --- */}
        <div className="mb-4">
          <Carousel items={DOCTOR_BANNERS} />
        </div>

        {(initialSearchQuery || initialSpecialty) && (
           <div className="mb-4 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Search size={14} />
              <span>
                Filtros activos: 
                {initialSearchQuery && <strong> {initialSearchQuery} </strong>}
                {initialSpecialty && <strong> {initialSpecialty} </strong>}
              </span>
           </div>
        )}
        
        {currentDoctors.length > 0 ? (
          <>
            {currentDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onClick={() => onSelectDoctor(doctor)}
                onBook={() => onSelectDoctor(doctor)}
              />
            ))}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No se encontraron médicos con estos filtros.</p>
            <button 
              onClick={() => {
                setSelectedSpecialty('');
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

        {/* SUGGESTED ARTICLES BANNER */}
        <SuggestedArticles section="doctors" onArticleClick={onNavigateToArticle} />
        
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
                {/* Specialty */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Especialidad</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map(spec => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec === 'Todos' ? '' : spec)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          (selectedSpecialty === spec || (spec === 'Todos' && selectedSpecialty === ''))
                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

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
                Aplicar Filtros ({filteredDoctors.length})
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav activeTab="doctors" onTabChange={onNavigate} />
    </div>
  );
};