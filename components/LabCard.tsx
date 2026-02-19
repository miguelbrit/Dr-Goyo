import React from 'react';
import { FlaskConical, Clock, ChevronRight } from 'lucide-react';
import { LabTest } from '../types';

interface LabCardProps {
  test: LabTest;
  onClick?: () => void;
}

export const LabCard: React.FC<LabCardProps> = ({ test, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 cursor-pointer hover:border-primary/30 transition-all group"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-accent/50 rounded-full flex items-center justify-center text-primary">
            <FlaskConical size={24} />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gray-900">{test.name}</h4>
            <p className="text-sm text-gray-500">{test.labName}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block font-bold text-lg text-primary">${test.price.toFixed(2)}</span>
          {test.requirements.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md inline-block mt-1">
              {test.requirements[0]}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={14} />
          <span>Resultados en {test.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-1 text-secondary font-medium group-hover:translate-x-1 transition-transform">
          Agendar
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};