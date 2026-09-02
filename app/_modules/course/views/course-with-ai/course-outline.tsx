"use client";
import { useState } from "react";
import { CheckCircle2, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { useGetCourseLearning } from "../../hooks/useGetCourseLearning";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import QueryErrorState from "@/components/sharing/query-error-state";

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function CourseOutline({ courseId }: { courseId: string }) {
  const {
    data: course,
    isLoading,
    refetch,
    isError,
    isFetching,
  } = useGetCourseLearning(courseId);

  const [activeTab, setActiveTab] = useState<"outline" | "recent">("outline");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (isError || !course) {
    return (
      <QueryErrorState
        title="Failed to load your lesson data, please try again"
        description="We couldn't load your lesson info."
        isRetrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  // Build a flat "recent lessons" list from enrollment progress
  const recentLessons =
    course.enrollment?.lessonProgress
      ?.filter((lp) => lp.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime(),
      )
      .map((lp) => {
        for (const section of course.sections) {
          const lesson = section.lessons.find((l) => l.id === lp.lessonId);
          if (lesson) return lesson;
        }
        return null;
      })
      .filter((l): l is NonNullable<typeof l> => l !== null) ?? [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2">
        <button
          onClick={() => setActiveTab("outline")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "outline"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500"
          }`}
        >
          Course Outline
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "recent"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500"
          }`}
        >
          Recent Lessons
        </button>
      </div>

      {activeTab === "outline" ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {course.sections.map((section) => {
            const isOpen = !!expandedSections[section.id];
            return (
              <div key={section.id} className="p-4">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left font-semibold text-sm hover:text-blue-600"
                >
                  <span className="flex items-center gap-2">
                    {section.title}
                  </span>
                  <span className="flex items-center gap-4 text-xs font-normal text-slate-500">
                    {section.lessons.length} lesson
                    {section.lessons.length !== 1 ? "s" : ""}
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {isOpen && section.lessons.length > 0 && (
                  <div className="mt-3 space-y-2 pl-2">
                    {section.lessons.map((lesson) => {
                      const isCompleted =
                        course.enrollment?.lessonProgress?.some(
                          (lp) => lp.lessonId === lesson.id && lp.completed,
                        ) ?? false;

                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">
                              {formatDuration(lesson.duration)}
                            </span>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentLessons.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              No completed lessons yet.
            </p>
          ) : (
            recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-2.5 px-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {lesson.title}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
