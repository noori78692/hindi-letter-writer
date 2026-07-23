import React from 'react';
import { X, Clock, Trash2, ExternalLink, Calendar, Search, ArrowRight } from 'lucide-react';
import { DraftItem } from '../types';

interface DraftsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftItem[];
  onLoadDraft: (draft: DraftItem) => void;
  onDeleteDraft: (id: string) => void;
  onClearAllDrafts: () => void;
}

export const DraftsDrawer: React.FC<DraftsDrawerProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onClearAllDrafts,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredDrafts = drafts.filter(
    (d) =>
      d.title.includes(searchQuery) ||
      d.department.includes(searchQuery) ||
      d.category.includes(searchQuery) ||
      d.letterText.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                सहेजे गए ड्राफ्ट ({drafts.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ड्राफ्ट खोजें..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Draft List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredDrafts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">कोई सहेजा हुआ ड्राफ्ट नहीं मिला</p>
                <p className="text-xs text-slate-500 mt-1">
                  पत्र तैयार करने के बाद "ड्राफ्ट सहेजें" बटन पर क्लिक करें
                </p>
              </div>
            ) : (
              filteredDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="group border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900 hover:border-amber-500/60 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 mb-1">
                        {draft.department}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {draft.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{draft.savedAt}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          onLoadDraft(draft);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                        title="ड्राफ्ट खोलें"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDraft(draft.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 italic font-serif-devanagari bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {draft.letterText}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {drafts.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
              <span className="text-xs text-slate-500">कुल {drafts.length} ड्राफ्ट</span>
              <button
                onClick={onClearAllDrafts}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                सभी ड्राफ्ट हटाएं
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
