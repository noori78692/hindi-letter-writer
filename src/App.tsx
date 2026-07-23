import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { fetchApi } from './utils/apiClient';
import { Header } from './components/Header';
import { StepperNav } from './components/StepperNav';
import { SmartPromptModal } from './components/SmartPromptModal';
import { TemplatesModal } from './components/TemplatesModal';
import { AIPolishBar } from './components/AIPolishBar';
import { LetterPaperPreview } from './components/LetterPaperPreview';
import { ExportToolbar } from './components/ExportToolbar';
import { DraftsDrawer } from './components/DraftsDrawer';
import { SignatureModal } from './components/SignatureModal';

import { DEPARTMENTS, CATEGORIES, TONE_STYLES } from './data/departmentsAndCategories';
import { ApplicationType, ToneType, StampType, FormFields, DraftItem, TemplateItem } from './types';

import {
  FileText,
  Building2,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  RotateCcw,
  Eye,
  Edit,
  Wand2,
  Briefcase,
  Hash,
  PenTool,
  WifiOff,
} from 'lucide-react';

export default function App() {
  // Network online status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Step state (0: Type, 1: Department, 2: Category, 3: Form, 4: Preview)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(0);

  // Form values
  const [type, setType] = useState<ApplicationType>('application');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [customDept, setCustomDept] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [customCat, setCustomCat] = useState<string>('');
  const [tone, setTone] = useState<ToneType>('formal');

  const [fields, setFields] = useState<FormFields>({
    name: '',
    fatherName: '',
    gender: 'पुरुष',
    address: '',
    mobile: '',
    email: '',
    officerName: '',
    date: new Date().toISOString().slice(0, 10),
    reason: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    occupation: '',
    idNumber: '',
    duration: '',
    refNumber: '',
    signatureText: '',
    signatureImage: '',
  });

  // Preview & Formatting State
  const [letterText, setLetterText] = useState<string>('');
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [stamp, setStamp] = useState<StampType>('none');
  const [fontSize, setFontSize] = useState<number>(15);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Modals & Panels
  const [isAIPromptOpen, setIsAIPromptOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);

  // Helper functions to open modals with history push for hardware/browser back button
  const openAIPrompt = () => {
    window.history.pushState({ step: currentStep, modal: 'aiPrompt' }, '');
    setIsAIPromptOpen(true);
  };
  const closeAIPrompt = () => {
    if (window.history.state?.modal === 'aiPrompt') {
      window.history.back();
    } else {
      setIsAIPromptOpen(false);
    }
  };

  const openTemplates = () => {
    window.history.pushState({ step: currentStep, modal: 'templates' }, '');
    setIsTemplatesOpen(true);
  };
  const closeTemplates = () => {
    if (window.history.state?.modal === 'templates') {
      window.history.back();
    } else {
      setIsTemplatesOpen(false);
    }
  };

  const openHistory = () => {
    window.history.pushState({ step: currentStep, modal: 'history' }, '');
    setIsHistoryOpen(true);
  };
  const closeHistory = () => {
    if (window.history.state?.modal === 'history') {
      window.history.back();
    } else {
      setIsHistoryOpen(false);
    }
  };

  const openSignatureModal = () => {
    window.history.pushState({ step: currentStep, modal: 'signature' }, '');
    setIsSignatureModalOpen(true);
  };
  const closeSignatureModal = () => {
    if (window.history.state?.modal === 'signature') {
      window.history.back();
    } else {
      setIsSignatureModalOpen(false);
    }
  };

  // Drafts LocalStorage
  const [drafts, setDrafts] = useState<DraftItem[]>(() => {
    try {
      const saved = localStorage.getItem('hindi_letter_drafts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search terms for steps
  const [deptSearch, setDeptSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState<string>('');

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Save drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hindi_letter_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error(e);
    }
  }, [drafts]);

  // Synchronize browser history popstate (Browser / Smartphone Swipe / Hardware back button)
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ step: 0, modal: null }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      // Check modals first
      if (isAIPromptOpen) {
        setIsAIPromptOpen(false);
        return;
      }
      if (isTemplatesOpen) {
        setIsTemplatesOpen(false);
        return;
      }
      if (isHistoryOpen) {
        setIsHistoryOpen(false);
        return;
      }
      if (isSignatureModalOpen) {
        setIsSignatureModalOpen(false);
        return;
      }

      // Handle step navigation on back
      const state = event.state;
      if (state && typeof state.step === 'number') {
        setCurrentStep(state.step);
      } else {
        setCurrentStep((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [
    isAIPromptOpen,
    isTemplatesOpen,
    isHistoryOpen,
    isSignatureModalOpen,
  ]);

  // Capacitor Android Hardware Back Button Handler
  useEffect(() => {
    let listenerHandler: any;

    const initBackButton = async () => {
      try {
        listenerHandler = await CapacitorApp.addListener('backButton', () => {
          if (isAIPromptOpen || isTemplatesOpen || isHistoryOpen || isSignatureModalOpen) {
            window.history.back();
          } else if (currentStep > 0) {
            window.history.back();
          } else {
            CapacitorApp.exitApp();
          }
        });
      } catch (err) {
        // Not running inside native Capacitor wrapper
      }
    };

    initBackButton();

    return () => {
      if (listenerHandler && typeof listenerHandler.remove === 'function') {
        listenerHandler.remove();
      }
    };
  }, [
    isAIPromptOpen,
    isTemplatesOpen,
    isHistoryOpen,
    isSignatureModalOpen,
    currentStep,
  ]);

  // Navigate step
  const goToStep = (step: number, pushHistory = true) => {
    if (pushHistory && step !== currentStep) {
      window.history.pushState({ step, modal: null }, '');
    }
    setCurrentStep(step);
    if (step === 4) {
      setMobileTab('preview');
    }
    if (step > maxReachedStep) {
      setMaxReachedStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build local structured letter
  const constructLetterText = (
    deptName: string,
    catName: string,
    toneKey: ToneType,
    f: FormFields
  ): string => {
    const toneCfg = TONE_STYLES[toneKey] || TONE_STYLES.formal;
    const isFemale = f.gender === 'महिला';

    const putraWord = isFemale ? 'पुत्री' : 'पुत्र';
    const abhariWord = isFemale ? 'आभारी रहूंगी' : 'आभारी रहूंगा';
    const bhavdiyaWord = isFemale ? 'भवदीया' : 'भवदीय';

    const deptLine = f.officerName
      ? `सेवा में,\n${f.officerName}\n${deptName}`
      : `सेवा में,\nश्रीमान ${deptName} महोदय`;

    const locationLine = [f.village, f.district, f.state, f.pincode]
      .filter(Boolean)
      .join(', ');

    const dateFormatted = new Date(f.date || Date.now()).toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const subjectLine = `विषय: ${catName}${f.reason ? ' के संबंध में।' : '। '}`;

    const introParagraph = `सविनय निवेदन है कि मैं ${f.name || '[आपका नाम]'}, ${putraWord} श्री ${
      f.fatherName || '[पिता/पति का नाम]'
    }, निवासी ${f.address || '[स्थान/पता]'} का स्थायी निवासी हूं।`;

    const reasonParagraph = f.reason
      ? f.reason.trim()
      : 'मैं निम्नलिखित विषय के संदर्भ में आपसे आदरपूर्वक निवेदन प्रस्तुत कर रहा/रही हूं।';

    const durationLine = f.duration ? `अवधि: ${f.duration}` : '';
    const refLine = f.refNumber || f.idNumber ? `संदर्भ / आईडी संख्या: ${f.refNumber || f.idNumber}` : '';

    const extraBlock = [durationLine, refLine].filter(Boolean).join('\n');

    const conclusionParagraph = `अतः आपसे विनम्र प्रार्थना है कि उक्त मामले में संज्ञान लेते हुए आवश्यक एवं उचित कार्यवाही करने की कृपा करें। इस हेतु मैं सदैव आपका/आपकी ${abhariWord}।`;

    const closingBlock = [
      toneCfg.closing,
      '',
      bhavdiyaWord,
      `नाम: ${f.name || '[आपका नाम]'}`,
      `पिता/पति का नाम: ${f.fatherName || '[पिता का नाम]'}`,
      `पता: ${f.address || '[पूरा पता]'}`,
      `मोबाइल नंबर: ${f.mobile || '[मोबाइल]'}`
    ];

    if (f.email) closingBlock.push(`ईमेल: ${f.email}`);
    closingBlock.push(`दिनांक: ${dateFormatted}`);

    return [
      deptLine,
      locationLine ? `${locationLine}` : '',
      '',
      `दिनांक: ${dateFormatted}`,
      '',
      subjectLine,
      '',
      toneCfg.salutation,
      '',
      introParagraph,
      '',
      reasonParagraph,
      extraBlock ? `\n${extraBlock}\n` : '',
      '',
      conclusionParagraph,
      '',
      ...closingBlock,
    ]
      .filter((line) => line !== null && line !== undefined)
      .join('\n');
  };

  // Handle Generate Letter
  const handleGenerateLetter = async () => {
    const finalDept = selectedDept === 'अन्य विभाग' ? customDept : selectedDept;
    const finalCat = selectedCat === 'अन्य विशेष विषय' ? customCat : selectedCat;

    setIsGenerating(true);

    try {
      // Call Gemini AI server route via fetchApi
      const data = await fetchApi<{ text?: string }>('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({
          type,
          department: finalDept,
          category: finalCat,
          fields,
          tone,
        }),
      });

      if (data && data.text) {
        setLetterText(data.text);
        setAiNotice('');
        goToStep(4);
        setIsGenerating(false);
        return;
      }
    } catch (e: any) {
      console.warn('AI endpoint unavailable or quota reached, using standard local renderer:', e);
      setAiNotice(
        e.message?.includes('Quota') || e.message?.includes('कोटा')
          ? 'AI अनुरोध सीमा समाप्त होने के कारण मानक शुद्ध प्रारूप में पत्र तैयार किया गया है।'
          : 'नेटवर्क/AI अनुपलब्ध होने के कारण मानक शुद्ध प्रारूप में पत्र तैयार किया गया है।'
      );
      setTimeout(() => setAiNotice(''), 6000);
    }

    // Fallback if AI endpoint fails or user is offline
    const text = constructLetterText(finalDept, finalCat, tone, fields);
    setLetterText(text);
    goToStep(4);
    setIsGenerating(false);
  };

  // Load Template
  const handleSelectTemplate = (tpl: TemplateItem) => {
    setType(tpl.type);
    setSelectedDept(tpl.department);
    setSelectedCat(tpl.category);
    setTone(tpl.tone);
    setFields((prev) => ({
      ...prev,
      ...tpl.sampleFields,
    }));
    const text = constructLetterText(
      tpl.department,
      tpl.category,
      tpl.tone,
      { ...fields, ...tpl.sampleFields } as FormFields
    );
    setLetterText(text);
    goToStep(4);
  };

  // Apply AI Smart Prompt Result
  const handleApplyAIResult = (result: any) => {
    if (result.department) setSelectedDept(result.department);
    if (result.category) setSelectedCat(result.category);
    if (result.tone) setTone(result.tone);
    if (result.reason) {
      setFields((prev) => ({
        ...prev,
        reason: result.reason,
      }));
    }
    if (result.text) {
      setLetterText(result.text);
      goToStep(4);
    } else {
      goToStep(3);
    }
  };

  // Save Draft
  const handleSaveDraft = () => {
    const finalDept = selectedDept === 'अन्य विभाग' ? customDept : selectedDept;
    const finalCat = selectedCat === 'अन्य विशेष विषय' ? customCat : selectedCat;

    const newDraft: DraftItem = {
      id: 'draft_' + Date.now(),
      title: finalCat || 'आवेदन पत्र',
      department: finalDept || 'संबंधित विभाग',
      category: finalCat || 'सामान्य',
      savedAt: new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      letterText: letterText,
      snapshot: {
        type,
        department: selectedDept,
        customDepartment: customDept,
        category: selectedCat,
        customCategory: customCat,
        tone,
        fields,
        stamp,
        fontSize,
        lineHeight,
      },
    };

    setDrafts((prev) => [newDraft, ...prev]);
  };

  const handleLoadDraft = (draft: DraftItem) => {
    const s = draft.snapshot;
    setType(s.type);
    setSelectedDept(s.department);
    setCustomDept(s.customDepartment || '');
    setSelectedCat(s.category);
    setCustomCat(s.customCategory || '');
    setTone(s.tone);
    setFields(s.fields);
    setStamp(s.stamp || 'none');
    setFontSize(s.fontSize || 15);
    setLineHeight(s.lineHeight || 1.8);
    setLetterText(draft.letterText);
    goToStep(4);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllDrafts = () => {
    if (confirm('क्या आप निश्चित रूप से सभी सहेजे गए ड्राफ्ट हटाना चाहते हैं?')) {
      setDrafts([]);
    }
  };

  // Filtered lists
  const filteredDepts = DEPARTMENTS.filter(
    (d) => d.name.includes(deptSearch) || d.description.includes(deptSearch)
  );

  const filteredCats = CATEGORIES.filter(
    (c) => c.name.includes(catSearch) || c.description.includes(catSearch)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-hind transition-colors">
      
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenHistory={openHistory}
        onOpenTemplates={openTemplates}
        onOpenAIPrompt={openAIPrompt}
      />

      {/* Offline Status Warning Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>आप ऑफ़लाइन हैं। आप स्थानीय टेम्पलेट का उपयोग करके पत्र बना सकते हैं और डाउनलोड कर सकते हैं।</span>
        </div>
      )}

      {/* AI Notice Banner (Quota fallback / network notice) */}
      {aiNotice && (
        <div className="bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 text-center flex items-center justify-center space-x-2 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{aiNotice}</span>
        </div>
      )}

      {/* Stepper Navigation */}
      <StepperNav
        currentStep={currentStep}
        onStepClick={goToStep}
        maxReachedStep={maxReachedStep}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 pb-20">
        
        {/* STEP 0: TYPE SELECTION */}
        {currentStep === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs animate-fade-in">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                चरण 1 / 5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                आप क्या तैयार करना चाहते हैं?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                नीचे दिए गए विकल्पों में से चयन करें या AI सहायता का उपयोग करें
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              
              {/* Option 1: Application */}
              <div
                onClick={() => {
                  setType('application');
                  goToStep(1);
                }}
                className={`group border-2 rounded-2xl p-6 cursor-pointer transition-all shadow-xs hover:shadow-md flex items-start space-x-4 ${
                  type === 'application'
                    ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-900/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform">
                  अ
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      नया औपचारिक आवेदन (Application)
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    जिलाधिकारी, बैंक, पुलिस, स्कूल, बिजली विभाग या किसी भी सरकारी/निजी कार्यालय हेतु
                  </p>
                </div>
              </div>

              {/* Option 2: Letter */}
              <div
                onClick={() => {
                  setType('letter');
                  goToStep(1);
                }}
                className={`group border-2 rounded-2xl p-6 cursor-pointer transition-all shadow-xs hover:shadow-md flex items-start space-x-4 ${
                  type === 'letter'
                    ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-900/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform">
                  प
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      सामान्य/व्यावसायिक पत्र (Formal Letter)
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    कंपनी पत्राचार, जॉब एप्लीकेशन, त्यागपत्र, धन्यवाद पत्र, अनुशंसा एवं एनओसी पत्र
                  </p>
                </div>
              </div>

            </div>

            {/* Quick AI Prompt Trigger */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between bg-amber-50/60 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    क्या आप बोलकर/लिखकर पत्र बनाना चाहते हैं?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    AI स्वचालित रूप से विभाग और विषय की पहचान कर पूरा पत्र लिख देगा।
                  </p>
                </div>
              </div>
              <button
                onClick={openAIPrompt}
                className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors shrink-0"
              >
                AI से अभी बनाएं
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: DEPARTMENT SELECTION */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs animate-fade-in">
            
            {/* Header & Back */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => goToStep(0)}
                className="flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पीछे जाएं</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">चरण 2 / 5</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                विभाग या कार्यालय चुनें
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                पत्र/आवेदन किसे संबोधित है? सूची में से चुनें या अपना विभाग लिखें
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="विभाग खोजें: जैसे 'तहसीलदार', 'थाना प्रभारी', 'बैंक', 'विद्युत', 'नगर निगम'..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-6 max-h-96 overflow-y-auto pr-1">
              {filteredDepts.map((dept) => {
                const isSelected = selectedDept === dept.name;

                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSelectedDept(dept.name);
                      if (dept.name !== 'अन्य विभाग') {
                        setTimeout(() => goToStep(2), 150);
                      }
                    }}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-900/30 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/60'
                    }`}
                  >
                    <div>
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-1.5">
                        {dept.categoryGroup}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {dept.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                      {dept.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Dept Entry */}
            {selectedDept === 'अन्य विभाग' && (
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-6">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  विभाग का नाम लिखें: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="उदा: वन विभाग / महिला कल्याण अधिकारी / जल संस्थान"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Continue button */}
            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  if (!selectedDept) return;
                  if (selectedDept === 'अन्य विभाग' && !customDept.trim()) return;
                  goToStep(2);
                }}
                disabled={!selectedDept || (selectedDept === 'अन्य विभाग' && !customDept.trim())}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
              >
                <span>आगे बढ़ें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: CATEGORY / SUBJECT SELECTION */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => goToStep(1)}
                className="flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>विभाग बदलें ({selectedDept === 'अन्य विभाग' ? customDept : selectedDept})</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">चरण 3 / 5</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                विषय / आवेदन श्रेणी चुनें
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                आवेदन किस प्रयोजन के लिए है? नीचे में से चुनें या अपना विषय लिखें
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="विषय खोजें: जैसे 'अवकाश', 'फीस माफी', 'राशन कार्ड', 'पेंशन', 'एफआईआर'..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-96 overflow-y-auto pr-1">
              {filteredCats.map((cat) => {
                const isSelected = selectedCat === cat.name;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCat(cat.name);
                      if (cat.name !== 'अन्य विशेष विषय') {
                        setTimeout(() => goToStep(3), 150);
                      }
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-900/30 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/60'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Subject Input */}
            {selectedCat === 'अन्य विशेष विषय' && (
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-6">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  विषय की पंक्ति लिखें: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value)}
                  placeholder="उदा: छात्रावास कक्ष आवंटन / नया नल कनेक्शन लगाने हेतु"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Continue Button */}
            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  if (!selectedCat) return;
                  if (selectedCat === 'अन्य विशेष विषय' && !customCat.trim()) return;
                  goToStep(3);
                }}
                disabled={!selectedCat || (selectedCat === 'अन्य विशेष विषय' && !customCat.trim())}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
              >
                <span>विवरण भरें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: FORM DETAILS INPUT */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => goToStep(2)}
                className="flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>विषय बदलें</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">चरण 4 / 5</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                अपना विवरण भरें
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                पत्र में सही व्याकरण व लिंग अनुसार संबोधन सुनिश्चित करने के लिए आवश्यक जानकारी दें
              </p>
            </div>

            {/* Form Fields Grid */}
            <div className="space-y-4 mb-6">
              
              {/* Row 1: Name & Father Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    आपका पूरा नाम: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={fields.name}
                      onChange={(e) => setFields({ ...fields, name: e.target.value })}
                      placeholder="उदा: अमित कुमार शर्मा"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    पिता / पति का नाम: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fields.fatherName}
                    onChange={(e) => setFields({ ...fields, fatherName: e.target.value })}
                    placeholder="उदा: श्री रामेश्वर शर्मा"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Gender & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    लिंग (सही व्याकरण हेतु):
                  </label>
                  <select
                    value={fields.gender}
                    onChange={(e) => setFields({ ...fields, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="पुरुष">पुरुष (भवदीय / पुत्र / आभारी रहूंगा)</option>
                    <option value="महिला">महिला (भवदीया / पुत्री / आभारी रहूंगी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    आवेदन की तिथि:
                  </label>
                  <input
                    type="date"
                    value={fields.date}
                    onChange={(e) => setFields({ ...fields, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  पूरा स्थायी पता: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <textarea
                    rows={2}
                    value={fields.address}
                    onChange={(e) => setFields({ ...fields, address: e.target.value })}
                    placeholder="उदा: मकान नं. 45, गांधी नगर, वाराणसी, उत्तर प्रदेश"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Row 4: Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      मोबाइल नंबर: <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[11px] font-mono ${fields.mobile.length === 10 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                      {fields.mobile.length}/10 अंक
                    </span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={fields.mobile}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFields({ ...fields, mobile: digitsOnly });
                      }}
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ईमेल आईडी (वैकल्पिक):
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={fields.email}
                      onChange={(e) => setFields({ ...fields, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Extra Optional Row: Officer Name / Account ID / Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    विशेष अधिकारी का नाम (यदि हो):
                  </label>
                  <input
                    type="text"
                    value={fields.officerName}
                    onChange={(e) => setFields({ ...fields, officerName: e.target.value })}
                    placeholder="उदा: डॉ. ए. के. गुप्ता"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    खाता / कनेक्शन / संदर्भ संख्या:
                  </label>
                  <input
                    type="text"
                    value={fields.idNumber}
                    onChange={(e) => setFields({ ...fields, idNumber: e.target.value })}
                    placeholder="उदा: खाता नं. / मीटर नं."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    अवधि (छुट्टी/कार्य हेतु):
                  </label>
                  <input
                    type="text"
                    value={fields.duration}
                    onChange={(e) => setFields({ ...fields, duration: e.target.value })}
                    placeholder="उदा: 3 दिन (25/07 से 27/07 तक)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Main Reason Description */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  आवेदन का मुख्य कारण / विवरण: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={fields.reason}
                  onChange={(e) => setFields({ ...fields, reason: e.target.value })}
                  placeholder="संक्षेप में लिखें कि आप क्या निवेदन करना चाहते हैं। उदाहरण: मुझे कल रात से तेज बुखार है, डॉक्टर ने 3 दिन आराम की सलाह दी है।"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Tone Style Pill Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  भाषा एवं शैली (Tone):
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TONE_STYLES).map(([key, tStyle]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTone(key as ToneType)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        tone === key
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {tStyle.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => goToStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:underline"
              >
                ← विषय बदलें
              </button>

              <button
                onClick={handleGenerateLetter}
                disabled={!fields.name || !fields.fatherName || !fields.address || !fields.mobile || !fields.reason || isGenerating}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isGenerating ? 'AI पत्र लिख रहा है...' : '✨ पत्र तैयार करें (Preview)'}</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: PREVIEW & FINAL EXPORT */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Mobile Tab Switcher */}
            <div className="sm:hidden flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-3">
              <button
                onClick={() => setMobileTab('form')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  mobileTab === 'form' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                विवरण / AI सुधार
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  mobileTab === 'preview' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                पत्र पूर्वावलोकन (A4 Paper)
              </button>
            </div>

            {/* Export Toolbar at top */}
            <ExportToolbar
              letterText={letterText}
              categoryTitle={selectedCat === 'अन्य विशेष विषय' ? customCat : selectedCat}
              onSaveDraft={handleSaveDraft}
            />

            {/* Main Split Grid (Form/AI Controls on Left, Live Paper Preview on Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form Adjustments & AI Polish */}
              <div className={`lg:col-span-5 space-y-4 ${mobileTab === 'preview' ? 'hidden sm:block' : 'block'}`}>
                
                {/* AI Polish Bar */}
                <AIPolishBar
                  letterText={letterText}
                  onUpdateLetterText={(newText) => setLetterText(newText)}
                />

                {/* Edit metadata panel */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      पत्र सारांश एवं नियंत्रण
                    </h3>
                    <button
                      onClick={() => goToStep(3)}
                      className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      विवरण बदलें
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <p><span className="font-semibold">विभाग:</span> {selectedDept === 'अन्य विभाग' ? customDept : selectedDept}</p>
                    <p><span className="font-semibold">विषय:</span> {selectedCat === 'अन्य विशेष विषय' ? customCat : selectedCat}</p>
                    <p><span className="font-semibold">आवेदक:</span> {fields.name} ({fields.gender})</p>
                    <p><span className="font-semibold">संपर्क:</span> {fields.mobile}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCurrentStep(0);
                        setMaxReachedStep(0);
                      }}
                      className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>शुरुआत से नया पत्र बनाएं</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Printable Paper */}
              <div className={`lg:col-span-7 ${mobileTab === 'form' ? 'hidden sm:block' : 'block'}`}>
                <LetterPaperPreview
                  letterText={letterText}
                  onChangeText={(newText) => setLetterText(newText)}
                  isEditing={isEditingText}
                  onToggleEditing={() => setIsEditingText(!isEditingText)}
                  stamp={stamp}
                  onChangeStamp={setStamp}
                  fontSize={fontSize}
                  onChangeFontSize={setFontSize}
                  lineHeight={lineHeight}
                  onChangeLineHeight={setLineHeight}
                  signatureText={fields.signatureText}
                  signatureImage={fields.signatureImage}
                  onOpenSignatureModal={openSignatureModal}
                />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODALS */}
      <SmartPromptModal
        isOpen={isAIPromptOpen}
        onClose={closeAIPrompt}
        onApplyAIResult={handleApplyAIResult}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={closeTemplates}
        onSelectTemplate={handleSelectTemplate}
      />

      <DraftsDrawer
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        onClearAllDrafts={handleClearAllDrafts}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={closeSignatureModal}
        currentSignatureText={fields.signatureText}
        onSaveSignature={(sigText, sigImage) => {
          setFields((prev) => ({
            ...prev,
            signatureText: sigText,
            signatureImage: sigImage,
          }));
        }}
      />

    </div>
  );
}
