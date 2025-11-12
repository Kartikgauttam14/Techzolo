import React from 'react';
import { cn } from '@/lib/utils';

interface FullScreenBackgroundProps {
  type?: 'gradient' | 'image' | 'color' | 'modern' | 'dark' | 'ocean' | 'sunset' | 'tech' | 'aurora';
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
}

export function FullScreenBackground({
  type = 'gradient',
  src,
  alt = 'Background',
  className,
  children,
  overlay = false,
  overlayOpacity = 0.5,
  overlayColor = 'black',
}: FullScreenBackgroundProps) {
  const baseClasses = 'fixed inset-0 w-full h-full -z-10';
  
  const backgroundClasses = cn(
    baseClasses,
    type === 'gradient' && 'bg-gradient-tech',
    type === 'color' && 'bg-slate-900',
    type === 'modern' && 'bg-gradient-modern',
    type === 'dark' && 'bg-gradient-dark',
    type === 'ocean' && 'bg-gradient-ocean',
    type === 'sunset' && 'bg-gradient-sunset',
    type === 'tech' && 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    type === 'aurora' && 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    className
  );

  return (
    <>
      {type === 'image' && src ? (
        <div className={backgroundClasses}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
          {overlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
          )}
        </div>
      ) : (
        <div className={backgroundClasses}>
          {overlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
          )}
        </div>
      )}
      {children}
    </>
  );
}

export default FullScreenBackground;