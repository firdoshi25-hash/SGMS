import { Link } from "react-router-dom";

function Card({ title, description, to }) {
  const content = (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
    </>
  );

  return to
    ? <Link className="card feature-card-link" to={to}>{content}<span aria-hidden="true">Open page &rarr;</span></Link>
    : <div className="card">{content}</div>;
}



export default Card;