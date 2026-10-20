function WelcomeCard({ name }) {
  return (
    <div className="welcome-card">
      <div className="welcome-copy">
        <h1>Welcome back! <span aria-hidden="true">👋</span></h1>
        <p>Your progress, your goals, your future.</p>
      </div>
      <div className="welcome-mini" aria-hidden="true">
        {name ? name.split(" ")[0] : "Student"}
      </div>
    </div>
  );
}

export default WelcomeCard;