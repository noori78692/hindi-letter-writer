import React, { useRef } from 'react';
import { StampType } from '../types';
import { Edit3, Check, Type, MoveVertical, Sparkles, PenTool } from 'lucide-react';

interface LetterPaperPreviewProps {
  letterText: string;
  onChangeText: (newText: string) => void;
  isEditing: boolean;
  onToggleEditing: () => void;
  stamp: StampType;
  onChangeStamp: (stamp: StampType) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  lineHeight: number;
  onChangeLineHeight: (height: number) => void;
  signatureText?: string;
  signatureImage?: string;
  onOpenSignatureModal: () => void;
}

export const LetterPaperPreview: React.FC<LetterPaperPreviewProps> = ({
  letterText,
  onChangeText,
  isEditing,
  onToggleEditing,
  stamp,
  onChangeStamp,
  fontSize,
  onChangeFontSize,
  lineHeight,
  onChangeLineHeight,
  signatureText,
  signatureImage,
  onOpenSignatureModal,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);

  const STAMP_CONFIGS: Record<StampType, { label: string; text: string; color: string; border: string }> = {
    none: { label: 'कोई मोहर नहीं', text: '', color: '', border: '' },
    verified: { label: 'सत्यापित (Verified)', text: 'सत्यापित\nप्रति', color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-700 dark:border-emerald-400' },
    approved: { label: 'स्वीकृत (Approved)', text: 'स्वीकृत\nआदेशानुसार', color: 'text-blue-700 dark:text-blue-400', border: 'border-blue-700 dark:border-blue-400' },
    urgent: { label: 'अति आवश्यक (Urgent)', text: 'अति आवश्यक\nशीघ्र कार्यवाही', color: 'text-rose-700 dark:text-rose-400', border: 'border-rose-700 dark:border-rose-400' },
    draft: { label: 'प्रारूप (Draft)', text: 'प्रारूप\nकेवल अवलोकन हेतु', color: 'text-amber-700 dark:text-amber-400', border: 'border-amber-700 dark:border-amber-400' },
    confidential: { label: 'गोपनीय (Confidential)', text: 'गोपनीय\nकार्यालयी प्रयोग', color: 'text-purple-700 dark:text-purple-400', border: 'border-purple-700 dark:border-purple-400' },
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Visual Formatting Toolbar */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        
        {/* Edit toggle */}
        <button
          onClick={onToggleEditing}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isEditing
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'संपादन पूर्ण' : 'सीधे संपादित करें'}</span>
        </button>

        {/* Font Size Selector */}
        <div className="flex items-center space-x-1">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">फॉन्ट:</span>
          <select
            value={fontSize}
            onChange={(e) => onChangeFontSize(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs px-2 py-1 focus:outline-none"
          >
            <option value={13}>छोटा (13px)</option>
            <option value={15}>सामान्य (15px)</option>
            <option value={17}>बड़ा (17px)</option>
            <option value={19}>अति बड़ा (19px)</option>
          </select>
        </div>

        {/* Line Height Selector */}
        <div className="flex items-center space-x-1">
          <MoveVertical className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">दूरी:</span>
          <select
            value={lineHeight}
            onChange={(e) => onChangeLineHeight(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs px-2 py-1 focus:outline-none"
          >
            <option value={1.5}>सघन (1.5)</option>
            <option value={1.8}>मानक (1.8)</option>
            <option value={2.1}>चौड़ा (2.1)</option>
          </select>
        </div>

        {/* Official Stamp Selector */}
        <div className="flex items-center space-x-1">
          <select
            value={stamp}
            onChange={(e) => onChangeStamp(e.target.value as StampType)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs px-2 py-1 focus:outline-none"
          >
            {Object.entries(STAMP_CONFIGS).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Digital Signature Button */}
        <button
          onClick={onOpenSignatureModal}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
        >
          <PenTool className="w-3 h-3 text-amber-600" />
          <span>हस्ताक्षर</span>
        </button>

      </div>

      {/* Printable A4 Paper Layout */}
      <div
        id="print-container"
        className={`paper-a4 w-full max-w-2xl min-h-[640px] sm:min-h-[720px] rounded-lg p-6 sm:p-12 relative transition-all text-slate-900 dark:text-slate-100 border border-amber-200/60 dark:border-slate-800 font-serif-devanagari select-text ${
          isEditing ? 'ring-2 ring-amber-500 ring-offset-2' : ''
        }`}
      >
        {/* Editable Main Letter Body */}
        <div
          ref={editableRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={() => {
            if (editableRef.current) {
              onChangeText(editableRef.current.innerText);
            }
          }}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            whiteSpace: 'pre-wrap',
          }}
          className="outline-none min-h-[500px]"
        >
          {letterText}
        </div>

        {/* Digital Signature Overlay if provided */}
        {(signatureImage || signatureText) && (
          <div className="mt-8 pt-4 flex flex-col items-end text-right font-hind">
            <span className="text-xs text-slate-400 mb-1">आवेदक का डिजिटल हस्ताक्षर:</span>
            {signatureImage ? (
              <img src={signatureImage} alt="Signature" className="h-12 max-w-[160px] object-contain" />
            ) : (
              <span className="text-base font-bold italic text-amber-900 dark:text-amber-300 border-b border-slate-400 px-2 py-0.5">
                {signatureText}
              </span>
            )}
          </div>
        )}

        {/* Official Stamp Overlay */}
        {stamp !== 'none' && STAMP_CONFIGS[stamp] && (
          <div
            className={`absolute right-6 sm:right-12 bottom-12 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 ${
              STAMP_CONFIGS[stamp].border
            } ${
              STAMP_CONFIGS[stamp].color
            } flex items-center justify-center text-center font-bold text-xs sm:text-sm tracking-wider uppercase transform -rotate-12 pointer-events-none opacity-85 select-none animate-stamp font-hind bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px]`}
          >
            <div className="leading-tight whitespace-pre-line">
              {STAMP_CONFIGS[stamp].text}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
