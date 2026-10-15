import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "title", label: "Project name", required: true, maxLength: 160 },
  { name: "status", label: "Status", type: "status", defaultValue: "planned", options: [
    { value: "planned", label: "Planned" }, { value: "in-progress", label: "In progress" }, { value: "completed", label: "Completed" },
  ] },
  { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, defaultValue: 0 },
  { name: "dueDate", label: "Due date", type: "date" },
  { name: "description", label: "Description", type: "textarea", maxLength: 4000 },
];

function Projects() {
  return <ResourceManager title="Projects" description="Plan projects and keep progress up to date." endpoint="projects" fields={fields} />;
}

export default Projects;