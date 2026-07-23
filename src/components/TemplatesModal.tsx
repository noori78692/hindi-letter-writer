import React, { useState } from 'react';
import { X, Search, FileCheck2, ArrowRight, LayoutTemplate, Tag } from 'lucide-react';
import { POPULAR_TEMPLATES } from '../data/templates';
import { TemplateItem } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [previewTplId, setPreviewTplId] = useState<string | null>(null);

  if (!isOpen) return null;

  const badges = ['all', 'स्कूल / कॉलेज', 'बैंक कार्य', 'विद्युत', 'पुलिस / FIR', 'तहसील / राजस्व', 'कानूनी / RTI', 'पेंशन / कल्याण'];

  const filteredTemplates = POPULAR_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.includes(searchTerm) ||
      tpl.department.includes(searchTerm) ||
      tpl.category.includes(searchTerm) ||
      tpl.description.includes(searchTerm);
    const matchesBadge = selectedBadge === 'all' || tpl.badge === selectedBadge;
    return matchesSearch && matchesBadge;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                लोकप्रिय पत्र एवं आवेदन के नमूने (Templates)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                किसी भी नमूने का पूर्वावलोकन देखें या तुरंत प्रयोग करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="खोजें: जैसे 'छुट्टी', 'बैंक', 'बिजली', 'जाति'..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          {/* Badge Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {badges.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBadge(b)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedBadge === b
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {b === 'all' ? 'सभी नमूने' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 grow">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">कोई नमूना नहीं मिला</p>
            </div>
          ) : (
            filteredTemplates.map((tpl) => {
              const isExpanded = previewTplId === tpl.id;

              return (
                <div
                  key={tpl.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 bg-white dark:bg-slate-900/60 hover:border-amber-500/50 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="grow pr-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          {tpl.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {tpl.department}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Sample Field Preview */}
                  {isExpanded && tpl.sampleFields && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 animate-fade-in">
                      <p className="font-bold text-amber-800 dark:text-amber-400">नमूना विवरण (Sample Fields):</p>
                      <p><span className="font-semibold">कारण:</span> {tpl.sampleFields.reason}</p>
                      {tpl.sampleFields.duration && <p><span className="font-semibold">अवधि:</span> {tpl.sampleFields.duration}</p>}
                    </div>
                  )}

                  {/* Template Card Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTplId(isExpanded ? null : tpl.id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      {isExpanded ? 'पूर्वावलोकन बंद करें' : '👁️ पूर्वावलोकन देखें'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTemplate(tpl);
                        onClose();
                      }}
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-2xs transition-all active:scale-95"
                    >
                      <span>यह नमूना चुनें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
