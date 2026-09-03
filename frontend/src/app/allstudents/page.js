import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AllStudents from "@/components/admin/AllStudents";

export default function AllStudentsPage() {
  return (
    <DashboardLayout title="All Students">
      <AllStudents />
    </DashboardLayout>
  );
}
