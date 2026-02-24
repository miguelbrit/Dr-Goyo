import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full px-5 py-4 rounded-2xl border-none 
            bg-gray-bg text-text-main
            placeholder:text-gray-light
            shadow-neo-elevated
            focus:shadow-neo-sunken
            focus:outline-none 
            transition-all duration-300 ease-out
            ${icon ? 'pl-12' : ''}
            ${error ? 'ring-1 ring-red-500/30' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};