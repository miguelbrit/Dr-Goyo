import React, { useState } from 'react';
import { 
  ChevronLeft, MessageCircle, MapPin, Award, Users, Star, 
  CheckCircle2, Loader2, AlertCircle 
} from 'lucide-react';
import { Doctor } from '../types';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';
import { BookingModule } from '../components/BookingModule';

interface DoctorProfileScreenProps {
  doctor: Doctor;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ 
  doctor, 
  onBack, 
  onChat,
  onNavigate 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setError(null);
  };

  const handleBooking = async () => {
    if (!selectedTime) return;

    setLoading(true);
    setError(null);

    const appointmentDate = new Date(selectedDate);
    const [h, m] = selectedTime.split(':').map(Number);
    appointmentDate.setHours(h, m, 0, 0);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          date: appointmentDate.toISOString(),
          price: doctor.consultationPrice || doctor.price,
          type: 'Consulta Médica'
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        // Refresh or Navigate after success if needed
      } else {
        setError(result.error || "Error al agendar la cita");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">¡Cita Confirmada!</h2>
        <p className="text-gray-500 mb-10 max-w-xs mx-auto">
          Tu cita con el {doctor.name} ha sido registrada. Puedes ver los detalles en tu perfil.
        </p>
        <Button label="Volver al Inicio" variant="primary" fullWidth onClick={onBack} className="max-w-xs" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg pb-48 transition-colors duration-300">
      {/* Header Image Area */}
      <div className="relative h-56 bg-secondary">
         <img 
            src="https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=1000" 
            alt="Medical Office" 
            className="w-full h-full object-cover opacity-40"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-bg"></div>
         
         <button 
            onClick={onBack}
            className="absolute top-6 left-6 bg-white/90 p-2.5 rounded-full shadow-md text-gray-900 z-10 hover:bg-white transition-all transform hover:scale-110 active:scale-95"
         >
            <ChevronLeft size={24} />
         </button>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-6 -mt-20 relative z-10 max-w-xl mx-auto">
         <div className="flex justify-between items-end">
            <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-white ring-8 ring-primary/5">
               <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
            <div className="mb-4">
               <span className="bg-primary text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                  {doctor.specialty}
               </span>
            </div>
         </div>
         
         <div className="mt-6">
            <h1 className="font-heading text-3xl font-bold text-gray-900 tracking-tight">{doctor.name}</h1>
            <div className="flex items-center gap-2 mt-2">
               <MapPin size={18} className="text-primary" />
               <span className="text-gray-500 font-medium text-sm">{doctor.location} • {doctor.distance}</span>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-4 rounded-3xl text-center shadow-soft border border-white/50">
               <Users size={20} className="mx-auto text-blue-500 mb-2" />
               <span className="block font-bold text-gray-900">{doctor.patients}+</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pacientes</span>
            </div>
            <div className="bg-white p-4 rounded-3xl text-center shadow-soft border border-white/50">
               <Star size={20} className="mx-auto text-yellow-500 mb-2" />
               <span className="block font-bold text-gray-900">{doctor.rating}</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</span>
            </div>
            <div className="bg-white p-4 rounded-3xl text-center shadow-soft border border-white/50">
               <Award size={20} className="mx-auto text-purple-500 mb-2" />
               <span className="block font-bold text-gray-900">{doctor.experience} Años</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exp.</span>
            </div>
         </div>

         {/* Bio Section */}
         <div className="mt-10">
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-3 flex items-center gap-2">
               Sobre el médico
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
               {doctor.about}
            </p>
         </div>

         {/* NEW MODULE: Booking System */}
         <BookingModule 
           doctorId={doctor.id}
           doctorPrice={doctor.consultationPrice || doctor.price}
           onSlotSelect={handleSlotSelect}
           selectedDate={selectedDate}
           selectedTime={selectedTime}
         />

         {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-bottom-2">
               <AlertCircle size={20} />
               <p className="text-sm font-semibold">{error}</p>
            </div>
         )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-[74px] left-0 w-full p-6 z-40">
         <div className="max-w-md mx-auto flex gap-4">
            <button 
               onClick={onChat}
               className="w-16 h-16 rounded-2xl bg-white border-2 border-primary/10 text-primary flex items-center justify-center shadow-lg hover:bg-primary/5 transition-all"
            >
               <MessageCircle size={28} />
            </button>
            <Button 
               label={loading ? "Procesando..." : selectedTime ? `Confirmar para ${selectedTime}` : "Selecciona un horario"} 
               variant="primary" 
               fullWidth 
               disabled={!selectedTime || loading}
               onClick={handleBooking}
               icon={loading ? Loader2 : CheckCircle2}
               className={`h-16 rounded-2xl text-lg shadow-2xl transition-all ${
                 selectedTime ? 'shadow-primary/40' : 'opacity-80 grayscale'
               }`}
            />
         </div>
      </div>

      <BottomNav activeTab="doctors" onTabChange={onNavigate} />
    </div>
  );
};