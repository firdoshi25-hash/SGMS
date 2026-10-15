import { student } from "../../data/dashboardData";

function ProgressCard() {
  return (
    <div className="progress-card">

      <h2>Today's Progress</h2>

      <p>Goals Completed</p>

      <h1>{student.goals}</h1>

    </div>
  );
}

export default ProgressCard;