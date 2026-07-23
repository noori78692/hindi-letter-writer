import React, { useRef, useState } from 'react';
import { X, Check, Eraser, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (sigText?: string, sigImage?: string) => void;
  currentSignatureText?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
  currentSignatureText = '',
}) => {
  const [typedSig, setTypedSig] = useState(currentSignatureText);
  const [mode, setMode] = useState<'type' | 'draw'>('type');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        onSaveSignature(undefined, dataUrl);
      }
    } else {
      onSaveSignature(typedSig, undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              डिजिटल हस्ताक्षर शामिल करें
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
          <button
            onClick={() => setMode('type')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'type'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            नाम लिखें
          </button>
          <button
            onClick={() => setMode('draw')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'draw'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            स्क्रीन पर ड्रॉ करें
          </button>
        </div>

        {/* Content */}
        {mode === 'type' ? (
          <div className="space-y-3 mb-5">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              अपना नाम या हस्ताक्षर टेक्स्ट लिखें:
            </label>
            <input
              type="text"
              value={typedSig}
              onChange={(e) => setTypedSig(e.target.value)}
              placeholder="उदा: अमित शर्मा"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {typedSig && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center border border-amber-200 dark:border-amber-800">
                <span className="text-xs text-slate-400 block mb-1">पूर्वावलोकन:</span>
                <span className="text-xl font-bold italic font-serif-devanagari text-amber-900 dark:text-amber-300">
                  {typedSig}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">उंगली या माउस से साइन करें:</span>
              <button
                onClick={clearCanvas}
                className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>साफ करें</span>
              </button>
            </div>
            <div className="border border-slate-300 dark:border-slate-700 rounded-xl bg-white touch-none overflow-hidden">
              <canvas
                ref={canvasRef}
                width={360}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            रद्द करें
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
          >
            सहेजें
          </button>
        </div>

      </div>
    </div>
  );
};
