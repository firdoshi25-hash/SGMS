import { useState } from "react";
import "./GoalForm.css";

function GoalForm({ onClose, onAddGoal }) {

  const [goal, setGoal] = useState({
    title: "",
    type: "Study",
    target: "",
    description: "",
    priority: "Medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setGoal({
      ...goal,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!goal.title || !goal.target) {
      alert("Please enter goal name and target.");
      return;
    }

    onAddGoal(goal);

    setGoal({
      title: "",
      type: "Study",
      target: "",
      description: "",
      priority: "Medium",
    });
  };

  return (
    <div className="goal-form-overlay">

      <div className="goal-form">

        <div className="goal-form-header">
          <div>
            <h2>Add New Goal</h2>
            <p>Create a goal for your study plan.</p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Goal Name</label>

          <input
            type="text"
            name="title"
            placeholder="e.g. Complete React Chapter 3"
            value={goal.title}
            onChange={handleChange}
          />


          <label>Goal Type</label>

          <select
            name="type"
            value={goal.type}
            onChange={handleChange}
          >
            <option value="Study">Study</option>
            <option value="Coding">Coding</option>
            <option value="English">English</option>
            <option value="Revision">Revision</option>
            <option value="Project">Project</option>
          </select>


          <label>Target</label>

          <input
            type="text"
            name="target"
            placeholder="e.g. 2 topics / 30 questions"
            value={goal.target}
            onChange={handleChange}
          />


          <label>Description</label>

          <textarea
            name="description"
            placeholder="Write a short description..."
            value={goal.description}
            onChange={handleChange}
            rows="3"
          />


          <label>Priority</label>

          <select
            name="priority"
            value={goal.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>


          <div className="goal-form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-goal-btn"
            >
              Add Goal
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default GoalForm;