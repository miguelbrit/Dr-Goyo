import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  Loader2, AlertCircle, CheckCircle2, X 
} from 'lucide-react';
import { Button } from './Button';

interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface BookingViewProps {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorPrice: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ 
  doctorId, doctorName, doctorSpecialty, doctorImage, doctorPrice, onClose, onSuccess 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<{ availability: ScheduleSlot[], slotDuration: number } | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const daysInWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    fetchAvailability();
  }, [doctorId]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/doctor/${doctorId}`);
      const result = await response.json();
      if (result.success) {
        setDoctorData({
          availability: result.data.doctor.availability,
          slotDuration: result.data.doctor.slotDuration || 30
        });
        setAppointments(result.data.appointments);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError("Error al cargar disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  const getDayAvailability = (date: Date) => {
    if (!doctorData) return null;
    return doctorData.availability.find(a => a.dayOfWeek === date.getDay() && a.isActive);
  };

  const generateTimeSlots = (date: Date) => {
    const config = getDayAvailability(date);
    if (!config || !doctorData) return [];

    const slots: string[] = [];
    const [startH, startM] = config.startTime!.split(':').map(Number);
    const [endH, endM] = config.endTime!.split(':').map(Number);
    
    let current = new Date(date);
    current.setHours(startH, startM, 0, 0);
    
    const end = new Date(date);
    end.setHours(endH, endM, 0, 0);

    const duration = doctorData.slotDuration;

    while (current < end) {
      // Check if slot is in the past
      if (current > new Date()) {
        const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Filter out existing appointments
        const isTaken = appointments.some(appt => {
          const apptDate = new Date(appt.date);
          return apptDate.getTime() === current.getTime() && appt.status !== 'cancelled';
        });

        if (!isTaken) {
          slots.push(timeStr);
        }
      }
      current.setMinutes(current.getMinutes() + duration);
    }
    return slots;
  };

  const handleBook = async () => {
    if (!selectedTime) return;
    
    setBookingLoading(true);
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
          doctorId,
          date: appointmentDate.toISOString(),
          price: doctorPrice,
          type: 'Consulta Médica'
        })
      });

      const result = await response.json();
      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Error al agendar");
      }
    } catch (err: any) {
      setError("Error de conexión");
    } finally {
      setBookingLoading(false);
    }
  };

  const renderCalendar = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    return (
      <div className="flex gap-3 overflow-x-auto py-4 px-1 no-scrollbar">
        {dates.map((date, i) => {
          const isSelected = selectedDate.toDateString() === date.toDateString();
          const isAvailable = !!getDayAvailability(date);
          
          return (
            <button
              key={i}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20' 
                  : isAvailable 
                    ? 'bg-white border border-gray-100 text-gray-900 hover:border-primary/50' 
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!isAvailable}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                {daysInWeek[date.getDay()]}
              </span>
              <span className="text-lg font-bold">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cita Confirmada!</h2>
        <p className="text-gray-500 mb-8">Tu cita con {doctorName} ha sido agendada con éxito.</p>
        <Button label="Cerrar" variant="primary" fullWidth onClick={onClose} />
      </div>
    );
  }

  const slots = generateTimeSlots(selectedDate);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <img src={doctorImage} alt="" className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{doctorName}</h3>
              <p className="text-primary text-xs font-bold uppercase tracking-wider">{doctorSpecialty}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Calendar */}
          <section>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Selecciona una fecha</h4>
            <p className="text-xs text-gray-400 mb-2 font-medium">Próximos 14 días disponibles</p>
            {renderCalendar()}
          </section>

          {/* Slots */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Horarios disponibles</h4>
                <p className="text-xs text-gray-400 font-medium">Hora local de consulta</p>
              </div>
              <Clock size={16} className="text-gray-300" />
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {slots.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                      selectedTime === time 
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                        : 'bg-white border-gray-100 text-gray-700 hover:border-primary/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm font-medium">No hay horarios disponibles</p>
                <p className="text-xs text-gray-400">Intenta con otra fecha</p>
              </div>
            )}
          </section>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-shake">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-2 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inversión</p>
              <p className="text-xl font-bold text-gray-900">${doctorPrice.toFixed(2)}</p>
            </div>
            {selectedTime && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Resumen</p>
                <p className="text-sm font-bold text-gray-700">{selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} • {selectedTime}</p>
              </div>
            )}
          </div>
          <Button 
            label={bookingLoading ? "Procesando..." : "Confirmar Cita"} 
            variant="primary" 
            fullWidth 
            disabled={!selectedTime || bookingLoading}
            onClick={handleBook}
            icon={bookingLoading ? Loader2 : CheckCircle2}
            className="h-14 rounded-2xl text-lg shadow-xl shadow-primary/25"
          />
        </div>

      </div>
    </div>
  );
};
