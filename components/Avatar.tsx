import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', status }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizes[size]} rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent text-primary font-bold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white ${
          status === 'online' ? 'bg-green-400' : 
          status === 'busy' ? 'bg-red-400' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};