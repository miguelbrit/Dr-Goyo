import React from 'react';
import { MapPin, Star, FlaskConical, ChevronRight, Clock } from 'lucide-react';
import { Laboratory } from '../types';

interface LaboratoryCardProps {
  lab: Laboratory;
  onClick?: () => void;
  highlightService?: string;
}

export const LaboratoryCard: React.FC<LaboratoryCardProps> = ({ lab, onClick, highlightService }) => {
  // Check if a specific service matched the search query
  const matchedService = highlightService 
    ? lab.services.find(s => s.name.toLowerCase().includes(highlightService.toLowerCase()))
    : null;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-md ${onClick ? 'cursor-pointer group' : ''}`}
    >
      {/* Image Section - Full Width Top */}
      <div className="relative h-32">
        <img 
          src={lab.image} 
          alt={lab.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3">
           <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-800">{lab.rating}</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
            <h3 className="font-heading font-semibold text-lg text-gray-900 leading-tight">{lab.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
              <MapPin size={12} />
              <span>{lab.location} • {lab.distance}</span>
            </div>
            {lab.hours && (
              <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px]">
                <Clock size={10} />
                <span>{lab.hours}</span>
              </div>
            )}
        </div>

        {/* Matched Service or Action */}
        <div className="mt-3 pt-3 border-t border-gray-50">
           {matchedService ? (
             <div className="bg-orange-50 text-orange-800 border border-orange-100 text-xs px-3 py-2 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FlaskConical size={14} className="flex-shrink-0" />
                  <span className="font-medium truncate">{matchedService.name}</span>
                </div>
                <span className="font-bold whitespace-nowrap ml-2">${matchedService.price}</span>
             </div>
           ) : (
             <div className="flex justify-between items-center">
               <span className="text-xs text-gray-400 font-medium">Ver servicios disponibles</span>
               <div className="flex items-center text-sm text-primary font-bold group-hover:translate-x-1 transition-transform">
                  Ver detalles <ChevronRight size={16} />
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};