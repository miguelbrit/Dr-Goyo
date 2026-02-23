import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, Ruler, Weight, MapPin, 
  Activity, Camera, Loader2, Check, AlertCircle, Globe, Droplet
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Avatar } from './Avatar';

interface ProfileDetailsProps {
  userProfile?: any;
  onUpdate?: () => void;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userProfile, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const user = userProfile || {};
  const patient = user.patient || {};
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    imageUrl: '',
    phone: '',
    birthDate: '',
    gender: '',
    weight: '',
    height: '',
    address: '',
    city: '',
    country: '',
    bloodType: '',
    allergies: '',
  });

  // Track if we have initialized state from props
  const initialized = useRef(false);

  // Sync state only when profile is first loaded
  useEffect(() => {
    if (userProfile && !initialized.current) {
       setFormData({
        name: userProfile.name || '',
        surname: userProfile.surname || '',
        email: userProfile.email || '',
        imageUrl: userProfile.imageUrl || '',
        phone: userProfile.patient?.phone || '',
        birthDate: userProfile.patient?.birthDate ? new Date(userProfile.patient.birthDate).toISOString().split('T')[0] : '',
        gender: userProfile.patient?.gender || '',
        weight: userProfile.patient?.weight || '',
        height: userProfile.patient?.height || '',
        address: userProfile.patient?.address || '',
        city: userProfile.patient?.city || '',
        country: userProfile.patient?.country || '',
        bloodType: userProfile.patient?.bloodType || '',
        allergies: userProfile.patient?.allergies || '',
      });
      initialized.current = true;
    }
  }, [userProfile]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Solo se permiten imágenes' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await fetch('/api/users/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parseando JSON:', text);
        throw new Error('El servidor no respondió correctamente. Revisa la consola.');
      }

      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        // Guardar automáticamente la URL de la imagen para que sea persistente
        await fetch('/api/users/update-profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ ...formData, imageUrl: data.imageUrl })
        });
        if (onUpdate) onUpdate();
        setMessage({ type: 'success', text: 'Foto actualizada correctamente' });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al subir imagen' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parseando JSON:', text);
        throw new Error('Error de servidor (Respuesta no es JSON)');
      }

      if (data.success) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        if (onUpdate) onUpdate();
      } else {
        throw new Error(data.error || 'Error al guardar cambios');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      // Ocultar mensaje de éxito tras 3 segundos
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Photo Section */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
           <Avatar src={formData.imageUrl} alt={formData.name} size="xl" />
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <Loader2 className="text-white animate-spin" /> : <Camera className="text-white" />}
           </div>
           <button 
            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg"
            type="button"
           >
             <Camera size={14} />
           </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
        />
        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Toca para cambiar foto</p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top-1 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                <User size={16} /> Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Nombre" 
                 name="name"
                 value={formData.name} 
                 onChange={handleChange}
                 icon={<User size={18} />} 
                 required
               />
               <Input 
                 label="Apellido" 
                 name="surname"
                 value={formData.surname} 
                 onChange={handleChange}
                 placeholder="Pérez"
                 icon={<User size={18} />}
               />
            </div>
            
            <Input 
                label="Correo Electrónico (Principal)" 
                value={formData.email} 
                readOnly
                className="bg-blue-50/30 text-gray-500 font-medium cursor-not-allowed border-blue-50"
                icon={<Mail size={18} className="text-primary" />} 
            />

            <div className="space-y-4">
                <Input 
                    label="Fecha de Nacimiento" 
                    name="birthDate"
                    type="date" 
                    value={formData.birthDate} 
                    onChange={handleChange}
                    icon={<Calendar size={18} />} 
                />
                <Input 
                    label="Edad (Calculada)" 
                    value={formData.birthDate ? `${Math.abs(new Date(Date.now() - new Date(formData.birthDate).getTime()).getUTCFullYear() - 1970)} años` : '--'} 
                    readOnly
                    className="bg-gray-50 text-gray-400"
                    icon={<Activity size={18} />} 
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">Género</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-text focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro/Prefiero no decir</option>
                  </select>
                </div>
            </div>

            <Input 
                label="Teléfono de Contacto" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                placeholder="+58 412 0000000"
                icon={<Phone size={18} />} 
            />
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                <Activity size={16} /> Datos Clínicos
            </h3>
            <div className="space-y-4">
              <Input 
                label="Altura (cm)" 
                name="height"
                type="number"
                value={formData.height} 
                onChange={handleChange}
                icon={<Ruler size={18} />} 
              />
              <Input 
                label="Peso (kg)" 
                name="weight"
                type="number"
                value={formData.weight} 
                onChange={handleChange}
                icon={<Weight size={18} />} 
              />
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">Grupo Sanguíneo</label>
                  <select 
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-text focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  >
                    <option value="">--</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
              </div>
            </div>
            <Input 
                label="Alergias / Condiciones" 
                name="allergies"
                value={formData.allergies} 
                onChange={handleChange}
                placeholder="Ej. Penicilina, Asma..."
                icon={<Droplet size={18} />} 
            />
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                <MapPin size={16} /> Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Ciudad" 
                    name="city"
                    value={formData.city} 
                    onChange={handleChange}
                    icon={<MapPin size={18} />} 
                />
                <Input 
                    label="País" 
                    name="country"
                    value={formData.country} 
                    onChange={handleChange}
                    icon={<Globe size={18} />} 
                />
            </div>
            <Input 
                label="Dirección Detallada" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="Calle, Edificio..."
            />
        </div>

        <div className="pt-4 sticky bottom-0 bg-neutral py-4 border-t border-gray-100 flex gap-3">
          <Button 
            label={loading ? "Guardando..." : "Guardar Cambios"} 
            fullWidth 
            variant="primary" 
            type="submit"
            disabled={loading || uploading}
            icon={loading ? Loader2 : undefined}
          />
        </div>
      </form>
    </div>
  );
};