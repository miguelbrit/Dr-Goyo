import React from 'react';
import { ChevronLeft, Calendar, User, Share2, Tag, ArrowRight, Bookmark } from 'lucide-react';
import { Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';

interface ArticleDetailScreenProps {
  article: Article;
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ 
  article, 
  onBack,
  onNavigate
}) => {

  // Simulate rich content if not provided in the mock data
  const renderContent = () => {
    if (article.content) return <p>{article.content}</p>;

    // Dummy content generator for demo purposes based on context
    return (
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2">
          {article.subtitle || "La salud es un tema primordial en nuestra vida diaria. Este artículo explora los aspectos fundamentales para mantener un bienestar integral."}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <h3 className="text-xl font-heading font-bold text-gray-900 mt-6 mb-2">Puntos Clave a Considerar</h3>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li><strong>Prevención:</strong> La mejor medicina es siempre la preventiva.</li>
          <li><strong>Consulta Regular:</strong> No esperes a sentir dolor para visitar al especialista.</li>
          <li><strong>Hábitos:</strong> Pequeños cambios diarios generan grandes resultados a largo plazo.</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-secondary p-4 rounded-r-xl my-6">
          <p className="text-blue-800 italic font-medium">
            "La inversión en salud paga los mejores intereses a lo largo de la vida."
          </p>
        </div>

        <h3 className="text-xl font-heading font-bold text-gray-900 mt-6 mb-2">Recomendaciones Finales</h3>
        <p>
          Si experimentas síntomas persistentes, te recomendamos agendar una cita a través de nuestra plataforma con un especialista en <strong>{article.specialty}</strong>. Recuerda que este artículo es informativo y no sustituye el consejo médico profesional.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Image Section */}
      <div className="relative h-80 w-full">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Navigation Header */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider shadow-sm">
            {article.category}
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-2 shadow-sm">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-xs md:text-sm text-gray-200 font-medium">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{article.publishDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Main Article Body */}
        <article className="prose prose-blue max-w-none">
          {renderContent()}
        </article>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Tag size={16} className="text-primary" />
            Temas Relacionados
          </h4>
          <div className="flex flex-wrap gap-2">
            {[article.category, article.specialty, 'Salud', 'Bienestar'].map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action - Context Aware */}
        <div className="mt-10 bg-gradient-to-br from-secondary to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <h3 className="font-heading font-bold text-lg mb-2 relative z-10">¿Necesitas atención personalizada?</h3>
          <p className="text-blue-100 text-sm mb-6 relative z-10">
            Agenda una cita con nuestros especialistas en {article.specialty} hoy mismo.
          </p>
          
          <div className="relative z-10">
             <Button 
               label="Buscar Especialista" 
               variant="primary" 
               fullWidth 
               icon={ArrowRight}
               className="bg-white text-secondary hover:bg-blue-50"
               onClick={() => onBack()} // In a real app, this would filter doctors by specialty
             />
          </div>
        </div>
      </div>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};