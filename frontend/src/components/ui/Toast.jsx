import React from 'react';
import { useTrip } from '../../context/TripContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useTrip();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-[#c5c5d3] rounded-xl shadow-lg shadow-black/5 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#006c49] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#00236f] shrink-0" />}
            <span className="text-sm font-medium text-[#191c1d]">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-[#757682] hover:text-[#191c1d] rounded-full hover:bg-[#edeeef] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
