import React, { useState } from 'react';
import { FileCheck, Shield, Hash } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import UploadZone from '../../components/documents/UploadZone';
import VerificationResult from '../../components/dashboard/VerificationResult';
import Toast from '../../components/common/Toast';

const VerifyPage = () => {
  const [documentId, setDocumentId] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!documentId.trim()) {
      setError('Please enter the Document ID');
      return;
    }

    if (!file) {
      setError('Please upload the document file to verify');
      return;
    }

    setError('');
    setIsLoading(true);
    setLoadingText('1. Calculating document SHA-256 fingerprint...');

    try {
      const formData = new FormData();
      formData.append('documentId', documentId.trim());
      formData.append('file', file);

      setLoadingText('2. Querying Hardhat Ethereum smart contract record...');

      const res = await verificationService.verifyDocument(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification process failed');
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 mb-1">
          <FileCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Public Document Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          Verify the authenticity and integrity of any document against its immutable smart contract hash. No login required.
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {!result ? (
        <form onSubmit={handleVerify} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
          <Input
            label="Document Registration ID"
            id="documentId"
            icon={Hash}
            placeholder="e.g. DOC-1711382000000-4821"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upload Document Copy For Verification
            </label>
            <UploadZone
              onFileSelect={(f) => setFile(f)}
              selectedFile={file}
              onRemoveFile={() => setFile(null)}
            />
          </div>

          {loadingText && (
            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold animate-pulse">
              ⚙️ {loadingText}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={isLoading}
            icon={Shield}
          >
            Verify Document Authenticity
          </Button>
        </form>
      ) : (
        <VerificationResult
          result={result}
          onReset={() => {
            setResult(null);
            setFile(null);
            setDocumentId('');
          }}
        />
      )}
    </div>
  );
};

export default VerifyPage;
