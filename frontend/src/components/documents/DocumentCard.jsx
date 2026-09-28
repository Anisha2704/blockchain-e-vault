import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Copy, ExternalLink, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const DocumentCard = ({ document, onDelete }) => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between group shadow-sm">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 group-hover:bg-cyan-100 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {document.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-1">{document.title}</h3>
            </div>
          </div>
          <StatusBadge status={document.status} />
        </div>

        {document.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{document.description}</p>
        )}

        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] mb-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Doc ID:</span>
            <span className="text-slate-900 font-bold">{document.blockchainDocumentId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>SHA-256:</span>
            <div className="flex items-center space-x-1">
              <span className="text-slate-700">{document.sha256Hash.substring(0, 10)}...</span>
              <button
                onClick={() => copyToClipboard(document.sha256Hash, 'SHA-256 Hash')}
                className="text-slate-400 hover:text-cyan-700 p-1"
                title="Copy full hash"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
        <span className="text-slate-500 font-medium">
          {new Date(document.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-2">
          {onDelete && (
            <button
              onClick={() => onDelete(document)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/documents/${document._id}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 transition-colors"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
