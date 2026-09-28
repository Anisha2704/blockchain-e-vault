import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    error: 'bg-rose-50 border-rose-300 text-rose-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    info: 'bg-cyan-50 border-cyan-300 text-cyan-900'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-xl border shadow-xl backdrop-blur-md max-w-md space-x-3 transition-all ${styles[type] || styles.info}`}>
      {icons[type]}
      <div className="text-sm font-semibold pr-2">{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
