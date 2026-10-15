import ResourceManager from "../components/common/ResourceManager";

const fields = [
  { name: "startDate", label: "Start date", type: "date", required: true },
  { name: "endDate", label: "End date", type: "date", required: true },
  { name: "reason", label: "Reason", type: "textarea", required: true, maxLength: 2000 },
  { name: "status", label: "Request status", type: "status", readOnly: true, defaultValue: "pending", options: [
    { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" },
  ] },
];

function Leave() {
  return <ResourceManager title="Leave requests" description="Submit and review your leave requests." endpoint="leave" fields={fields} />;
}

export default Leave;