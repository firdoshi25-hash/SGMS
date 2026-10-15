import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "date", label: "Date", type: "date", required: true },
  { name: "status", label: "Status", type: "status", required: true, defaultValue: "present", options: [
    { value: "present", label: "Present" }, { value: "absent", label: "Absent" },
    { value: "late", label: "Late" }, { value: "excused", label: "Excused" },
  ] },
  { name: "note", label: "Note", type: "textarea", maxLength: 1000 },
];

function Attendance() {
  return <ResourceManager title="Attendance" description="Record and review your attendance." endpoint="attendance" fields={fields} emptyMessage="No attendance records yet. Add your first day." />;
}

export default Attendance;