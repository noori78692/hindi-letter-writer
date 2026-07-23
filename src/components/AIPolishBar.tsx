import React, { useState } from 'react';
import { Sparkles, Loader2, Check, Scale, Languages, Minimize2, Maximize2, ShieldCheck, Feather } from 'lucide-react';
import { AIAction } from '../types';
import { fetchApi } from '../utils/apiClient';

interface AIPolishBarProps {
  letterText: string;
  onUpdateLetterText: (newText: string) => void;
}

export const AIPolishBar: React.FC<AIPolishBarProps> = ({
  letterText,
  onUpdateLetterText,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleAction = async (action: AIAction | 'custom', customInstruction?: string) => {
    if (!letterText.trim()) return;

    setLoadingAction(action);
    setStatusMessage('Gemini AI पत्र परिमार्जित कर रहा है...');

    try {
      const data = await fetchApi<{ text?: string }>('/api/ai/enhance', {
        method: 'POST',
        body: JSON.stringify({
          action: action === 'custom' ? undefined : action,
          instructions: action === 'custom' ? customInstruction : undefined,
          text: letterText,
        }),
      });

      if (data.text) {
        onUpdateLetterText(data.text);
        setStatusMessage('सफलतापूर्वक अपडेट किया गया!');
        setTimeout(() => setStatusMessage(''), 2500);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`त्रुटि: ${err.message || 'AI प्रतिक्रिया नहीं दे सका'}`);
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setLoadingAction(null);
    }
  };

  const POLISH_BUTTONS: Array<{ id: AIAction; label: string; icon: any }> = [
    { id: 'formal', label: 'अत्यंत औपचारिक', icon: Scale },
    { id: 'simple', label: 'सरल सुबोध', icon: Feather },
    { id: 'grammar', label: 'व्याकरण सुधारें', icon: Check },
    { id: 'legal', label: 'शासकीय/कानूनी शब्द', icon: ShieldCheck },
    { id: 'short', label: 'संक्षिप्त करें', icon: Minimize2 },
    { id: 'long', label: 'विस्तृत करें', icon: Maximize2 },
    { id: 'english', label: 'English अनुवाद', icon: Languages },
    { id: 'hindi', label: 'हिंदी में अनुवाद', icon: Languages },
  ];

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 shadow-lg border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-amber-300">
            AI स्मार्ट सुधार एवं अनुवाद
          </span>
        </div>
        {statusMessage && (
          <span className="text-xs font-medium text-amber-400 animate-pulse">
            {statusMessage}
          </span>
        )}
      </div>

      {/* Preset Action Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {POLISH_BUTTONS.map((btn) => {
          const Icon = btn.icon;
          const isLoading = loadingAction === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => handleAction(btn.id)}
              disabled={!!loadingAction}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-amber-600/90 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/60 hover:border-amber-500/80 transition-all disabled:opacity-50 text-left active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
              ) : (
                <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Instruction Toggle */}
      <div>
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 flex items-center space-x-1"
          >
            <span>+ विशेष AI निर्देश दें (Custom prompt)</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="उदा: इसमें 2 दिन का अतिरिक्त समय जोड़ें और विनम्र रहें..."
              className="grow px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => {
                if (customPrompt.trim()) {
                  handleAction('custom', customPrompt);
                }
              }}
              disabled={!customPrompt.trim() || !!loadingAction}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium disabled:opacity-50"
            >
              लागू करें
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
