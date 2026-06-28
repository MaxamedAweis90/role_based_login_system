'use client';

import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Dismiss toast after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // wait for transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  let bgClass = 'bg-white border-slate-200 text-slate-800 shadow-xl';
  let icon = <Info className="w-5 h-5 text-brand-600" />;

  if (type === 'error') {
    bgClass = 'bg-red-50 border-red-200 text-red-800 shadow-lg';
    icon = <AlertCircle className="w-5 h-5 text-red-600 animate-bounce" />;
  } else if (type === 'success') {
    bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-lg';
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
  }

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border ${bgClass} transition-all duration-300 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
      }`}
      style={{ minWidth: '300px', maxWidth: '420px' }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-xs font-bold flex-1 leading-snug">{message}</p>
      <button
        onClick={handleClose}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
