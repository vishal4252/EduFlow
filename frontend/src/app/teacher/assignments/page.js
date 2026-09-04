import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherAssignments from "@/components/teacher/TeacherAssignments";

export default function TeacherAssignmentsPage() {
  return (
    <DashboardLayout title="Assignments">
      <TeacherAssignments />
    </DashboardLayout>
  );
}
