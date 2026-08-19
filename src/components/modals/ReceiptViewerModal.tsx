import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, FileText, ExternalLink, Calendar, User } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const ReceiptViewerModal: React.FC = () => {
  const { viewingDocument, setViewingDocument } = useApp();

  if (!viewingDocument) return null;

  const isImage =
    viewingDocument.file_url.startsWith('data:image') ||
    viewingDocument.file_url.startsWith('http') ||
    viewingDocument.file_name.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
                {viewingDocument.file_name}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-teal-500/30">
                  {viewingDocument.document_type}
                </span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {viewingDocument.uploaded_by}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {formatDateTime(viewingDocument.uploaded_at)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewingDocument.file_url && (
              <a
                href={viewingDocument.file_url}
                target="_blank"
                rel="noreferrer"
                download={viewingDocument.file_name}
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Tải về"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={() => setViewingDocument(null)}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/70 min-h-[350px]">
          {isImage ? (
            <div className="relative group max-h-[60vh] flex items-center justify-center">
              <img
                src={viewingDocument.file_url}
                alt={viewingDocument.file_name}
                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md border border-slate-800"
              />
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/40">
              <FileText className="w-16 h-16 text-teal-400/60 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">{viewingDocument.file_name}</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Tài liệu định dạng PDF / Document
              </p>
              <a
                href={viewingDocument.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Mở trong tab mới
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setViewingDocument(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
