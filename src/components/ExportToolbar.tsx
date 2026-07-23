import React, { useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Share2,
  BookmarkPlus,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { exportToPDF, exportToDocx, handlePrintLetter } from '../utils/exportUtils';

interface ExportToolbarProps {
  letterText: string;
  categoryTitle: string;
  onSaveDraft: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  letterText,
  categoryTitle,
  onSaveDraft,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setErrorMsg('');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setStatusMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Copy text to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      showStatus('पाठ क्लिपबोर्ड में कॉपी हो गया!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      showError('कॉपी करने में विफल।');
    }
  };

  // PDF Export
  const handleExportPDF = async () => {
    if (!letterText.trim()) {
      showError('पत्र का मुख्य भाग खाली है।');
      return;
    }
    setExportingPdf(true);
    try {
      await exportToPDF('print-container', categoryTitle || 'आवेदन_पत्र', (msg) => setStatusMsg(msg));
      showStatus('PDF सफलतापूर्वक सहेजा गया!');
    } catch (err: any) {
      showError('PDF बनाने में समस्या आई। पुनः प्रयास करें।');
    } finally {
      setExportingPdf(false);
    }
  };

  // Direct Print
  const handlePrint = () => {
    if (!letterText.trim()) {
      showError('पत्र का मुख्य भाग खाली है।');
      return;
    }
    handlePrintLetter('print-container');
  };

  // Download Word (.docx)
  const handleDownloadWord = async () => {
    if (!letterText.trim()) {
      showError('पत्र का मुख्य भाग खाली है।');
      return;
    }
    setExportingWord(true);
    try {
      await exportToDocx(letterText, categoryTitle || 'आवेदन_पत्र', (msg) => setStatusMsg(msg));
      showStatus('Word फ़ाइल डाउनलोड हो गई!');
    } catch (err: any) {
      showError('Word फ़ाइल तैयार करने में विफल।');
    } finally {
      setExportingWord(false);
    }
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    if (!letterText.trim()) {
      showError('पत्र का मुख्य भाग खाली है।');
      return;
    }
    const encoded = encodeURIComponent(letterText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Save Draft
  const handleSave = () => {
    onSaveDraft();
    setSaved(true);
    showStatus('ड्राफ्ट सफलतापूर्वक सहेजा गया!');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md space-y-2">
      
      {/* Status & Error Banner */}
      {(statusMsg || errorMsg) && (
        <div
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in ${
            errorMsg
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}
        >
          {errorMsg ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{errorMsg || statusMsg}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Primary Actions: PDF, Word, Print */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          <button
            onClick={handleExportPDF}
            disabled={exportingPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="A4 फॉर्मेट में PDF डाउनलोड करें"
          >
            {exportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{exportingPdf ? 'PDF तैयार हो रहा...' : 'PDF डाउनलोड'}</span>
          </button>

          <button
            onClick={handleDownloadWord}
            disabled={exportingWord}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm border border-blue-200 dark:border-blue-800 transition-all active:scale-95 disabled:opacity-50"
            title="Microsoft Word (.docx) डाउनलोड करें"
          >
            {exportingWord ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
            <span>{exportingWord ? 'सहेज रहे...' : 'Word (.docx)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm transition-all active:scale-95"
            title="प्रिंट करें"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>प्रिंट</span>
          </button>

        </div>

        {/* Right Secondary Actions: Copy, WhatsApp, Save */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          
          <button
            onClick={handleCopy}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition-all shadow-2xs active:scale-95"
            title="WhatsApp पर भेजें"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
              saved
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 border-amber-300'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-amber-700" /> : <BookmarkPlus className="w-4 h-4 text-amber-600" />}
            <span>{saved ? 'ड्राफ्ट सहेजा' : 'ड्राफ्ट सहेजें'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
