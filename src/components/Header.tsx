import React from 'react';
import { Feather, FileText, Sparkles, Clock, Sun, Moon, LayoutTemplate } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenHistory: () => void;
  onOpenTemplates: () => void;
  onOpenAIPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenHistory,
  onOpenTemplates,
  onOpenAIPrompt,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-900/10 shrink-0">
              आ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  हिंदी आवेदन एवं पत्र लेखक
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  AI संचालित
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                शासकीय, बैंकिग, स्कूल व कार्यालयी पत्र निर्माण - 100% सटीक देवनागरी प्रारूप
              </p>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Smart AI Generator Button */}
            <button
              onClick={onOpenAIPrompt}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all transform active:scale-95"
              title="AI से बोलकर/लिखकर पत्र बनाएं"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">AI से बनाएं</span>
              <span className="sm:hidden">AI सहायता</span>
            </button>

            {/* Quick Templates Button */}
            <button
              onClick={onOpenTemplates}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors"
              title="लोकप्रिय पत्र नमूने देखें"
            >
              <LayoutTemplate className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">नमूने / Templates</span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors flex items-center space-x-1.5"
              title="सहेजे गए ड्राफ्ट"
            >
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:inline">इतिहास</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? "लाइट मोड" : "डार्क मोड"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
