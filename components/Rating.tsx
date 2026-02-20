import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({ value, count, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      <Star 
        size={size} 
        className={`${value >= 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
      <span className="text-sm font-semibold text-text-main ml-0.5">{value}</span>
      {count && (
        <span className="text-xs text-gray-light ml-1">({count} reseñas)</span>
      )}
    </div>
  );
};