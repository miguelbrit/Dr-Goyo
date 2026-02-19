import React, { useState, useEffect } from 'react';

export interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  onItemClick?: (item: CarouselItem) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlayInterval = 3000,
  onItemClick
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-soft group">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-full relative aspect-[21/9] cursor-pointer"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <img
              src={item.image}
              alt={item.title || 'Banner'}
              className="w-full h-full object-cover relative z-10"
              loading="lazy"
            />
            {(item.title || item.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-6 z-20">
                {item.title && (
                  <h3 className="text-white font-heading font-bold text-lg md:text-xl mb-1 drop-shadow-md">
                    {item.title}
                  </h3>
                )}
                {item.subtitle && (
                  <p className="text-white/95 text-xs md:text-sm font-medium max-w-[80%] drop-shadow-sm leading-snug">
                    {item.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'bg-white w-6' : 'bg-white/50 w-1.5 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};