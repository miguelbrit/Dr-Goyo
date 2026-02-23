import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { 
  Mail, Lock, User, Phone, Briefcase, FileText, 
  MapPin, Building, Facebook, Apple, Calendar, 
  Scale, Ruler, DollarSign, Clock, Truck 
} from 'lucide-react';
import { SocialAuthButtons } from '../components/SocialAuthButtons';

type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'lab' | 'admin';

interface RegisterScreenProps {
  role: UserRole;
  onBack: () => void;
  onSubmit: (role: UserRole, userName: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ role, onBack, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- Form State ---
  // Step 1: Universal
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Role-Specific
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const [specialty, setSpecialty] = useState('');
  const [license, setLicense] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [consultationPrice, setConsultationPrice] = useState('');
  const [insuranceAffiliations, setInsuranceAffiliations] = useState('');

  const [testTypes, setTestTypes] = useState('');

  // Step 3: Localization & Visibility
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [hasDelivery, setHasDelivery] = useState(false);

  const getRoleConfig = () => {
    switch (role) {
      case 'doctor': return { title: 'Registro Médico', subtitle: 'Únete a nuestra red de especialistas.' };
      case 'pharmacy': return { title: 'Registro Farmacia', subtitle: 'Registra tu sucursal para vender productos.' };
      case 'lab': return { title: 'Registro Laboratorio', subtitle: 'Ofrece tus servicios de análisis clínicos.' };
      default: return { title: 'Crear Cuenta', subtitle: 'Empieza a cuidar tu salud hoy mismo.' };
    }
  };

  const config = getRoleConfig();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    const roleMapping: Record<string, string> = {
      'patient': 'Paciente',
      'doctor': 'Medico',
      'pharmacy': 'Farmacia',
      'lab': 'Laboratorio'
    };

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || (role === 'pharmacy' || role === 'lab' ? 'Negocio' : 'Usuario'),
          surname: surname || '',
          email,
          password,
          type: roleMapping[role] || 'Paciente',
          phone,
          // Patient
          birthDate: role === 'patient' ? birthDate : undefined,
          gender: role === 'patient' ? gender : undefined,
          weight: role === 'patient' ? weight : undefined,
          height: role === 'patient' ? height : undefined,
          // Doctor
          specialty: role === 'doctor' ? specialty : undefined,
          license: role === 'doctor' ? license : undefined,
          experienceYears: role === 'doctor' ? experienceYears : undefined,
          consultationPrice: role === 'doctor' ? consultationPrice : undefined,
          insuranceAffiliations: role === 'doctor' ? insuranceAffiliations : undefined,
          // All Profile
          city,
          address,
          // Business
          openingHours: (role === 'pharmacy' || role === 'lab') ? openingHours : undefined,
          closingHours: (role === 'pharmacy' || role === 'lab') ? closingHours : undefined,
          hasDelivery: role === 'pharmacy' ? hasDelivery : undefined,
          testTypes: role === 'lab' ? testTypes : undefined,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parseando registro JSON:', text);
        throw new Error('Error de servidor (Respuesta no válida)');
      }

      if (!response.ok || !data.success) throw new Error(data.error || 'Error al registrar usuario');

      localStorage.setItem('token', data.token);
      setLoading(false);
      onSubmit(data.user.role || role, name || data.user.name || 'Usuario');
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleRegister();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };


  return (
    <AuthLayout 
      title={`${config.title} - Paso ${step}`}
      subtitle={step === 1 ? config.subtitle : step === 2 ? "Datos de Perfil Específicos" : "Localización y Visibilidad"}
      onBack={prevStep}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-gray-100'}`}
          />
        ))}
      </div>

      <div className="space-y-4">
        
        {/* STEP 1: Basic Identity (Universal) */}
        {step === 1 && (
          <>
            <Input 
              label="Correo Electrónico" 
              type="email" 
              placeholder="correo@ejemplo.com" 
              icon={<Mail size={18} />} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Contraseña" 
                type="password" 
                placeholder="Mín. 8" 
                icon={<Lock size={18} />} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               <Input 
                label="Teléfono" 
                type="tel" 
                placeholder="Nro contacto" 
                icon={<Phone size={18} />} 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label={role === 'patient' || role === 'doctor' ? "Nombre" : "Nombre del Negocio"} 
                placeholder="Ej. Juan / Farmacia" 
                icon={role === 'patient' || role === 'doctor' ? <User size={18} /> : <Building size={18} />} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {(role === 'patient' || role === 'doctor') && (
                <Input 
                  label="Apellido" 
                  placeholder="Ej. Pérez" 
                  icon={<User size={18} />} 
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              )}
            </div>

            {/* Social Login only on Step 1 */}
            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400 font-medium">O continúa con</span>
              </div>
            </div>
            
            <SocialAuthButtons 
              onGooglePress={() => console.log('Google Register')}
              onApplePress={() => console.log('Apple Register')}
              onFacebookPress={() => console.log('Facebook Register')}
            />
          </>
        )}

        {/* STEP 2: Role-Specific Data */}
        {step === 2 && (
          <>
            {role === 'patient' && (
              <div className="space-y-4">
                <Input 
                  label="Fecha de Nacimiento" 
                  type="date" 
                  icon={<Calendar size={18} />} 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Peso (kg)" 
                    type="number" 
                    placeholder="Ej. 75" 
                    icon={<Scale size={18} />}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <Input 
                    label="Estatura (cm)" 
                    type="number" 
                    placeholder="Ej. 175" 
                    icon={<Ruler size={18} />}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-text mb-2">Género</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro/Prefiero no decir</option>
                  </select>
                </div>
              </div>
            )}

            {role === 'doctor' && (
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Especialidad" 
                  placeholder="Ej. Cardiología" 
                  icon={<Briefcase size={18} />} 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                <Input 
                  label="Cédula P." 
                  placeholder="Número" 
                  icon={<FileText size={18} />} 
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
                <Input 
                  label="Precio Consulta ($)" 
                  type="number" 
                  placeholder="Ej. 50" 
                  icon={<DollarSign size={18} />}
                  value={consultationPrice}
                  onChange={(e) => setConsultationPrice(e.target.value)}
                />
                <Input 
                  label="Años Experiencia" 
                  type="number" 
                  placeholder="Ej. 10" 
                  icon={<Calendar size={18} />}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
                <div className="col-span-2">
                   <Input 
                    label="Seguros Afiliados" 
                    placeholder="Ej. Mapfre, Mercantil..." 
                    icon={<FileText size={18} />}
                    value={insuranceAffiliations}
                    onChange={(e) => setInsuranceAffiliations(e.target.value)}
                  />
                </div>
              </div>
            )}

            {role === 'lab' && (
              <Input 
                label="Tipo de Exámenes" 
                placeholder="Ej. Sangre, Orina, Rayos X..." 
                icon={<FileText size={18} />}
                value={testTypes}
                onChange={(e) => setTestTypes(e.target.value)}
              />
            )}

            {(role === 'pharmacy' || role === 'lab') && (
              <p className="text-sm text-gray-500 text-center py-4">
                Estamos listos para capturar tu información de negocio en el siguiente paso.
              </p>
            )}
          </>
        )}

        {/* STEP 3: Localization & Visibility */}
        {step === 3 && (
          <>
            <Input 
              label="Ciudad / Zona" 
              placeholder="Ej. Caracas - Chacao" 
              icon={<MapPin size={18} />} 
              required 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            
              <>
                <Input 
                  label="Dirección Física" 
                  placeholder="Calle, Edificio, Nro..." 
                  icon={<MapPin size={18} />} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {(role === 'pharmacy' || role === 'lab') && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Abre (Hora)" 
                      type="time" 
                      icon={<Clock size={18} />}
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                    />
                    <Input 
                      label="Cierra (Hora)" 
                      type="time" 
                      icon={<Clock size={18} />}
                      value={closingHours}
                      onChange={(e) => setClosingHours(e.target.value)}
                    />
                  </div>
                )}
                {role === 'pharmacy' && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <button 
                      type="button"
                      onClick={() => setHasDelivery(!hasDelivery)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${hasDelivery ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasDelivery ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-sm font-bold text-blue-900 flex items-center gap-2">
                       <Truck size={16} /> Ofrece Delivery
                    </span>
                  </div>
                )}
              </>

            {role === 'patient' && (
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                    <MapPin size={32} />
                 </div>
                 <p className="text-sm text-gray-600">
                    Tu ubicación nos permite mostrarte los médicos y servicios más cercanos a tu hogar.
                 </p>
              </div>
            )}
          </>
        )}

        <div className="pt-6">
          <Button 
            label={loading ? "Procesando..." : step === 3 ? "Finalizar Registro" : "Continuar"} 
            variant="primary" 
            fullWidth 
            onClick={nextStep}
            disabled={loading}
          />
        </div>
      </div>
    </AuthLayout>
  );
};