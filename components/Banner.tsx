import React from 'react';

interface BannerProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  type?: 'info' | 'premium' | 'alert';
  backgroundImage?: string;
}

export const Banner: React.FC<BannerProps> = ({ 
  title, 
  subtitle, 
  ctaLabel, 
  onCtaClick,
  type = 'premium',
  backgroundImage
}) => {
  const styles = {
    info: 'bg-blue-50 text-secondary',
    premium: 'bg-gradient-to-r from-primary to-teal-600 text-white',
    alert: 'bg-orange-50 text-orange-800'
  };

  return (
    <div className={`p-5 rounded-2xl flex justify-between items-center shadow-soft relative overflow-hidden ${styles[type]}`}>
      
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
             <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-transparent z-0"></div>
        </>
      )}

      <div className="z-10 relative max-w-[70%]">
        <h3 className="font-heading font-bold text-lg mb-1">{title}</h3>
        <p className={`text-sm mb-4 ${type === 'premium' || backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
          {subtitle}
        </p>
        {ctaLabel && (
          <button 
            onClick={onCtaClick}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-transform hover:scale-105
              ${(type === 'premium' || backgroundImage)
                ? 'bg-white text-primary' 
                : 'bg-secondary text-white'}
            `}
          >
            {ctaLabel}
          </button>
        )}
      </div>
      
      {/* Decorative circle/icon placeholder if no image */}
      {!backgroundImage && (
        <div className={`
          absolute -right-6 -bottom-10 w-32 h-32 rounded-full opacity-20
          ${type === 'premium' ? 'bg-white' : 'bg-current'}
        `}></div>
      )}
    </div>
  );
};