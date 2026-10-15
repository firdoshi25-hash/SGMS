import HomeNavbar from "../components/common/HomeNavbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/home.css";

function Home() {
  const { user } = useAuth();

  return (
    <>
   <HomeNavbar />

      <section className="hero">

        <h1>Student Growth Management System</h1>

        <p>
          Track your attendance, goals, study hours and projects easily.
        </p>

        <Link className="home-cta" to={user ? "/dashboard" : "/register"}>
          {user ? "Open dashboard" : "Get started"}
        </Link>

      </section>

      <section className="features">

        <Card
          title="Attendance"
          description="Track daily attendance."
          to="/attendance"
        />

        <Card
          title="Goals"
          description="Complete daily goals."
          to="/goals"
        />

        <Card
          title="Study"
          description="Track study hours."
          to="/study-tracker"
        />

      </section>

      <Footer />

    </>
  );
}

export default Home;