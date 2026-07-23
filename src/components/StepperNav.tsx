import React from 'react';
import { Check, Layers, Building2, FileText, UserCheck, Eye } from 'lucide-react';

interface StepperNavProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxReachedStep: number;
}

const STEPS = [
  { id: 0, label: 'प्रकार', shortLabel: 'प्रकार', icon: Layers },
  { id: 1, label: 'विभाग', shortLabel: 'विभाग', icon: Building2 },
  { id: 2, label: 'विषय', shortLabel: 'विषय', icon: FileText },
  { id: 3, label: 'विवरण', shortLabel: 'विवरण', icon: UserCheck },
  { id: 4, label: 'पूर्वावलोकन', shortLabel: 'पत्र देखें', icon: Eye },
];

export const StepperNav: React.FC<StepperNavProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-2 sm:px-6 shadow-xs">
      <div className="max-w-4xl mx-auto">
        <ol className="flex items-center justify-between w-full">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= maxReachedStep;

            return (
              <li key={step.id} className="flex-1 relative">
                {/* Connecting Line between steps */}
                {idx !== 0 && (
                  <div
                    className={`absolute top-4 sm:top-5 left-[-50%] right-[50%] h-0.5 -z-0 transition-colors ${
                      step.id <= currentStep
                        ? 'bg-amber-600 dark:bg-amber-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}

                <button
                  onClick={() => isAccessible && onStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`group w-full flex flex-col items-center justify-center text-center focus:outline-none transition-all ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  }`}
                >
                  {/* Step Badge Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-100 dark:ring-amber-900/40 shadow-amber-600/20'
                        : isCompleted
                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-amber-300 stroke-[2.5]" />
                    ) : (
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? 'text-white' : ''}`} />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`mt-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                      isCurrent
                        ? 'text-amber-700 dark:text-amber-400 font-bold'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span className="sm:hidden">{step.shortLabel}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
