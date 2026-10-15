import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "title", label: "Task", required: true, maxLength: 160 },
  { name: "status", label: "Status", type: "status", defaultValue: "pending", options: [
    { value: "pending", label: "Pending" }, { value: "in-progress", label: "In progress" }, { value: "completed", label: "Completed" },
  ] },
  { name: "priority", label: "Priority", type: "select", defaultValue: "Medium", options: [
    { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" },
  ] },
  { name: "dueDate", label: "Due date", type: "date" },
  { name: "description", label: "Details", type: "textarea", maxLength: 2000 },
];

function Tasks() {
  return <ResourceManager title="Tasks" description="Organize work and update task status as you go." endpoint="tasks" fields={fields} />;
}

export default Tasks;