import MainCoursePage from "@/app/_modules/course/views/course-with-ai/main-course-page";
import { TParams } from "@/types/params";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Course Page",
};
const CoursePage = async ({ params }: TParams) => {
  const { id } = await params;
  if (!id) {
    return null;
  }
  return (
    <div>
      <MainCoursePage id={id} />
    </div>
  );
};

export default CoursePage;
