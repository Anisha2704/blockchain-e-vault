import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, X } from 'lucide-react';

const UploadZone = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-cyan-600 bg-cyan-50'
              : 'border-slate-300 bg-slate-50/80 hover:border-slate-400 hover:bg-slate-100/50'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-3 flex flex-col items-center">
            <div className="p-4 rounded-full bg-white text-cyan-600 border border-slate-200 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Click to browse or drag & drop your document
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: PDF, PNG, JPG, JPEG (Max file size: 10MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="glass-card p-4 rounded-xl border border-cyan-300 flex items-center justify-between bg-cyan-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-white border border-cyan-200 text-cyan-700 shadow-sm">
              <File className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 line-clamp-1">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveFile}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove File"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Security Note */}
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
        <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <span>
          <strong>Cryptographic Privacy Guarantee:</strong> Your uploaded document will be hashed locally using SHA-256. Only the unique 64-character hash is recorded on the blockchain smart contract.
        </span>
      </div>
    </div>
  );
};

export default UploadZone;
