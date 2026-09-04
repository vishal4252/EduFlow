import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AllAssignments from "@/components/admin/AllAssignments";

export default function AllAssignmentsPage() {
  return (
    <DashboardLayout title="All Assignments">
      <AllAssignments />
    </DashboardLayout>
  );
}
