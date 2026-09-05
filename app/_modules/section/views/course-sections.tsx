"use client";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import QueryErrorState from "@/components/sharing/query-error-state";
import BackBtn from "@/components/sharing/back-btn";
import { LessonDialogProvider } from "../../lesson/context/lesson-dialog-context";
import SectionCard from "./section-card";
import CreateSection from "./create-section";
import { Button } from "@/components/ui/button";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { MediaDialogProvider } from "../../media/context/media-dialog-context";
import { AiGenerateViewer } from "../../ai/views/ai-generate-viewer";

import { useGetCourseSections } from "../hooks/useGetCourseSections";
import { useGenerateLessonsFromCourse } from "../../ai/hooks/useGenerateLessonsFromCourse";
import { useGetGeneratedLessonsFromCourse } from "../../ai/hooks/useGetGeneratedLessonsFromCourse";

import { toast } from "react-toastify";

import { getErrorMessage } from "@/utils/get-axios-error-message";
interface CourseSectionsProps {
  courseId: string;
}

export default function CourseSections({ courseId }: CourseSectionsProps) {
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(
    new Set(),
  );
  const {
    data: sections,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCourseSections(courseId);
  const {
    mutate: generateLessons,
    isPending: isGenerateLessonPending,
    data: lessonsGenerated,
  } = useGenerateLessonsFromCourse();
  const { data: savedLessons } = useGetGeneratedLessonsFromCourse(courseId);
  const lessonsData =
    lessonsGenerated ??
    (savedLessons
      ? { content: savedLessons.content, finishReason: null }
      : null);
  const handleGenerateCourseQuiz = () => {
    generateLessons(courseId, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The course content hasn’t changed, so the existing AI-generated lessons are still up to date.",
          );
          return;
        }

        toast.success("AI lessons generated from the course successfully.");
      },
      onError: (error) => {
        const errMessage = getErrorMessage(error);
        toast.error(errMessage ?? "Failed to generate quiz. Please try again.");
      },
    });
  };

  const allSectionsExpanded =
    Boolean(sections?.length) &&
    sections!.every((section) => expandedSectionIds.has(section.id));

  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="Failed to load Sections"
        description="We couldn’t load the sections in this course."
        isRetrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <LessonDialogProvider>
      <MediaDialogProvider>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Course Curriculum</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Organize the course content into sections.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-3">
                <BackBtn className="mt-1.5" />
                <CreateSection courseId={courseId} />
              </div>
              <Button
                onClick={handleGenerateCourseQuiz}
                disabled={isGenerateLessonPending}
                variant="outline"
                className="
    border-purple-500/40
    bg-purple-500/5
    text-purple-600
    transition-colors
    hover:border-purple-500/70
    hover:bg-purple-500/10
    hover:text-purple-700
    dark:text-purple-300
    dark:hover:text-purple-200
    mt-5"
              >
                {isGenerateLessonPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    generating...
                  </>
                ) : savedLessons?.content ? (
                  <>
                    <RefreshCw className="size-4" />
                    Regenerate Suggested Lessons
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Make AI Suggest lessons
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {lessonsData && (
            <AiGenerateViewer
              planData={lessonsData}
              title=" Your AI Lessons suggested"
              defaultOpen={false}
            />
          )}
          <CardContent>
            {!sections?.length ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="font-medium">No sections yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the first section to start building the course curriculum.
                </p>
                <CreateSection
                  courseId={courseId}
                  title="Create First Section"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Click a section to show or hide its lessons.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedSectionIds(
                        allSectionsExpanded
                          ? new Set()
                          : new Set(sections.map((section) => section.id)),
                      )
                    }
                  >
                    {allSectionsExpanded ? (
                      <ChevronsDownUp className="size-4" />
                    ) : (
                      <ChevronsUpDown className="size-4" />
                    )}
                    {allSectionsExpanded ? "Collapse all" : "Expand all"}
                  </Button>
                </div>

                {[...sections]
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      isExpanded={expandedSectionIds.has(section.id)}
                      onToggle={() => toggleSection(section.id)}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </MediaDialogProvider>
    </LessonDialogProvider>
  );
}
