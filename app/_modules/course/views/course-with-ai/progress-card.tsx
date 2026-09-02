"use client";
import { Clock, ArrowRight } from "lucide-react";
import transformingTheDateToATextString from "../../../../../utils/from-date-to-string";
import Link from "next/link";

interface ProgressCardProps {
  progressLessons: number;
  totalLessons: number;
  completeTime?: string | null;
  courseId: string;
}

export function ProgressCard({
  progressLessons,
  totalLessons,
  completeTime,
  courseId,
}: ProgressCardProps) {
  const completedLesson = Math.round(totalLessons * (progressLessons / 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Your Progress
      </h2>
      <div className="flex items-center gap-6 my-4">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600"
              strokeDasharray={`${progressLessons}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-lg">{progressLessons}%</span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
              Complete
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-light text-slate-900 dark:text-slate-100">
            {progressLessons}{" "}
            <span className="font-normal text-slate-500 dark:text-slate-400">
              lessons completed
            </span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalLessons - completedLesson} lessons remaining
          </p>
          {completeTime && (
            <div className="flex items-center  justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" /> completed time:{" "}
              {transformingTheDateToATextString(completeTime)}
            </div>
          )}
        </div>
      </div>
      <Link href={`/courses/${courseId}/learning`}>
        <button className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline gap-1">
          View Course Stats <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
}
