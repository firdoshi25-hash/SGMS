import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "title", label: "Title", required: true, maxLength: 160 },
  { name: "content", label: "Note", type: "textarea", maxLength: 20000 },
  { name: "tags", label: "Tags (comma separated)", type: "tags" },
  { name: "resourceUrl", label: "Resource URL", type: "url", maxLength: 2000 },
];

function Notes() {
  return <ResourceManager title="Notes" description="Keep study notes and useful links together." endpoint="notes" fields={fields} />;
}

export default Notes;