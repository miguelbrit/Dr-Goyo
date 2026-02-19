import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Pill, ChevronRight } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { MedicineProfile } from '../types';
import { Pagination } from '../components/Pagination';

// Dummy Data for Medicines
export const MEDICINES_DB: MedicineProfile[] = [
  {
    id: 'med1',
    name: 'Amoxicilina',
    category: 'Antibiótico',
    description: 'Antibiótico semisintético derivado de la penicilina. Se utiliza para tratar una amplia variedad de infecciones bacterianas.',
    dosage: 'Generalmente 500mg cada 8 horas, o según indicación médica.',
    sideEffects: ['Náuseas', 'Erupción cutánea', 'Diarrea'],
    precautions: 'No usar si es alérgico a la penicilina. Completar el tratamiento prescrito.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'med2',
    name: 'Ibuprofeno',
    category: 'Antiinflamatorio',
    description: 'Antiinflamatorio no esteroideo (AINE) utilizado para aliviar el dolor, reducir la inflamación y bajar la fiebre.',
    dosage: 'Adultos: 400mg a 600mg cada 6-8 horas. Máximo 2400mg al día.',
    sideEffects: ['Acidez estomacal', 'Dolor de estómago', 'Mareos'],
    precautions: 'Tomar con alimentos. Evitar uso prolongado sin supervisión médica.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'med3',
    name: 'Loratadina',
    category: 'Antihistamínico',
    description: 'Medicamento utilizado para tratar síntomas de alergias como estornudos, secreción nasal y picazón en los ojos.',
    dosage: 'Adultos y niños mayores de 6 años: 10mg una vez al día.',
    sideEffects: ['Dolor de cabeza', 'Somnolencia (poco común)', 'Boca seca'],
    precautions: 'Precaución en pacientes con enfermedad hepática grave.',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'med4',
    name: 'Metformina',
    category: 'Antidiabético',
    description: 'Medicamento de primera línea para el tratamiento de la diabetes tipo 2. Ayuda a controlar los niveles de azúcar en sangre.',
    dosage: 'Inicialmente 500mg o 850mg una vez al día con las comidas.',
    sideEffects: ['Náuseas', 'Malestar estomacal', 'Sabor metálico'],
    precautions: 'No usar en caso de insuficiencia renal severa.',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f0263329?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'med5',
    name: 'Paracetamol',
    category: 'Analgésico / Antipirético',
    description: 'Medicamento común para aliviar el dolor leve o moderado y reducir la fiebre.',
    dosage: 'Adultos: 500mg a 1000mg cada 4-6 horas. Máximo 4000mg al día.',
    sideEffects: ['Raros en dosis recomendadas', 'Daño hepático en sobredosis'],
    precautions: 'No exceder la dosis máxima diaria. Evitar consumo de alcohol.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200'
  }
];

interface MedicineLibraryScreenProps {
  onBack: () => void;
  onSelectMedicine: (medicine: MedicineProfile) => void;
  onNavigate: (tab: string) => void;
}

export const MedicineLibraryScreen: React.FC<MedicineLibraryScreenProps> = ({
  onBack,
  onSelectMedicine,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Sort alphabetical and Filter
  const filteredMedicines = MEDICINES_DB
    .filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const currentMedicines = filteredMedicines.slice(
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
            <h1 className="font-heading font-bold text-xl text-gray-900">Biblioteca</h1>
            <p className="text-xs text-gray-500">Guía de medicamentos</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar medicamento (ej. Ibuprofeno)..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {currentMedicines.length > 0 ? (
          <>
            {currentMedicines.map((med) => (
              <button
                key={med.id}
                onClick={() => onSelectMedicine(med)}
                className="w-full bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group text-left"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Pill size={24} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-500">{med.category}</p>
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
            <Pill size={48} className="mx-auto mb-4 opacity-20" />
            <p>No se encontraron medicamentos.</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};