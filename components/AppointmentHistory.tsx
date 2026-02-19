import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

export const AppointmentHistory: React.FC = () => {
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiología',
      date: '12 May, 2024',
      time: '09:00 AM',
      status: 'upcoming',
      image: 'https://picsum.photos/id/1011/100/100'
    },
    {
      id: 2,
      doctor: 'Dr. Juan Pérez',
      specialty: 'Dermatología',
      date: '10 Abr, 2024',
      time: '02:30 PM',
      status: 'completed',
      image: 'https://picsum.photos/id/1025/100/100'
    },
    {
      id: 3,
      doctor: 'Lab. Clínico Central',
      specialty: 'Exámenes de Sangre',
      date: '15 Mar, 2024',
      time: '07:00 AM',
      status: 'cancelled',
      image: 'https://picsum.photos/id/1062/100/100'
    }
  ];

  return (
    <div className="space-y-4">
      {appointments.map((apt) => (
        <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
          <img src={apt.image} alt={apt.doctor} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-heading font-semibold text-gray-900">{apt.doctor}</h4>
              {apt.status === 'upcoming' && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">PROXIMA</span>}
              {apt.status === 'completed' && <CheckCircle size={16} className="text-green-500" />}
              {apt.status === 'cancelled' && <XCircle size={16} className="text-red-400" />}
            </div>
            
            <p className="text-xs text-primary font-medium mb-2">{apt.specialty}</p>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{apt.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{apt.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center pt-4">
        <button className="text-sm text-primary font-medium hover:underline">Ver todo el historial</button>
      </div>
    </div>
  );
};