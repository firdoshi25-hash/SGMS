import { student } from "../../data/dashboardData";

function QuoteCard() {
  return (
    <div className="quote-card">

      <h2>Quote of the Day</h2>

      <p>"{student.quote}"</p>

    </div>
  );
}

export default QuoteCard;