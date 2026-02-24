import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface BookingModuleProps {
  doctorId: string;
  doctorPrice: number;
  onSlotSelect: (date: Date, time: string) => void;
  selectedDate: Date;
  selectedTime: string | null;
}

export const BookingModule: React.FC<BookingModuleProps> = ({ 
  doctorId, 
  doctorPrice, 
  onSlotSelect,
  selectedDate,
  selectedTime
}) => {
  const [loading, setLoading] = useState(false);
  const [doctorData, setDoctorData] = useState<{ availability: ScheduleSlot[], slotDuration: number } | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const daysInWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
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

    fetchAvailability();
  }, [doctorId]);

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
      if (current > new Date()) {
        const timeStr = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
        
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

  const next14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const slots = generateTimeSlots(selectedDate);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary" /> Agendar Cita
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {doctorData?.slotDuration || 30} min por consulta
        </span>
      </div>

      {/* Date Selector */}
      <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar scroll-smooth">
        {next14Days.map((date, i) => {
          const isSelected = selectedDate.toDateString() === date.toDateString();
          const isAvailable = !!getDayAvailability(date);
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSlotSelect(date, null as any)}
              disabled={!isAvailable}
              className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                isSelected 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                  : isAvailable 
                    ? 'bg-card border-border-main text-text-main hover:border-primary/50' 
                    : 'bg-gray-bg border-transparent text-gray-light opacity-50 cursor-not-allowed'
              }`}
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

      {/* Time Slots grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-gray-light" />
          <h4 className="text-sm font-bold text-text-main">Horarios disponibles</h4>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((time, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSlotSelect(selectedDate, time)}
                className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                  selectedTime === time 
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                    : 'bg-card border-border-main text-text-main hover:border-primary/50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center bg-gray-bg/50 rounded-2xl border border-dashed border-border-main">
            <AlertCircle size={32} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-text text-sm font-medium">No hay citas disponibles para este día</p>
            <p className="text-xs text-gray-light">Prueba seleccionando otro día en el calendario</p>
          </div>
        )}
      </div>

      {/* Info Card if slot selected */}
      {selectedTime && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Horario Seleccionado</p>
                <p className="text-sm font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} • {selectedTime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Precio</p>
              <p className="text-lg font-bold text-gray-900">${doctorPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
