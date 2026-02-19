import React from 'react';
import { User, Phone, Mail, Calendar, Ruler, Weight } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

export const ProfileDetails: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" defaultValue="Alejandro" icon={<User size={18} />} />
          <Input label="Apellido" defaultValue="Goyo" />
        </div>
        
        <Input label="Correo" defaultValue="alejandro@example.com" icon={<Mail size={18} />} />
        <Input label="Teléfono" defaultValue="+58 412 123 4567" icon={<Phone size={18} />} />
        
        <div className="grid grid-cols-3 gap-3">
          <Input label="Edad" defaultValue="32" icon={<Calendar size={18} />} />
          <Input label="Altura" defaultValue="1.75m" icon={<Ruler size={18} />} />
          <Input label="Peso" defaultValue="78kg" icon={<Weight size={18} />} />
        </div>

        <div className="pt-4">
          <Button label="Guardar Cambios" fullWidth variant="primary" />
        </div>
      </form>
    </div>
  );
};