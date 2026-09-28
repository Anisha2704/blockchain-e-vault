import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileText, Copy, Trash2, ArrowLeft, Clock, User, Hash, Layers } from 'lucide-react';
import { documentService } from '../../services/documentService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDocumentDetails();
  }, [id]);

  const fetchDocumentDetails = async () => {
    try {
      setLoading(true);
      const res = await documentService.getDocumentById(id);
      if (res.success) {
        setDocument(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load document details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setToast({ message: `Copied ${label} to clipboard!`, type: 'info' });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await documentService.deleteDocument(id);
      if (res.success) {
        alert(res.message);
        navigate('/documents');
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto my-12 bg-white">
        <LoadingSpinner text="Fetching document details from database & smart contract..." />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-12">
        <p className="text-rose-600 font-bold">{error || 'Document not found'}</p>
        <Link to="/documents">
          <Button variant="secondary">Back to Documents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/documents" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-cyan-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Repository</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Local File</span>
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Detail Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                {document.category}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{document.title}</h1>
            </div>
          </div>
          <StatusBadge status={document.status} />
        </div>

        {document.description && (
          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
            {document.description}
          </div>
        )}

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* File Metadata */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
              File Storage Information
            </h3>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Original Filename:</span>
              <span className="text-slate-900 font-bold">{document.originalFileName}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>File Size:</span>
              <span className="text-slate-900 font-mono font-bold">{(document.fileSize / 1024).toFixed(2)} KB</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>File Type:</span>
              <span className="text-slate-900 font-mono font-bold">{document.fileType}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Uploaded On:</span>
              <span className="text-slate-900 font-bold">{new Date(document.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Blockchain Provenance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2 font-sans">
              On-Chain Cryptographic Provenance
            </h3>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1 font-sans font-semibold"><Hash className="w-3.5 h-3.5 text-cyan-600" /> Doc ID:</span>
              <span className="text-cyan-800 font-bold">{document.blockchainDocumentId}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1 font-sans font-semibold"><User className="w-3.5 h-3.5 text-purple-600" /> Owner Wallet:</span>
              <span className="text-slate-900 font-bold truncate max-w-[150px]">{document.ownerWalletAddress || 'System Signer'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1 font-sans font-semibold"><Clock className="w-3.5 h-3.5 text-emerald-600" /> Chain Time:</span>
              <span className="text-slate-900 font-bold">{document.blockchainTimestamp ? new Date(document.blockchainTimestamp).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* SHA-256 Hash Display Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-600 font-sans font-semibold">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" /> SHA-256 Digest Fingerprint:
            </span>
            <button
              onClick={() => copyToClipboard(document.sha256Hash, 'SHA-256 Hash')}
              className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Hash
            </button>
          </div>
          <p className="text-slate-900 font-bold break-all bg-white p-3 rounded-xl border border-slate-200">
            {document.sha256Hash}
          </p>
        </div>

        {/* Transaction Hash */}
        {document.blockchainTransactionHash && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-600 font-sans font-semibold">
              <span className="font-bold text-slate-900">Ethereum Transaction Hash:</span>
              <button
                onClick={() => copyToClipboard(document.blockchainTransactionHash, 'Tx Hash')}
                className="text-cyan-700 hover:underline flex items-center gap-1 font-bold"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Tx
              </button>
            </div>
            <p className="text-slate-700 break-all bg-white p-3 rounded-xl border border-slate-200">
              {document.blockchainTransactionHash}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Local Document File"
        message={`Are you sure you want to delete "${document.title}"?`}
        note="This will remove the document file from server storage and database records. The smart contract SHA-256 proof will remain immutable on the blockchain."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DocumentDetailPage;
