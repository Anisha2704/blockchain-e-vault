import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Copy, ExternalLink, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const DocumentTable = ({ documents, onDelete }) => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 glass-card shadow-sm">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Document Title</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4 font-mono">Blockchain ID</th>
            <th className="px-6 py-4 font-mono">SHA-256 Hash</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {documents.map((doc) => (
            <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="line-clamp-1">{doc.title}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">
                  {doc.category}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-slate-800 font-semibold">{doc.blockchainDocumentId}</td>
              <td className="px-6 py-4 font-mono text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <span>{doc.sha256Hash.substring(0, 10)}...</span>
                  <button
                    onClick={() => copyToClipboard(doc.sha256Hash, 'Hash')}
                    className="text-slate-400 hover:text-cyan-700"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={doc.status} />
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Link
                  to={`/documents/${doc._id}`}
                  className="inline-flex items-center space-x-1 text-xs text-cyan-700 hover:text-cyan-900 font-bold px-2.5 py-1 rounded bg-cyan-50 border border-cyan-200 hover:bg-cyan-100"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
