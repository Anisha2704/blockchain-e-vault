import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Copy, ChevronDown, ChevronUp, Clock, User, Hash, FileCode } from 'lucide-react';
import Button from '../common/Button';

const VerificationResult = ({ result, onReset }) => {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!result) return null;

  const isVerified = result.verified;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label} to clipboard!`);
  };

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 border shadow-xl space-y-6 transition-all animate-fade-in ${
      isVerified ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`p-4 rounded-full border ${
          isVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-300 glow-cyan' : 'bg-rose-100 text-rose-700 border-rose-300'
        }`}>
          {isVerified ? (
            <ShieldCheck className="w-16 h-16 animate-pulse" />
          ) : (
            <ShieldAlert className="w-16 h-16 animate-bounce" />
          )}
        </div>
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${
            isVerified ? 'text-emerald-800' : 'text-rose-800'
          }`}>
            {isVerified ? '✅ DOCUMENT VERIFIED - ORIGINAL' : '❌ VERIFICATION FAILED'}
          </h2>
          <p className="text-sm text-slate-700 mt-1 max-w-lg font-medium">
            {result.message}
          </p>
        </div>
      </div>

      {/* Hash Comparison Section */}
      <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Cryptographic Hash Fingerprint Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Uploaded File Hash */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-500 font-sans text-[11px] font-semibold">
              <span>Uploaded Document Hash:</span>
              <button
                onClick={() => copyToClipboard(result.uploadedHash, 'Uploaded Hash')}
                className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <p className="text-slate-900 break-all font-semibold leading-relaxed">
              {result.uploadedHash}
            </p>
          </div>

          {/* Blockchain Stored Hash */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-500 font-sans text-[11px] font-semibold">
              <span>Blockchain Registered Hash:</span>
              <button
                onClick={() => copyToClipboard(result.blockchainHash, 'Blockchain Hash')}
                className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <p className="text-slate-900 break-all font-semibold leading-relaxed">
              {result.blockchainHash}
            </p>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div className={`p-3 rounded-lg text-xs font-bold text-center border ${
          isVerified
            ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300'
            : 'bg-rose-100/70 text-rose-800 border-rose-300'
        }`}>
          {isVerified
            ? 'Fingerprint hashes match 100%. The file content is authentic and has not been altered.'
            : 'Fingerprint hashes do not match. The document file contents have been altered or tampered with!'}
        </div>
      </div>

      {/* Expandable Technical Details */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 py-2"
        >
          <span className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-cyan-600" />
            <span>On-Chain Blockchain Provenance Metadata</span>
          </span>
          {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnical && (
          <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs text-slate-800 font-mono shadow-sm">
            <div className="flex items-center justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5 font-sans font-semibold"><Hash className="w-3.5 h-3.5 text-cyan-600" /> Document ID:</span>
              <span className="text-cyan-800 font-bold">{result.documentId}</span>
            </div>

            {result.details?.timestamp && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5 font-sans font-semibold"><Clock className="w-3.5 h-3.5 text-purple-600" /> Block Timestamp:</span>
                <span className="font-semibold">{new Date(result.details.timestamp).toLocaleString()}</span>
              </div>
            )}

            {result.details?.ownerWalletAddress && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 flex items-center gap-1.5 font-sans font-semibold"><User className="w-3.5 h-3.5 text-emerald-600" /> Owner Wallet Address:</span>
                <span className="text-slate-900 font-semibold truncate max-w-[200px]">{result.details.ownerWalletAddress}</span>
              </div>
            )}

            {result.details?.transactionHash && (
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-sans font-semibold">Tx Hash:</span>
                <span className="text-slate-600 truncate max-w-[200px]">{result.details.transactionHash}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <Button onClick={onReset} variant="outline">
          Verify Another Document
        </Button>
      </div>
    </div>
  );
};

export default VerificationResult;
