import React from 'react';
import { ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { Article } from '../types';

// Extended Mock Data for Suggestions
const SUGGESTED_ARTICLES_DB: Article[] = [
  // Doctor Context
  {
    id: 'a1',
    title: '5 Señales para visitar al Cardiólogo',
    subtitle: 'No ignores estos síntomas tempranos de problemas del corazón.',
    category: 'Cardiología',
    specialty: 'Cardiólogo',
    author: 'Dr. Goyo',
    status: 'published',
    publishDate: '2024-05-01',
    views: 120,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'a2',
    title: 'La importancia del chequeo anual',
    subtitle: 'Prevenir es mejor que curar. Descubre qué exámenes necesitas.',
    category: 'Medicina General',
    specialty: 'General',
    author: 'Dra. Silva',
    status: 'published',
    publishDate: '2024-05-10',
    views: 85,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'a3',
    title: 'Migrañas: Causas y Tratamientos',
    subtitle: 'Entendiendo el dolor de cabeza crónico y cómo manejarlo.',
    category: 'Neurología',
    specialty: 'Neurólogo',
    author: 'Dr. House',
    status: 'published',
    publishDate: '2024-04-20',
    views: 200,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=300'
  },
  // Pharmacy Context
  {
    id: 'p1',
    title: 'Genéricos vs De Marca',
    subtitle: '¿Realmente existe una diferencia en la efectividad?',
    category: 'Farmacia',
    specialty: 'Farmacéutico',
    author: 'Farmacia Central',
    status: 'published',
    publishDate: '2024-05-15',
    views: 300,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'p2',
    title: 'Botiquín de Primeros Auxilios',
    subtitle: 'Los 10 elementos esenciales que no pueden faltar en tu casa.',
    category: 'Seguridad',
    specialty: 'Farmacéutico',
    author: 'Dr. Goyo',
    status: 'published',
    publishDate: '2024-05-12',
    views: 150,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'p3',
    title: 'Vitaminas para el invierno',
    subtitle: 'Refuerza tus defensas naturalmente.',
    category: 'Bienestar',
    specialty: 'Nutricionista',
    author: 'Dra. Ana',
    status: 'published',
    publishDate: '2024-05-05',
    views: 90,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd0?auto=format&fit=crop&q=80&w=300'
  },
  // Lab Context
  {
    id: 'l1',
    title: 'Guía para el ayuno',
    subtitle: 'Cuántas horas necesitas de ayuno para cada tipo de examen.',
    category: 'Laboratorio',
    specialty: 'Bioanalista',
    author: 'LabCare',
    status: 'published',
    publishDate: '2024-05-18',
    views: 400,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'l2',
    title: 'Entendiendo tu Hematología',
    subtitle: 'Aprende a leer los valores básicos de tu examen de sangre.',
    category: 'Laboratorio',
    specialty: 'Hematólogo',
    author: 'Dr. Goyo',
    status: 'published',
    publishDate: '2024-05-02',
    views: 320,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'l3',
    title: 'Pruebas de Orina: Tips',
    subtitle: 'Cómo recolectar la muestra correctamente para evitar errores.',
    category: 'Laboratorio',
    specialty: 'Bioanalista',
    author: 'VidaLab',
    status: 'published',
    publishDate: '2024-04-25',
    views: 110,
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=300'
  }
];

interface SuggestedArticlesProps {
  section: 'doctors' | 'pharmacy' | 'labs';
  onArticleClick?: (article: Article) => void;
}

export const SuggestedArticles: React.FC<SuggestedArticlesProps> = ({ section, onArticleClick }) => {
  
  // Logic to filter articles based on section
  const getRelevantArticles = () => {
    switch (section) {
      case 'doctors':
        return SUGGESTED_ARTICLES_DB.filter(art => 
          ['Cardiología', 'Medicina General', 'Neurología', 'Pediatría', 'Ginecología'].includes(art.category)
        );
      case 'pharmacy':
        return SUGGESTED_ARTICLES_DB.filter(art => 
          ['Farmacia', 'Seguridad', 'Bienestar', 'Medicamentos'].includes(art.category)
        );
      case 'labs':
        return SUGGESTED_ARTICLES_DB.filter(art => 
          ['Laboratorio', 'Análisis'].includes(art.category) || art.specialty === 'Hematólogo'
        );
      default:
        return [];
    }
  };

  const articles = getRelevantArticles();

  if (articles.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center mx-4 mb-20">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
           <BookOpen size={24} />
        </div>
        <p className="text-gray-500 font-medium text-sm">No hay artículos sugeridos por ahora. ¡Vuelve más tarde!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-6 pl-4 border-t border-gray-100 pt-6">
      <div className="flex items-center gap-2 mb-4 pr-4">
        <BookOpen size={18} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-gray-900">
          {section === 'doctors' ? 'Lecturas Médicas' : 
           section === 'pharmacy' ? 'Consejos Farmacéuticos' : 
           'Información de Laboratorio'}
        </h3>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-4 pr-4 snap-x hide-scrollbar">
        {articles.map((article) => (
          <div 
            key={article.id}
            onClick={() => onArticleClick && onArticleClick(article)}
            className="min-w-[260px] max-w-[260px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all snap-center flex flex-col overflow-hidden group cursor-pointer"
          >
            {/* Image */}
            <div className="h-32 w-full overflow-hidden relative">
               <img 
                 src={article.image} 
                 alt={article.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               />
               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-primary uppercase">
                  {article.category}
               </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
               <h4 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                 {article.title}
               </h4>
               <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                 {article.subtitle}
               </p>
               
               <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400 font-medium">Por {article.author}</span>
                  <button className="text-xs font-bold text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver más <ChevronRight size={12} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};