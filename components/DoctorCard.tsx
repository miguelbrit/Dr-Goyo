import React from 'react';
import { MapPin, Clock, BadgeCheck } from 'lucide-react';
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
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-2xl shadow-soft border border-gray-100 flex flex-col gap-3 transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex gap-4 relative">
        {doctor.isFeatured && (
          <div className="absolute -top-2 -left-2 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1">
            <BadgeCheck size={10} /> DESTACADO
          </div>
        )}
        
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate pr-2">
              <h3 className="font-heading font-semibold text-gray-900 truncate">{doctor.name}</h3>
              <p className="text-sm text-primary font-medium truncate">{doctor.specialty}</p>
            </div>
            <div className="flex-shrink-0">
               <Rating value={doctor.rating} />
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              <span>{doctor.location} ({doctor.distance})</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
             <span className="font-bold text-gray-900 text-sm">
               ${doctor.price} <span className="text-gray-400 font-normal text-xs">/consulta</span>
             </span>
             {doctor.nextAvailable && !compact && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs">
                  <Clock size={12} />
                  <span>{doctor.nextAvailable}</span>
                </div>
              )}
          </div>
        </div>
      </div>
      
      {!compact && (
        <div className="flex gap-3 mt-1 pt-3 border-t border-gray-50">
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