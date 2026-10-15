import { student } from "../../data/dashboardData";
import profile from "../../assets/firdoshi.webp";

function ProfileCard() {
  return (
    <div className="profile-card">

      <img
        src={profile}
        alt="Firdoshi"
      />

      <h2>{student.name}</h2>

      <p>{student.role}</p>

    </div>
  );
}

export default ProfileCard;