import React from 'react';
import { Pill, Activity, ClipboardCheck, LucideIcon } from 'lucide-react';

interface InterestItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  glowColor: string;
  action: () => void;
}

interface InterestCarouselProps {
  onNavigateToMedicines: () => void;
  onNavigateToPathologies: () => void;
  onNavigateToPreOp: () => void;
}

export const InterestCarousel: React.FC<InterestCarouselProps> = ({
  onNavigateToMedicines,
  onNavigateToPathologies,
  onNavigateToPreOp
}) => {
  const items: InterestItem[] = [
    {
      id: 'medicines',
      icon: Pill,
      label: 'Medicinas',
      color: 'from-cyan-400/40 to-blue-500/40',
      glowColor: 'rgba(34, 211, 238, 0.3)',
      action: onNavigateToMedicines
    },
    {
      id: 'pathologies',
      icon: Activity,
      label: 'Patologías',
      color: 'from-teal-400/40 to-emerald-500/40',
      glowColor: 'rgba(45, 212, 191, 0.3)',
      action: onNavigateToPathologies
    },
    {
      id: 'preop',
      icon: ClipboardCheck,
      label: 'Listas',
      color: 'from-blue-400/40 to-indigo-500/40',
      glowColor: 'rgba(96, 165, 250, 0.3)',
      action: onNavigateToPreOp
    }
  ];

  return (
    <div className="w-full px-4 py-4">
      <div className="flex justify-between items-start gap-2 max-w-md mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="group relative flex flex-col items-center gap-3 outline-none transition-transform active:scale-95"
          >
            {/* Esfera de Cristal Líquido */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              
              {/* Sombra de Glow exterior */}
              <div 
                className="absolute inset-2 rounded-full opacity-40 blur-xl transition-all duration-500 group-hover:opacity-70 group-hover:scale-110"
                style={{ backgroundColor: item.glowColor }}
              />

              {/* Botón Circular Glass */}
              <div className="absolute inset-0 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-3xl border-[1.5px] border-white/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.4)] overflow-hidden transition-all duration-500 group-hover:border-white/70 group-hover:shadow-[inset_0_0_25px_rgba(255,255,255,0.6)]">
                
                {/* Reflejo Iridiscente Curvo */}
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-gradient-to-br from-white/40 via-cyan-300/10 to-transparent blur-lg transition-transform duration-1000 group-hover:translate-x-4 group-hover:translate-y-4" />
                
                {/* Brillo superior hemisférico (Lente) */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-60" />
                
                {/* Sombra de refracción inferior curva */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-50" />
                
                {/* Núcleo de Color Interno (Esfera interna) */}
                <div className={`absolute inset-3 rounded-full bg-gradient-to-br ${item.color} blur-md opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500`} />
                
                {/* Highlight de borde de cristal (Rim) */}
                <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-white/60 pointer-events-none" />
              </div>

              {/* Contenedor del Icono con relieve */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Sombra proyectada por el icono */}
                  <item.icon 
                    className="text-black/30 dark:text-black/50 absolute translate-y-1 translate-x-1 blur-[3px]" 
                    size={32} 
                    strokeWidth={2.5} 
                  />
                  {/* Icono Principal */}
                  <item.icon 
                    className="text-cyan-900/70 dark:text-white relative transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" 
                    size={32} 
                    strokeWidth={2} 
                  />
                  
                  {/* Destello Star - Animado */}
                  <div className="absolute -top-3 -right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100">
                    <div className="absolute inset-0 bg-white blur-[1.5px] rounded-full" />
                    <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-white" />
                    <div className="absolute top-0 left-1/2 w-[0.5px] h-full bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Etiqueta Inferior Cristalina */}
            <div className="relative px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm transition-all duration-500 group-hover:bg-white/20 group-hover:translate-y-[-2px]">
              <span className="text-[11px] font-bold text-cyan-900/90 dark:text-white uppercase tracking-tight">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
