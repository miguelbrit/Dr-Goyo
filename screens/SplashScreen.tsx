import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center text-white z-50">
      <div className="animate-bounce mb-4">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Activity size={48} className="text-white" />
        </div>
      </div>
      <h1 className="font-heading text-4xl font-bold tracking-tight animate-pulse">Dr. Goyo</h1>
      <p className="mt-2 text-accent font-medium text-sm tracking-widest uppercase">Salud Integral</p>
    </div>
  );
};