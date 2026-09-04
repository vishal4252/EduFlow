import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateCourse from "@/components/admin/CreateCourse";

export default function CreateCoursePage() {
  return (
    <DashboardLayout title="Create Course">
      <CreateCourse />
    </DashboardLayout>
  );
}
