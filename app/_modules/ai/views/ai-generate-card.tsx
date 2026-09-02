"use client";

import { Sparkles, Loader2, RefreshCw } from "lucide-react";

interface AiGenerateProps {
  onGenerate: () => void;
  isLoading: boolean;
  isStudyPlanExisting: boolean;
  title: string;
  description: string;
  btnTitle: string;
}

export function AiGenerateCard({
  onGenerate,
  isLoading,
  isStudyPlanExisting,
  title,
  description,
  btnTitle,
}: AiGenerateProps) {
  const features = [
    "Tailored to your progress",
    "Optimized for your goals",
    "Weekly study schedule",
  ];

  return (
    <div className="bg-linear-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-100 dark:border-purple-900/50 rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-purple-950 dark:text-purple-200">
          {title}
        </h2>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
          AI
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 my-2">
        {description}
      </p>

      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        className="w-full border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onGenerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating...
          </>
        ) : isStudyPlanExisting ? (
          <>
            <RefreshCw className="size-4" />
            Regenerate Plan
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-purple-500" /> {btnTitle}
          </>
        )}
      </button>
    </div>
  );
}
