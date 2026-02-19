import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { PathologyProfile } from '../types';
import { Pagination } from '../components/Pagination';

// Dummy Data for Pathologies (5 items as requested)
export const PATHOLOGIES_DB: PathologyProfile[] = [
  {
    id: 'pat1',
    name: 'Diabetes Mellitus',
    shortDescription: 'Enfermedad crónica que afecta la conversión de alimentos en energía.',
    fullDescription: 'La diabetes es una enfermedad crónica de larga duración que afecta la forma en que el cuerpo convierte los alimentos en energía. La mayoría de los alimentos que come se convierten en azúcar (glucosa) que se libera en el torrente sanguíneo.',
    symptoms: ['Aumento de la sed', 'Micción frecuente', 'Hambre extrema', 'Pérdida de peso sin causa'],
    causes: 'Resistencia a la insulina o incapacidad del páncreas para producir insulina.',
    riskFactors: ['Obesidad', 'Sedentarismo', 'Antecedentes familiares', 'Edad avanzada'],
    specialty: 'Endocrinólogo',
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1a44?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'pat2',
    name: 'Hipertensión Arterial',
    shortDescription: 'Presión arterial alta constante que puede dañar las arterias.',
    fullDescription: 'La hipertensión arterial es una enfermedad común en la que la fuerza que ejerce la sangre contra las paredes de las arterias con el transcurso del tiempo es lo suficientemente alta como para poder causarte problemas de salud, como una enfermedad cardíaca.',
    symptoms: ['Dolor de cabeza', 'Dificultad para respirar', 'Sangrado nasal', 'Generalmente asintomática'],
    causes: 'Estrechamiento de las arterias, volumen de sangre elevado, o condiciones subyacentes.',
    riskFactors: ['Consumo excesivo de sal', 'Estrés', 'Tabaco', 'Alcohol'],
    specialty: 'Cardiólogo',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'pat3',
    name: 'Asma',
    shortDescription: 'Vías respiratorias estrechas e inflamadas que dificultan la respiración.',
    fullDescription: 'El asma es una afección en la que las vías respiratorias de una persona se inflaman, estrechan y producen mayores cantidades de mucosa de lo normal, lo que dificulta la respiración.',
    symptoms: ['Falta de aire', 'Dolor u opresión del pecho', 'Sibilancias al exhalar', 'Tos nocturna'],
    causes: 'Combinación de factores ambientales y genéticos (alérgenos, aire frío).',
    riskFactors: ['Fumar', 'Obesidad', 'Exposición a contaminantes', 'Alergias'],
    specialty: 'Neumonólogo',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'pat4',
    name: 'Anemia',
    shortDescription: 'Insuficiencia de glóbulos rojos sanos para transportar oxígeno.',
    fullDescription: 'La anemia es una afección que se desarrolla cuando la sangre produce una cantidad inferior a la normal de glóbulos rojos sanos. Si tiene anemia, su cuerpo no obtiene suficiente cantidad de sangre rica en oxígeno.',
    symptoms: ['Fatiga extrema', 'Debilidad', 'Piel pálida o amarillenta', 'Manos y pies fríos'],
    causes: 'Deficiencia de hierro, vitamina B12, o enfermedades crónicas.',
    riskFactors: ['Dieta carente de vitaminas', 'Trastornos intestinales', 'Menstruación'],
    specialty: 'Hematólogo',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'pat5',
    name: 'Migraña',
    shortDescription: 'Dolor de cabeza intenso, a menudo acompañado de náuseas y sensibilidad a la luz.',
    fullDescription: 'Una migraña es un dolor de cabeza que puede causar un dolor pulsátil intenso o una sensación pulsante, generalmente de un solo lado. A menudo suele estar acompañada de náuseas, vómitos y sensibilidad a la luz y al sonido.',
    symptoms: ['Dolor pulsátil en un lado', 'Náuseas y vómitos', 'Sensibilidad a la luz', 'Aura visual'],
    causes: 'Cambios en el tronco encefálico y sus interacciones con el nervio trigémino.',
    riskFactors: ['Historial familiar', 'Edad', 'Sexo (más común en mujeres)', 'Cambios hormonales'],
    specialty: 'Neurólogo',
    image: 'https://images.unsplash.com/photo-1612506697071-7058296a2068?auto=format&fit=crop&q=80&w=200'
  }
];

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
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter and Sort Alphabetically
  const filteredPathologies = PATHOLOGIES_DB
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
        {currentPathologies.length > 0 ? (
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
            <p>No se encontraron resultados.</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};