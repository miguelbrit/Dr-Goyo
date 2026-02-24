import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, FileText, Calendar, DollarSign, 
  MapPin, Loader2, Check, AlertCircle, ShieldCheck
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { AvatarUploader } from './AvatarUploader';
import { ScheduleConfig } from './ScheduleConfig';

interface DoctorProfileDetailsProps {
  userProfile?: any;
  onUpdate?: () => void;
}

export const DoctorProfileDetails: React.FC<DoctorProfileDetailsProps> = ({ userProfile, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    imageUrl: '',
    specialty: '',
    license: '',
    experienceYears: '',
    consultationPrice: '',
    insuranceAffiliations: '',
    bio: '',
    city: '',
    address: '',
    identityDocUrl: '',
    professionalTitleUrl: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        surname: userProfile.surname || '',
        imageUrl: userProfile.imageUrl || '',
        specialty: userProfile.doctor?.specialty || '',
        license: userProfile.doctor?.license || '',
        experienceYears: userProfile.doctor?.experienceYears?.toString() || '',
        consultationPrice: userProfile.doctor?.consultationPrice?.toString() || '',
        insuranceAffiliations: userProfile.doctor?.insuranceAffiliations || '',
        bio: userProfile.doctor?.bio || '',
        city: userProfile.doctor?.city || userProfile.city || '',
        address: userProfile.doctor?.address || userProfile.address || '',
        identityDocUrl: userProfile.doctor?.identityDocUrl || '',
        professionalTitleUrl: userProfile.doctor?.professionalTitleUrl || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    if (onUpdate) onUpdate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          experienceYears: parseInt(formData.experienceYears) || 0,
          consultationPrice: parseFloat(formData.consultationPrice) || 0,
        })
      });
      
      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil médico actualizado correctamente' });
        if (onUpdate) onUpdate();
      } else {
        throw new Error(result.error || 'Error al guardar cambios');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Avatar Section */}
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col items-center">
        <AvatarUploader 
          currentImageUrl={formData.imageUrl}
          onUploadSuccess={handleUploadSuccess}
          userId={userProfile?.id}
          userName={formData.name}
        />
        <div className="mt-4 text-center">
            <h3 className="font-heading font-bold text-gray-900">{formData.name} {formData.surname}</h3>
            <p className="text-primary text-sm font-medium">{formData.specialty || 'Médico Especialista'}</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identidad */}
        <section className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Identidad Básica
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
                 icon={<User size={18} />}
               />
            </div>
        </section>

        {/* Profesional */}
        <section className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={14} /> Información Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Especialidad" 
                 name="specialty"
                 value={formData.specialty} 
                 onChange={handleChange}
                 icon={<Briefcase size={18} />} 
               />
               <Input 
                 label="Cédula Profesional" 
                 name="license"
                 value={formData.license} 
                 onChange={handleChange}
                 icon={<FileText size={18} />}
               />
               <Input 
                 label="Años de Experiencia" 
                 name="experienceYears"
                 type="number"
                 value={formData.experienceYears} 
                 onChange={handleChange}
                 icon={<Calendar size={18} />}
               />
               <Input 
                 label="Precio Consulta ($)" 
                 name="consultationPrice"
                 type="number"
                 value={formData.consultationPrice} 
                 onChange={handleChange}
                 icon={<DollarSign size={18} />}
               />
            </div>
            <Input 
                label="Seguros Afiliados" 
                name="insuranceAffiliations"
                value={formData.insuranceAffiliations} 
                onChange={handleChange}
                placeholder="Ej. Mapfre, Mercantil, Banesco..."
                icon={<ShieldCheck size={18} />}
            />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Biografía Profesional</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-none bg-gray-50 text-gray-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
                placeholder="Describe tu trayectoria, formación y enfoque médico..."
              />
            </div>
        </section>

        {/* Ubicación */}
        <section className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} /> Ubicación de Consulta
            </h3>
            <Input 
                label="Ciudad / Zona" 
                name="city"
                value={formData.city} 
                onChange={handleChange}
                icon={<MapPin size={18} />} 
            />
            <Input 
                label="Dirección del Consultorio" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="Edificio, Piso, Consultorio..."
            />
        </section>

        {/* Documentación */}
        <section className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Documentación de Verificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="URL Documento Identidad" 
                 name="identityDocUrl"
                 value={formData.identityDocUrl} 
                 onChange={handleChange}
                 placeholder="https://..."
                 icon={<FileText size={18} />} 
               />
               <Input 
                 label="URL Título Profesional" 
                 name="professionalTitleUrl"
                 value={formData.professionalTitleUrl} 
                 onChange={handleChange}
                 placeholder="https://..."
                 icon={<ShieldCheck size={18} />}
               />
            </div>
            <p className="text-[10px] text-gray-400 px-1">
               Estos documentos son necesarios para verificar tu cuenta y otorgarte el sello de verificación.
            </p>
        </section>

        {/* Disponibilidad (Agenda) */}
        <ScheduleConfig 
          doctorId={userProfile?.doctor?.id} 
          initialAvailability={userProfile?.doctor?.availability} 
          initialSlotDuration={userProfile?.doctor?.slotDuration}
          onSave={onUpdate}
        />

        <div className="pt-2">
          <Button 
            label={loading ? "Guardando cambios..." : "Actualizar Perfil Profesional"} 
            fullWidth 
            variant="primary" 
            type="submit"
            disabled={loading}
            icon={loading ? Loader2 : undefined}
          />
        </div>
      </form>
    </div>
  );
};
