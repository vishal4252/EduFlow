import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Courses from "@/components/courses/Courses";

export default function AllCoursesPage() {
  return (
    <DashboardLayout title="All Courses">
      <Courses />
    </DashboardLayout>
  );
}
