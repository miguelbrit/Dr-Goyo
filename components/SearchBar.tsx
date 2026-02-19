import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Buscar médicos, farmacias, medicamentos...", 
  onSearch 
}) => {
  return (
    <div className="relative w-full shadow-soft rounded-xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-xl text-gray-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  );
};