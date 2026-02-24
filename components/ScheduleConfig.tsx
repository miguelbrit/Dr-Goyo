import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Check, Save, Loader2, AlertCircle, 
  ChevronLeft, ChevronRight, Copy, Trash2, Plus
} from 'lucide-react';
import { Button } from './Button';

interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface ScheduleConfigProps {
  doctorId: string;
  initialAvailability?: ScheduleSlot[];
  initialSlotDuration?: number;
  onSave?: () => void;
}

// Helper to generate slots
export const calculateAvailableSlots = (
  availability: ScheduleSlot[],
  slotDurationMinutes: number,
  targetDayOfWeek: number
) => {
  const daySchedule = availability.find(a => a.dayOfWeek === targetDayOfWeek && a.isActive);
  if (!daySchedule || !daySchedule.startTime || !daySchedule.endTime) return [];

  const slots: string[] = [];
  try {
    let current = new Date(`2000-01-01T${daySchedule.startTime}:00`);
    const end = new Date(`2000-01-01T${daySchedule.endTime}:00`);

    if (isNaN(current.getTime()) || isNaN(end.getTime())) return [];

  while (current < end) {
    const timeString = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    slots.push(timeString);
    current.setMinutes(current.getMinutes() + slotDurationMinutes);
  }
  } catch (e) {
    console.error("Error calculating slots", e);
    return [];
  }

  return slots;
};

export const ScheduleConfig: React.FC<ScheduleConfigProps> = ({ 
  doctorId, 
  initialAvailability = [], 
  initialSlotDuration = 30,
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [slotDuration, setSlotDuration] = useState(initialSlotDuration);
  const [availability, setAvailability] = useState<ScheduleSlot[]>(() => {
    const defaultAvailability = [0, 1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      startTime: '08:00',
      endTime: '17:00',
      isActive: [1, 2, 3, 4, 5].includes(day)
    }));
    
    if (initialAvailability && initialAvailability.length > 0) {
      return defaultAvailability.map(def => {
        const existing = initialAvailability.find(a => a.dayOfWeek === def.dayOfWeek);
        return existing ? { ...existing } : def;
      });
    }
    return defaultAvailability;
  });

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [patternStart, setPatternStart] = useState('08:00');
  const [patternEnd, setPatternEnd] = useState('17:00');

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // --- Fix: Prevent default logic and state management ---

  const toggleDay = (e: React.MouseEvent, day: number) => {
    e.preventDefault();
    e.stopPropagation();
    setAvailability(prev => prev.map(a => 
      a.dayOfWeek === day ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const toggleSelectedDay = (e: React.MouseEvent, dayIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const updateTime = (day: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => prev.map(a => 
      a.dayOfWeek === day ? { ...a, [field]: value } : a
    ));
  };

  const applyPattern = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setMessage({ type: 'error', text: 'Selecciona al menos un día para aplicar el patrón' });
      return;
    }
    setAvailability(prev => prev.map(a => 
      selectedDays.includes(a.dayOfWeek) 
        ? { ...a, startTime: patternStart, endTime: patternEnd, isActive: true } 
        : a
    ));
    setSelectedDays([]);
    setMessage({ type: 'success', text: 'Patrón aplicado correctamente' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSave = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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
          slotDuration,
          availability: availability.map(a => ({
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
            isActive: a.isActive
          }))
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Agenda actualizada correctamente' });
        if (onSave) onSave();
      } else {
        throw new Error(result.error || 'Error al guardar');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" onClick={(e) => e.stopPropagation()}>
      
      {/* 1. Pattern Application */}
      <section className="bg-gradient-to-br from-secondary/5 to-primary/5 p-6 rounded-3xl border border-primary/10">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Copy size={20} className="text-primary" /> Aplicar Patrón Horario
        </h3>
        <p className="text-sm text-gray-500 mb-6">Configura varios días rápidamente con el mismo rango de horas.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Selecciona los días</label>
            <div className="flex flex-wrap gap-2">
              {daysLabels.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={(e) => toggleSelectedDay(e, i)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedDays.includes(i) ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hora Inicio</label>
              <input 
                type="time" 
                value={patternStart}
                onChange={(e) => setPatternStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hora Fin</label>
              <input 
                type="time" 
                value={patternEnd}
                onChange={(e) => setPatternEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button 
            label="Aplicar Horario a Seleccionados" 
            variant="outline" 
            fullWidth 
            type="button"
            onClick={applyPattern}
            icon={Check}
          />
        </div>
      </section>

      {/* 3. Detailed Weekly Schedule */}
      <section className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Horario Semanal Detallado
          </h3>
          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-400 px-2 uppercase">Duración Cita:</span>
            <select 
              value={slotDuration}
              onChange={(e) => setSlotDuration(parseInt(e.target.value))}
              className="bg-transparent text-sm font-bold text-primary outline-none"
            >
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {availability.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((a) => (
            <div key={a.dayOfWeek} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border transition-all ${
              a.isActive ? 'border-primary/20 bg-primary/5' : 'border-gray-100 bg-gray-50/50 grayscale'
            }`}>
              <div className="flex items-center gap-3 md:w-32">
                <button 
                  type="button"
                  onClick={(e) => toggleDay(e, a.dayOfWeek)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    a.isActive ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'
                  }`}
                >
                  <Check size={14} />
                </button>
                <span className={`font-bold ${a.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {daysLabels[a.dayOfWeek]}
                </span>
              </div>

              {a.isActive ? (
                <>
                  <div className="flex flex-1 gap-3">
                    <div className="flex-1">
                      <input 
                        type="time" 
                        value={a.startTime}
                        onChange={(e) => updateTime(a.dayOfWeek, 'startTime', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div className="flex items-center text-gray-300">-</div>
                    <div className="flex-1">
                      <input 
                        type="time" 
                        value={a.endTime}
                        onChange={(e) => updateTime(a.dayOfWeek, 'endTime', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block text-[10px] font-bold text-primary/60 bg-white px-2 py-1 rounded-md border border-primary/10">
                    {calculateAvailableSlots([a], slotDuration || 30, a.dayOfWeek).length} slots generados
                  </div>
                </>
              ) : (
                <div className="flex-1 text-sm text-gray-400 italic">No laborable</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Save Button */}
      <div className="sticky bottom-0 bg-gray-bg/80 backdrop-blur-sm pt-4 pb-2 z-10">
        <Button 
          label={loading ? "Guardando..." : "Guardar Cambios de Agenda"} 
          fullWidth 
          type="button"
          onClick={handleSave}
          disabled={loading}
          icon={loading ? Loader2 : Save}
          className="shadow-xl shadow-primary/30"
        />
      </div>

    </div>
  );
};
