import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title = 'No documents found', description = 'Upload your first document to register its fingerprint on the blockchain.', actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-200 my-4 shadow-sm">
      <div className="p-4 rounded-full bg-slate-100 border border-slate-200 text-cyan-600 mb-4">
        <FolderOpen className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
