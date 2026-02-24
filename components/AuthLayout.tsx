import React from "react";
import { ChevronLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  onBack,
  showBack = true,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative px-6 py-12 md:py-20">
      {/* Header - Back Button */}
      {showBack && onBack && (
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      )}

      {/* Content Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        {(title || subtitle) && (
          <div className="mb-10 text-center w-full">
            {title && (
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-secondary mb-3 tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-500 text-base md:text-lg max-w-[280px] mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="w-full space-y-8">{children}</div>
        <div className="mt-12 text-[10px] text-gray-300 font-medium tracking-widest uppercase text-center">
           Dr Goyo v1.0.27-main (Deps Synced)
        </div>
      </div>
    </div>
  );
};
