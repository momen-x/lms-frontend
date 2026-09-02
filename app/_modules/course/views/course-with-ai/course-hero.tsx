import BackBtn from "@/components/sharing/back-btn";
import {
  Sparkles,
  BarChart2,
  BookOpen,
  Award,
  X,
} from "lucide-react";

interface CourseHeroProps {
  title: string;
  description: string;
  level: string;
  totalLessons: number;
  hasCertificate: boolean;
  onToggleAi: () => void;
  askAi: boolean;
}

export function CourseHero({
  title,
  description,
  level,
  totalLessons,
  hasCertificate,
  onToggleAi,
  askAi,
}: CourseHeroProps) {
  return (
    <div className="space-y-4">
      <BackBtn className="bg-slate-700 text-white w-25 dark:bg-slate-500 "/>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 text-2xl font-bold shadow-md shrink-0">
            {`</>`}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <BarChart2 className="w-3.5 h-3.5 text-purple-500" /> {level}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />{" "}
                {totalLessons} Lessons
              </span>
              {hasCertificate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Certificate
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAi}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm active:scale-95"
          >
            {askAi ? (
              <>
                <Sparkles className="w-4 h-4" /> ask Ai
              </>
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
