import "./Goal.css";

import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "title", label: "Goal name", required: true, maxLength: 120 },
  { name: "target", label: "Target", required: true, maxLength: 200 },
  {
    name: "type",
    label: "Category",
    type: "select",
    defaultValue: "Study",
    options: [
      { value: "Study", label: "Study" },
      { value: "Coding", label: "Coding" },
      { value: "English", label: "English" },
      { value: "Revision", label: "Revision" },
      { value: "Project", label: "Project" },
    ],
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    defaultValue: "Medium",
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "status",
    defaultValue: "pending",
    options: [
      { value: "pending", label: "Pending" },
      { value: "completed", label: "Completed" },
    ],
  },
  { name: "dueDate", label: "Due date", type: "date" },
  { name: "description", label: "Description", type: "textarea", maxLength: 2000 },
];

function Goals() {
  return (
    <ResourceManager
      title="Goals"
      description="Set targets and track each goal through completion."
      endpoint="goals"
      fields={fields}
    />
  );
}

export default Goals;