import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface AvailabilityItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface AvailabilitySettingsProps {
  doctorId: string;
  initialAvailability?: any[];
  onSave?: () => void;
}

const DAYS = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({ 
  doctorId, 
  initialAvailability = [],
  onSave 
}) => {
  const [availability, setAvailability] = useState<AvailabilityItem[]>(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: '08:00',
      endTime: '17:00',
      isActive: false
    }))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (initialAvailability && initialAvailability.length > 0) {
      const newAvailability = [...availability];
      initialAvailability.forEach(item => {
        newAvailability[item.dayOfWeek] = {
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime || '08:00',
          endTime: item.endTime || '17:00',
          isActive: item.isActive ?? true
        };
      });
      setAvailability(newAvailability);
    }
  }, [initialAvailability]);

  const toggleDay = (index: number) => {
    setAvailability(prev => prev.map((item, i) => 
      i === index ? { ...item, isActive: !item.isActive } : item
    ));
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
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
          availability: availability.filter(a => a.isActive) // Send only active ones or handle logic in backend
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Horarios guardados correctamente' });
        if (onSave) onSave();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al guardar horarios' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} /> Horarios de Atención
        </h3>
        <p className="text-[10px] text-primary font-bold bg-blue-50 px-2 py-1 rounded-full uppercase">Configuración Semanal</p>
      </div>

      <div className="space-y-3">
        {availability.map((item, index) => (
          <div 
            key={index} 
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl transition-all border ${
              item.isActive ? 'bg-blue-50/30 border-blue-100 shadow-sm' : 'bg-gray-50 border-transparent opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <button
                type="button"
                onClick={() => toggleDay(index)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  item.isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {item.isActive ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
              <span className={`font-bold text-sm ${item.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                {DAYS[index]}
              </span>
            </div>

            {item.isActive ? (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-blue-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">De</span>
                  <input 
                    type="time" 
                    value={item.startTime} 
                    onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                    className="text-sm font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-20"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-blue-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">A</span>
                  <input 
                    type="time" 
                    value={item.endTime} 
                    onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                    className="text-sm font-bold text-primary bg-transparent border-none focus:ring-0 p-0 w-20"
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-gray-400 font-medium italic">No laborable</span>
            )}
          </div>
        ))}
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <Button 
        label={loading ? "Guardando..." : "Guardar Horarios"} 
        fullWidth 
        variant="primary" 
        onClick={handleSave}
        disabled={loading}
        icon={loading ? Loader2 : Save}
      />
    </div>
  );
};
