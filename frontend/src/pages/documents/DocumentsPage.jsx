import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { documentService } from '../../services/documentService';
import DocumentCard from '../../components/documents/DocumentCard';
import DocumentTable from '../../components/documents/DocumentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = ['All', 'Certificate', 'Identity', 'Experience', 'Achievement', 'Legal', 'Other'];

  useEffect(() => {
    fetchDocuments();
  }, [search, category]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentService.getDocuments({ search, category });
      if (res.success) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocToDelete) return;
    setIsDeleting(true);

    try {
      const res = await documentService.deleteDocument(selectedDocToDelete._id);
      if (res.success) {
        setToast({ message: res.message, type: 'info' });
        setDocuments(documents.filter((d) => d._id !== selectedDocToDelete._id));
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    } finally {
      setIsDeleting(false);
      setSelectedDocToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Browse and manage your registered document fingerprints
          </p>
        </div>

        <Link to="/documents/upload">
          <button className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </Link>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search title, filename, or Doc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                category === cat
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid vs Table view toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document List View */}
      {loading ? (
        <div className="glass-card p-12 rounded-2xl bg-white">
          <LoadingSpinner text="Searching vault documents..." />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="No document records match your current search and category filters."
          actionText="Upload Document"
          onAction={() => window.location.href = '/documents/upload'}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <DocumentCard key={doc._id} document={doc} onDelete={(d) => setSelectedDocToDelete(d)} />
          ))}
        </div>
      ) : (
        <DocumentTable documents={documents} onDelete={(d) => setSelectedDocToDelete(d)} />
      )}

      {/* Delete Confirmation Popup */}
      <ConfirmDialog
        isOpen={!!selectedDocToDelete}
        title="Delete Document Record"
        message={`Are you sure you want to delete "${selectedDocToDelete?.title}" from local application storage?`}
        note="Deleting this local file removes it from your application database. However, the cryptographic proof already written to the Ethereum Blockchain is permanent and immutable."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedDocToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DocumentsPage;
