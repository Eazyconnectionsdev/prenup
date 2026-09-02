"use client";

import React from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { ToastContainerProps } from '@/types/case-manager';


export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="toast-box">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemoveToast(t.id)}
          className="toast-msg cursor-pointer hover:border-[#e5c158] transition-all"
        >
          {t.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-[#e5c158]" />
          ) : t.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-[#d1fae5]" />
          ) : (
            <Info className="w-4 h-4 text-[#c5a059]" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
