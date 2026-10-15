import { useState } from "react";
import GoalForm from "./GoalForm";
import "./GoalCard.css";

function GoalCard() {

  const [showForm, setShowForm] = useState(false);

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "React Practice",
      target: "Complete 2 topics",
      type: "Study",
      status: "completed",
    },
    {
      id: 2,
      title: "English Practice",
      target: "Learn 10 new words",
      type: "English",
      status: "pending",
    },
  ]);

  const handleAddGoal = (newGoal) => {

    setGoals((previousGoals) => [
      ...previousGoals,

      {
        id: Date.now(),
        title: newGoal.title,
        target: newGoal.target,
        type: newGoal.type,
        status: "pending",
      },
    ]);

    setShowForm(false);
  };

  const handleCompleteGoal = (goalId) => {
  setGoals((previousGoals) =>
    previousGoals.map((goal) =>
      goal.id === goalId
        ? { ...goal, status: "completed" }
        : goal
    )
  );
};
  return (
    <div className="goal-card">

      {/* Header */}

      <div className="goal-header">

        <div>
          <h2>Today's Goals</h2>

          <p>
            Stay focused and complete your targets.
          </p>
        </div>

        <span className="goal-count">
          {goals.filter(
            (goal) => goal.status === "completed"
          ).length}{" "}
          / {goals.length}
        </span>

      </div>


      {/* Goals List */}

      {goals.map((goal) => (

        <div
          className="goal-item"
          key={goal.id}
        >

          <div className="goal-info">

            <span className="goal-icon">

              {goal.type === "English"
                ? "🗣️"
                : goal.type === "Coding"
                ? "💻"
                : goal.type === "Revision"
                ? "🔄"
                : "📚"}

            </span>


            <div>

              <h3>
                {goal.title}
              </h3>

              <p>
                {goal.target}
              </p>

            </div>

          </div>


<button
  className={`goal-status ${
    goal.status === "completed"
      ? "completed"
      : "pending"
  }`}
  onClick={() => {
    if (goal.status !== "completed") {
      handleCompleteGoal(goal.id);
    }
  }}
>
  {goal.status === "completed"
    ? "✓ Done"
    : "Pending"}
</button>

        </div>

      ))}


      {/* Add Goal Button */}

      <button
        className="add-goal-btn"
        onClick={() => setShowForm(true)}
      >
        + Add New Goal
      </button>


      {/* Goal Form */}

      {showForm && (

        <GoalForm
          onClose={() => setShowForm(false)}
          onAddGoal={handleAddGoal}
        />

      )}

    </div>
  );
}

export default GoalCard;