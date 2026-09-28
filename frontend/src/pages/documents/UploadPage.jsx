import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ArrowRight, Copy } from 'lucide-react';
import { documentService } from '../../services/documentService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import UploadZone from '../../components/documents/UploadZone';
import Toast from '../../components/common/Toast';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Certificate');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [error, setError] = useState('');
  const [uploadedResult, setUploadedResult] = useState(null);

  const categories = ['Certificate', 'Identity', 'Experience', 'Achievement', 'Legal', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a document file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a document title');
      return;
    }

    setError('');
    setIsLoading(true);
    setUploadStep('1. Computing local SHA-256 cryptographic hash from file bytes...');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('file', file);

      setUploadStep('2. Interacting with Solidity Smart Contract on Hardhat node...');

      const res = await documentService.uploadDocument(formData);

      if (res.success) {
        setUploadedResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload document');
    } finally {
      setIsLoading(false);
      setUploadStep('');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload & Register Document
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Compute SHA-256 fingerprint and register document ownership proof on the blockchain.
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      {!uploadedResult ? (
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
          <UploadZone
            onFileSelect={(f) => setFile(f)}
            selectedFile={file}
            onRemoveFile={() => setFile(null)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Document Title"
              id="title"
              placeholder="e.g. B.Tech Graduation Degree Certificate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Document Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-lg bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description / Notes (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Optional notes or details regarding this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-lg bg-white border border-slate-300 p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>

          {uploadStep && (
            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 text-xs font-mono font-semibold animate-pulse">
              ⚙️ {uploadStep}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={isLoading}
            icon={UploadCloud}
          >
            Compute Hash & Register On Blockchain
          </Button>
        </form>
      ) : (
        /* Post Upload Success Result */
        <div className="glass-card p-8 rounded-3xl border border-emerald-300 bg-emerald-50/50 space-y-6 animate-fade-in shadow-xl">
          <div className="flex items-center space-x-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Document Successfully Registered!</h2>
              <p className="text-xs text-emerald-800 font-medium">Cryptographic SHA-256 fingerprint written to Smart Contract</p>
            </div>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 text-xs font-mono shadow-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500 font-sans font-semibold">Document ID:</span>
              <span className="text-cyan-800 font-bold">{uploadedResult.blockchainDocumentId}</span>
            </div>

            <div className="py-1 border-b border-slate-200 space-y-1">
              <div className="flex justify-between text-slate-500 font-sans font-semibold">
                <span>SHA-256 Fingerprint Hash:</span>
                <button
                  onClick={() => copyToClipboard(uploadedResult.sha256Hash, 'SHA-256 Hash')}
                  className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-slate-900 break-all font-semibold">{uploadedResult.sha256Hash}</p>
            </div>

            <div className="py-1 space-y-1">
              <div className="flex justify-between text-slate-500 font-sans font-semibold">
                <span>Blockchain Transaction Hash:</span>
                <button
                  onClick={() => copyToClipboard(uploadedResult.blockchainTransactionHash, 'Tx Hash')}
                  className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-slate-600 break-all">{uploadedResult.blockchainTransactionHash || 'Pending / Local Signer'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to={`/documents/${uploadedResult._id}`} className="w-full">
              <Button variant="primary" className="w-full" icon={ArrowRight}>
                View Document Details
              </Button>
            </Link>
            <Button variant="secondary" onClick={() => setUploadedResult(null)}>
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
