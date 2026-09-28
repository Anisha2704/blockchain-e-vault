import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmDialog = ({ isOpen, title, message, note, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center space-x-3 text-amber-600">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{message}</p>
        {note && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
            ⚠️ {note}
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
