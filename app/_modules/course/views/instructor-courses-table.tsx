"use client";

import { Button } from "@/components/ui/button";
import { useGetInstructorCourses } from "../hooks/useGetInstructorCourses";
import { CoursesTableView } from "./course-table-view";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "../entities/course";

export default function InstructorCoursesTable() {
  //will remove it, just for testing
  // const handleAiQuizAnalyzes = async () => {
  //   const res = await api.post(
  //     "/api/quizzes/cmszzxq8o003a2cbv52hrjw4l/ai/instructor-analysis",
  //   );
  //   console.log("the response is : ", res.data);
  // };

  const router = useRouter();
  const { data: courses, isLoading, isError } = useGetInstructorCourses();

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-sm text-muted-foreground">
        Failed to load your courses.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between">
        {/* <Button onClick={handleAiQuizAnalyzes} className={"p-3 bg-amber-500 "}>Quiz analysis</Button> */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-sm text-muted-foreground">
            Courses you&apos;ve created on the platform.
          </p>
        </div>
        <Link href="courses/create">
          <Button className="">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </Link>
      </div>

      <CoursesTableView
        courses={courses ?? []}
        isLoading={isLoading}
        onView={(course: Course) => router.push(`courses/${course.id}/details`)}
        onEdit={(course: Course) => router.push(`courses/${course.id}/edit`)}
        onDelete={(course: Course) =>
          router.push(`courses/${course.id}/delete`)
        }
        showInstructorColumn={false}
        emptyMessage={
          <>
            <p>You haven&apos;t created any courses yet.</p>
            <br />
            <Link href={"courses/create"}>
              <Button>Create one now </Button>
            </Link>
          </>
        }
      />
    </div>
  );
}
