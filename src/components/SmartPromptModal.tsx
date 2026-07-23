import React, { useState } from 'react';
import { X, Sparkles, Mic, ArrowRight, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { fetchApi } from '../utils/apiClient';

interface SmartPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAIResult: (result: {
    text?: string;
    department?: string;
    category?: string;
    reason?: string;
    tone?: string;
  }) => void;
}

const SAMPLE_PROMPTS = [
  'प्रधानाचार्य को बुखार के कारण 3 दिन की छुट्टी हेतु प्रार्थना पत्र',
  'बैंक मैनेजर को नया एटीएम कार्ड जारी करने हेतु आवेदन',
  'थाना प्रभारी को मोबाइल फोन गुम होने की रिपोर्ट दर्ज कराने हेतु पत्र',
  'विद्युत विभाग के अधिकारी को अत्यधिक बिजली बिल में सुधार का पत्र',
  'तहसीलदार को निवास एवं जाति प्रमाण पत्र निर्गत करने हेतु आवेदन',
];

export const SmartPromptModal: React.FC<SmartPromptModalProps> = ({
  isOpen,
  onClose,
  onApplyAIResult,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (textToUse?: string) => {
    const finalPrompt = textToUse || prompt;
    if (!finalPrompt.trim()) {
      setError('कृपया अपनी आवश्यकता या विषय संक्षेप में लिखें');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await fetchApi<any>('/api/ai/smart-autofill', {
        method: 'POST',
        body: JSON.stringify({ userPrompt: finalPrompt }),
      });

      onApplyAIResult(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AI सेवा अस्थाई रूप से अनुपलब्ध है। कृपया पुन: प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              AI से बोलकर / लिखकर पत्र बनाएं
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              अपनी आवश्यकता सरल शब्दों में लिखें, Gemini AI बाकी फॉर्म व पत्र स्वतः तैयार कर देगा।
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3 mb-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            क्या बनाना चाहते हैं? (संक्षेप में लिखें)
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="उदा: बैंक प्रबंधक को खोया पासबुक पुनः जारी करने हेतु आवेदन पत्र..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>सुझाव - किसी पर भी क्लिक करें:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {SAMPLE_PROMPTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(sample);
                  handleGenerate(sample);
                }}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-800 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            रद्द करें
          </button>
          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-md shadow-amber-600/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI विश्लेषण कर रहा है...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>पत्र स्वचालित बनाएं</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
