import React from 'react';
import { MapPin, Clock, BadgeCheck, User } from 'lucide-react';
import { Button } from './Button';
import { Rating } from './Rating';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook?: () => void;
  onClick?: () => void;
  compact?: boolean; // For chat views
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onClick, compact = false }) => {
  // Get Initials for Placeholder
  const initials = doctor.name
    .split(' ')
    .filter(n => !n.toLowerCase().includes('.') && n.length > 0)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div 
      onClick={onClick}
      className={`bg-card p-4 rounded-2xl shadow-soft border border-border-main flex flex-col gap-3 transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex gap-4 relative">
        {doctor.isFeatured && (
          <div className="absolute -top-2 -left-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1">
            <BadgeCheck size={10} /> DESTACADO
          </div>
        )}
        
        {doctor.image ? (
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-20 h-20 rounded-xl object-cover bg-gray-bg flex-shrink-0 border border-border-main"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center flex-shrink-0 border border-border-main text-gray-400 relative overflow-hidden group">
             <User size={32} className="opacity-40 group-hover:scale-110 transition-transform" />
             <span className="absolute bottom-1 right-1 text-[8px] font-bold opacity-30">{initials}</span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate pr-2">
              <h3 className="font-heading font-semibold text-text-main truncate">{doctor.name}</h3>
              <p className="text-sm text-primary font-medium truncate">{doctor.specialty}</p>
            </div>
            <div className="flex-shrink-0">
               <Rating value={doctor.rating} />
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-light">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-light" />
              <span>{doctor.location} ({doctor.distance})</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
             <span className="font-bold text-text-main text-sm">
               ${doctor.price} <span className="text-gray-light font-normal text-xs">/consulta</span>
             </span>
             {doctor.nextAvailable && !compact && (
                <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md text-xs">
                  <Clock size={12} />
                  <span>{doctor.nextAvailable}</span>
                </div>
              )}
          </div>
        </div>
      </div>
      
      {!compact && (
        <div className="flex gap-3 mt-1 pt-3 border-t border-border-main">
          <Button 
            label="Ver Perfil" 
            variant="ghost" 
            className="flex-1 py-2 text-sm h-10"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
          />
          <Button 
            label="Agendar" 
            variant="primary" 
            className="flex-1 py-2 text-sm h-10"
            onClick={(e) => {
              e.stopPropagation();
              onBook && onBook();
            }}
          />
        </div>
      )}
    </div>
  );
};