import React from 'react';
import { MapPin, ShoppingCart, CheckCircle, XCircle, Star } from 'lucide-react';
import { Pharmacy } from '../types';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onClick?: () => void;
  highlightMedicine?: string;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onClick, highlightMedicine }) => {
  // If a medicine is being searched, try to find it in inventory to display its price
  const searchedItem = highlightMedicine 
    ? pharmacy.inventory?.find(m => m.name.toLowerCase().includes(highlightMedicine.toLowerCase()))
    : pharmacy.featuredProduct;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-32">
        <img 
          src={pharmacy.image} 
          alt={pharmacy.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          {pharmacy.isOpen ? (
            <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle size={12} /> ABIERTO
            </span>
          ) : (
            <span className="bg-gray-100/90 backdrop-blur-sm text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <XCircle size={12} /> CERRADO
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
           <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-800">{pharmacy.rating}</span>
           </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-900 leading-tight">{pharmacy.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
              <MapPin size={12} />
              <span>{pharmacy.location} • {pharmacy.distance}</span>
            </div>
          </div>
        </div>

        {searchedItem && (
          <div className="mt-3 bg-accent/30 p-3 rounded-xl flex justify-between items-center border border-accent">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-md text-primary">
                <ShoppingCart size={14} />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                {searchedItem.name}
              </span>
            </div>
            <span className="text-secondary font-bold text-sm">
              ${searchedItem.price.toFixed(2)}
            </span>
          </div>
        )}

        {!searchedItem && (
          <div className="mt-3 text-xs text-gray-400 italic">
            Ver catálogo completo...
          </div>
        )}
      </div>
    </div>
  );
};