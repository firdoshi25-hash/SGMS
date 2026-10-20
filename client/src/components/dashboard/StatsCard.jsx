function StatsCard({ title, value, icon, emphasis }) {
  return (
    <div className={`stats-card ${emphasis ? "is-emphasis" : ""}`}>
      <div className="stats-icon" aria-hidden="true">{icon}</div>
      <div className="stats-copy">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatsCard;