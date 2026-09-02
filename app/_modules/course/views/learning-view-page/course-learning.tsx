"use client";

import { useMemo, useState } from "react";

import { Loader2 } from "lucide-react";
import LearningSidebar from "./learning-sidebar";
import LearningContent from "./learning-content";
import LearningNavigation from "./learning-navigation";
import QuizLearningContent from "@/app/_modules/quiz-attempt/views/learning-view-quizzes/quiz-learning-content";
import ReviewSection from "@/app/_modules/review/views/review-section";

import { useGetCourseLearning } from "../../hooks/useGetCourseLearning";
import { useUpdateLearningPosition } from "@/app/_modules/enrollment/hooks/useUpdateLearningPosition";
import { useCompleteLesson } from "@/app/_modules/enrollment/hooks/useCompleteLesson";

import {
  getInitialLearningItem,
  type SelectedLearningItem,
} from "./get-initial-learning-item";

interface CourseLearningProps {
  courseId: string;
}

export default function CourseLearning({ courseId }: CourseLearningProps) {
  const { data: course, isLoading, isError } = useGetCourseLearning(courseId);
  const completeLesson = useCompleteLesson();
  const updateLearningPosition = useUpdateLearningPosition();

  const lessons = useMemo(() => {
    if (!course) return [];

    return course.sections.flatMap((section) => section.lessons);
  }, [course]);

  const completedLessonIds = useMemo(() => {
    if (!course?.enrollment) {
      return new Set<string>();
    }

    return new Set(
      course.enrollment.lessonProgress
        .filter((progress) => progress.completed)
        .map((progress) => progress.lessonId),
    );
  }, [course]);

  const firstIncompleteLesson = useMemo(() => {
    return lessons.find((lesson) => !completedLessonIds.has(lesson.id));
  }, [lessons, completedLessonIds]);

  const [selectedItem, setSelectedItem] = useState<SelectedLearningItem | null>(
    null,
  );
  const currentItem = selectedItem ?? (course ? getInitialLearningItem(course) : null);
  const selectedLessonId =
    currentItem?.type === "lesson" ? currentItem.id : null;

  const activeLesson =
    currentItem?.type === "lesson"
      ? (lessons.find((lesson) => lesson.id === selectedLessonId) ??
        firstIncompleteLesson ??
        lessons[0] ??
        null)
      : null;
  const activeQuiz =
    currentItem?.type === "quiz"
      ? (course?.quizzes.find((quiz) => quiz.id === currentItem.id) ?? null)
      : null;

  const selectLearningItem = (item: SelectedLearningItem) => {
    if (!course?.enrollment) return;
    setSelectedItem(item);

    if (item.type === "reviews") return;

    updateLearningPosition.mutate({
      enrollmentId: course.enrollment.id,
      type: item.type,
      itemId: item.id,
    });
  };
  const activeLessonIndex = activeLesson
    ? lessons.findIndex((lesson) => lesson.id === activeLesson.id)
    : -1;

  const previousLesson =
    activeLessonIndex > 0 ? lessons[activeLessonIndex - 1] : null;

  const nextLesson =
    activeLessonIndex >= 0 && activeLessonIndex < lessons.length - 1
      ? lessons[activeLessonIndex + 1]
      : null;

  const remainingLessons = lessons.filter(
    (lesson) => !completedLessonIds.has(lesson.id),
  );
  const handlePrevious = async () => {
    if (previousLesson) {
      selectLearningItem({
        type: "lesson",
        id: previousLesson.id,
      });
    }
  };

  const isLastRemainingUncompletedLesson =
    Boolean(activeLesson) &&
    !completedLessonIds.has(activeLesson!.id) &&
    remainingLessons.length === 1 &&
    remainingLessons[0].id === activeLesson!.id;

  const handleNext = async () => {
    if (!activeLesson || !course?.enrollment || completeLesson.isPending) {
      return;
    }

    const alreadyCompleted = completedLessonIds.has(activeLesson.id);

    if (!alreadyCompleted) {
      await completeLesson.mutateAsync({
        enrollmentId: course.enrollment.id,
        lessonId: activeLesson.id,
      });
    }

    if (isLastRemainingUncompletedLesson) {
      const firstQuiz = course.quizzes[0];

      if (firstQuiz) {
        selectLearningItem({
          type: "quiz",
          id: firstQuiz.id,
        });
      }

      return;
    }

    if (nextLesson) {
      selectLearningItem({
        type: "lesson",
        id: nextLesson.id,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to load course learning content.
        </p>
      </div>
    );
  }

  if (!course.enrollment) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">
          You are not enrolled in this course.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen min-w-0 lg:grid-cols-[320px_minmax(0,1fr)]">
      <LearningSidebar
        course={course}
        activeLessonId={activeLesson?.id ?? null}
        activeQuizId={activeQuiz?.id ?? null}
        reviewsActive={currentItem?.type === "reviews"}
        completedLessonIds={completedLessonIds}
        onLessonSelect={(lessonId) =>
          selectLearningItem({
            type: "lesson",
            id: lessonId,
          })
        }
        onQuizSelect={(quizId) =>
          selectLearningItem({
            type: "quiz",
            id: quizId,
          })
        }
        onReviewsSelect={() => selectLearningItem({ type: "reviews" })}
      />

      <main className="min-w-0">
        {currentItem?.type === "reviews" ? (
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            <ReviewSection
              courseId={course.id}
              canCreateReview={course.enrollment.progress >= 50}
            />
          </div>
        ) : activeQuiz ? (
          <QuizLearningContent quiz={activeQuiz} />
        ) : (
          <>
            <LearningContent lesson={activeLesson} />

            <LearningNavigation
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isCompleting={completeLesson.isPending}
              isLastRemainingUncompletedLesson={
                isLastRemainingUncompletedLesson
              }
            />
          </>
        )}
      </main>
    </div>
  );
}
