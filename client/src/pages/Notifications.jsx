import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "title", label: "Notification", required: true, maxLength: 160 },
  { name: "message", label: "Details", type: "textarea", required: true, maxLength: 2000 },
  { name: "read", label: "Read", type: "checkbox", defaultValue: false },
];

function Notifications() {
  return <ResourceManager title="Notifications" description="Review and manage your updates." endpoint="notifications" fields={fields} />;
}

export default Notifications;