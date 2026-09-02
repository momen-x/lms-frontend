"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  Play,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useGetMyEnrollments } from "../../enrollment/hooks/useGetMyEnrollments";
import { useGetUserEnrollmentStats } from "../../enrollment/hooks/useGetUserEnrollmentStats";

// Hooks & Types

type TabType = "all" | "in-progress" | "completed";

export default function MyLearningView() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Fetch real data
  const { data: enrollments = [], isLoading: isEnrollmentsLoading } =
    useGetMyEnrollments();
  const { data: stats, isLoading: isStatsLoading } =
    useGetUserEnrollmentStats();

  // Filter enrollments based on active tab
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const progress = item.progress ?? 0;
      if (activeTab === "in-progress") return progress > 0 && progress < 100;
      if (activeTab === "completed") return progress === 100;
      return true; // 'all'
    });
  }, [enrollments, activeTab]);

  // Last accessed course for top hero card
  const continueCourse =
    enrollments.find((e) => (e.progress ?? 0) < 100) || enrollments[0];

  const continueLearHref =
    continueCourse && continueCourse
      ? `/courses/${continueCourse.courseId}/learning`
      : " ";

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      {/* Header & Stats Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            My Learning
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your enrolled courses and continue where you left off.
          </p>
        </div>

        {/* Top Right Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Enrolled */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm min-w-30">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BookOpen className="size-4.5" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground leading-none">
                {isStatsLoading ? (
                  <Skeleton className="h-5 w-6" />
                ) : (
                  (stats?.totalCourses ?? enrollments.length)
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Enrolled</p>
            </div>
          </div>

          {/* In Progress */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm min-w-30">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4.5" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground leading-none">
                {isStatsLoading ? (
                  <Skeleton className="h-5 w-6" />
                ) : (
                  (stats?.inProgressCourses ?? 0)
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                In Progress
              </p>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm min-w-30">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4.5" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground leading-none">
                {isStatsLoading ? (
                  <Skeleton className="h-5 w-6" />
                ) : (
                  (stats?.completedCourses ?? 0)
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="text-xs h-8 px-4 rounded-lg font-medium"
          >
            All
          </Button>
          <Button
            variant={activeTab === "in-progress" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("in-progress")}
            className="text-xs h-8 px-4 rounded-lg font-medium"
          >
            In Progress
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("completed")}
            className="text-xs h-8 px-4 rounded-lg font-medium"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Hero: Continue from last lesson */}
      {continueCourse && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Continue from last lesson
          </h2>

          <Card className="overflow-hidden border bg-linear-to-r from-blue-50/50 via-indigo-50/20 to-background dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-background">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Media Thumbnail with Overlay Play Button */}
                  <Link
                    href={`${continueLearHref}`}
                    className="relative aspect-video w-full sm:w-48 rounded-xl overflow-hidden bg-muted group shrink-0 border"
                  >
                    <Image
                      src={
                        continueCourse.course.thumbnail ||
                        "/placeholder-course.png"
                      }
                      alt={continueCourse.course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                      <div className="size-10 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center text-primary shadow-md">
                        <Play className="size-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </Link>

                  {/* Lesson Meta */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {continueCourse.course.title}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {continueCourse.course.title || "HTML Best Practices"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="size-3.5" />
                        Lesson {continueCourse.completed || 1} of{" "}
                        {continueCourse.progress || 10}
                      </span>
                      <span>•</span>
                      <span>Forms & Validations</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link href={`${continueLearHref}`}>
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium h-10 px-6 text-xs">
                      <Play className="size-3.5 fill-current" />
                      Resume lesson
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses Cards Grid */}
      <div className="space-y-4">
        {isEnrollmentsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
            <BookOpen className="size-10 text-muted-foreground mb-3" />
            <h3 className="text-base font-semibold">No courses found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              You haven&apos;t enrolled in any courses in this section yet.
            </p>
            <Link href="/courses">
              <Button size="sm" className="mt-4 text-xs">
                Explore Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEnrollments.map((enrollment) => {
              const progress = Math.round(enrollment.progress ?? 0);
              const isCompleted = progress === 100;
              const continueLearHref = `/student-dashboard/courses/${enrollment.courseId}`;

              return (
                <Card
                  key={enrollment.id}
                  className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Thumbnail Container (Clickable -> Opens Course) */}
                    <Link
                      href={`${continueLearHref}`}
                      className="relative aspect-video w-full bg-muted block overflow-hidden"
                    >
                      <Image
                        src={
                          enrollment.course.thumbnail ||
                          "/placeholder-course.png"
                        }
                        alt={enrollment.course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Percentage Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-bold px-2 py-0.5 backdrop-blur-md ${
                            isCompleted
                              ? "bg-emerald-500/90 text-white"
                              : "bg-background/90 text-foreground"
                          }`}
                        >
                          {progress}%
                        </Badge>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        {/* Course Title Clickable */}
                        <Link
                          href={`${continueLearHref}`}
                          className="font-bold text-sm text-foreground hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition-colors"
                          title={enrollment.course.title}
                        >
                          {enrollment.course.title}
                        </Link>
                      </div>

                      {/* Instructor & Category */}
                      <div className="flex items-center gap-2">
                        {enrollment.course.instructor && (
                          <div className="flex items-center gap-1.5">
                            <Avatar className="size-5">
                              <AvatarImage
                                src={enrollment.course.instructor.avatar || ""}
                              />
                              <AvatarFallback className="text-[9px]">
                                {enrollment.course.instructor.name?.[0] || "I"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate max-w-30">
                              {enrollment.course.instructor.name}
                            </span>
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal border-muted-foreground/20 capitalize"
                        >
                          {enrollment.course.level || "General"}
                        </Badge>
                      </div>

                      {/* Progress Bar & Lessons Counter */}
                      <div className="space-y-1.5 pt-1">
                        <Progress
                          value={progress}
                          className={`h-1.5 ${isCompleted ? "[&>div]:bg-emerald-500" : ""}`}
                        />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {enrollment.completed || 0} of{" "}
                            {enrollment.progress || 0} lessons
                          </span>
                          <span className="font-semibold text-foreground">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-4 pt-0">
                    {isCompleted ? (
                      <Link href={`${continueLearHref}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-semibold h-9 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 gap-1.5"
                        >
                          <Check className="size-3.5" />
                          Completed
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`${continueLearHref}`}>
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-9"
                        >
                          {progress > 0 ? "Continue" : "Start Course"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
