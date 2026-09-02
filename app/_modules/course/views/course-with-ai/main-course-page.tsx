"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { CourseHero } from "./course-hero";
import { ProgressCard } from "./progress-card";
import { AiGenerateCard } from "../../../ai/views/ai-generate-card";
import { AiGenerateViewer } from "../../../ai/views/ai-generate-viewer";
import { CourseOutline } from "./course-outline";
import QueryErrorState from "@/components/sharing/query-error-state";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { AiCourseAssistantSidebar } from "@/app/_modules/ai/views/ai-course-assistant-sidebar";

import { useGetCourse } from "../../hooks/useGetCourse";
import { useGetMyEnrollmentByCourse } from "@/app/_modules/enrollment/hooks/useGetMyEnrollmentByCourse";
import { useGenerateStudentStudyPlan } from "@/app/_modules/ai/hooks/useGenerateStudentStudyPlan";
import { useGetGeneratedStudyPlan } from "@/app/_modules/ai/hooks/useGetGeneratedStudyPlan";
import { AiGeneratingSkeleton } from "../learning-view-page/learning-content";
import { getErrorMessage } from "@/utils/get-axios-error-message";

export default function MainCoursePage({ id }: { id: string }) {
  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
    refetch: refetchCourse,
    isFetched: isFetchedCourse,
  } = useGetCourse(id);
  const {
    data: enrollment,
    isLoading: isEnrollmentLoading,
    isError: isEnrollmentError,
    refetch: EnrollmentRefetch,
    isFetched: isEnrollmentRefetch,
  } = useGetMyEnrollmentByCourse(id);
  const { mutate: generatePlan, isPending } = useGenerateStudentStudyPlan();
  const {
    data: savedPlan,
    isLoading: isSavedPlanLoading,
    isError: isSavedPlanError,
  } = useGetGeneratedStudyPlan(id);

  const [isAiOpen, setIsAiOpen] = useState(true);
  if (isCourseLoading) {
    return <CardSkeleton />;
  }
  if (isCourseError || !course) {
    return (
      <QueryErrorState
        description="error to load course"
        title="Can't load the course"
        isRetrying={isFetchedCourse}
        onRetry={() => refetchCourse()}
      />
    );
  }

  const handleGeneratePlan = () => {
    generatePlan(id, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "Your course progress and learning context haven’t changed, so the existing AI study plan is still up to date.",
          );
          return;
        }

        toast.success("AI study plan generated successfully.");
      },
      onError: (error) => {
        toast.error(
          getErrorMessage(error) ??
            "Failed to generate study plan. Please try again.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <CourseHero
            title={course.title}
            description={course.description}
            level={course.level}
            totalLessons={course.lessonsCount}
            hasCertificate={true}
            onToggleAi={() => setIsAiOpen((prev) => !prev)}
            askAi={!isAiOpen}
          />

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEnrollmentLoading ? (
              <CardSkeleton />
            ) : !enrollment || isEnrollmentError ? (
              <QueryErrorState
                title="Failed to load your data, please try again"
                description="We couldn't load your data."
                isRetrying={isEnrollmentRefetch}
                onRetry={() => EnrollmentRefetch()}
              />
            ) : (
              <ProgressCard
                courseId={id}
                progressLessons={enrollment.progress}
                totalLessons={course.lessonsCount}
                completeTime={enrollment.completedAt}
              />
            )}

            <AiGenerateCard
              onGenerate={handleGeneratePlan}
              isLoading={isPending}
              isStudyPlanExisting={!!savedPlan?.plan}
              title={"Generate Study Plan"}
              description={
                "Let AI create a personalized study plan based on your goals and schedule."
              }
              btnTitle={"Generate Plan"}
            />
          </div>

          <div className="mt-7">
            {/* Render Generated AI Study Plan View */}

            {isSavedPlanLoading ? (
              <AiGeneratingSkeleton />
            ) : isSavedPlanError ? (
              <div className="rounded-xl border border-dashed p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  No saved plan is available yet.
                </p>
              </div>
            ) : savedPlan && savedPlan.plan ? (
              <AiGenerateViewer
                planData={{ content: savedPlan.plan, finishReason: null }}
                title="AI Lesson Summary"
              />
            ) : null}
          </div>

          <CourseOutline courseId={id} />
        </main>

        {/* Sidebar Drawer */}
        {isAiOpen && enrollment && <AiCourseAssistantSidebar courseId={id} />}
      </div>
    </div>
  );
}
