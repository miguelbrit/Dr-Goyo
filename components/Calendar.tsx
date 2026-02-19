import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateSelect?: (date: string) => void;
  onTimeSelect?: (time: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock dates for design demo
  const days = [
    { day: 'Mon', date: 10 },
    { day: 'Tue', date: 11 },
    { day: 'Wed', date: 12 },
    { day: 'Thu', date: 13 },
    { day: 'Fri', date: 14 },
  ];

  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
  const afternoonSlots = ['02:00 PM', '03:30 PM', '04:00 PM'];

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-semibold text-lg">Select Date</h3>
        <span className="text-primary text-sm font-medium">May 2024</span>
      </div>

      <div className="flex justify-between gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((item) => {
          const isSelected = item.date === selectedDate;
          return (
            <button
              key={item.date}
              onClick={() => {
                setSelectedDate(item.date);
                onDateSelect && onDateSelect(`2024-05-${item.date}`);
              }}
              className={`
                flex flex-col items-center justify-center min-w-[60px] h-[72px] rounded-xl border transition-all
                ${isSelected 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform -translate-y-1' 
                  : 'bg-white text-gray-600 border-gray-100 hover:border-primary/50'}
              `}
            >
              <span className={`text-xs mb-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{item.day}</span>
              <span className="text-lg font-bold">{item.date}</span>
            </button>
          );
        })}
      </div>

      <h3 className="font-heading font-semibold text-lg mb-3">Select Time</h3>
      
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wide">Morning</p>
        <div className="grid grid-cols-3 gap-3">
          {morningSlots.map(time => (
            <button
              key={time}
              onClick={() => {
                setSelectedTime(time);
                onTimeSelect && onTimeSelect(time);
              }}
              className={`
                py-2 px-1 text-sm rounded-lg border text-center transition-colors
                ${selectedTime === time 
                  ? 'bg-accent text-primary border-primary font-medium' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'}
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wide">Afternoon</p>
        <div className="grid grid-cols-3 gap-3">
          {afternoonSlots.map(time => (
            <button
              key={time}
              onClick={() => {
                setSelectedTime(time);
                onTimeSelect && onTimeSelect(time);
              }}
              className={`
                py-2 px-1 text-sm rounded-lg border text-center transition-colors
                ${selectedTime === time 
                  ? 'bg-accent text-primary border-primary font-medium' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'}
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};