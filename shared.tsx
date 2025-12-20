
import React, { createContext, useContext } from 'react';
import { Edit2 } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'sale' | 'affiliate' | 'info';
  message: string;
}

export const NotificationContext = createContext({
  notify: (message: string, type: 'sale' | 'affiliate' | 'info' = 'info') => {}
});

export const KeyContext = createContext({
  hasKey: false,
  triggerKeyError: () => {}
});

export const useNotify = () => useContext(NotificationContext);
export const useKeyStatus = () => useContext(KeyContext);

export const BrandText = ({ name, logoUrl, onLogoClick }: { name: string; logoUrl?: string; onLogoClick?: () => void }) => {
  const words = name.toUpperCase().split(' ');
  const handleClick = () => {
    if (typeof onLogoClick === 'function') {
      onLogoClick();
    }
  };

  return (
    <div 
      className={`flex items-center space-x-3 relative ${typeof onLogoClick === 'function' ? 'group cursor-pointer' : ''}`} 
      onClick={handleClick}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
      ) : (
        <span className="text-2xl font-black tracking-tighter inline-flex items-center">
          {words.map((word, i) => (
            <span key={i} className={word === "RED" ? "text-red-600" : "text-white"}>
              {word}{i < words.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </span>
      )}
      {typeof onLogoClick === 'function' && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 p-1 rounded-md">
          <Edit2 className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};
