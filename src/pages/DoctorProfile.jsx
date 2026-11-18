
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, BriefcaseMedical, GraduationCap, IndianRupee, CalendarDays } from "lucide-react";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/doctors/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Doctor not found");
        return res.json();
      })
      .then(data => setDoctor(data))
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="profile-message">Loading doctor profile...</p>;

  if (!doctor) {
    return (
      <>
        <Navbar />
        <div className="profile-message">
          <h2>Doctor not found</h2>
          <Link to="/doctors">Back to Doctors</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="profile-page">
        <div className="profile-card">
          <img src={doctor.image} alt={doctor.name} />

          <div className="profile-info">
            <span className="availability">
              {doctor.available ? "Available for Consultation" : "Currently Unavailable"}
            </span>

            <h1>{doctor.name}</h1>
            <h3>{doctor.specialization}</h3>

            <p>{doctor.about}</p>

            <div className="profile-details">
              <span><BriefcaseMedical /> {doctor.experience} Years Experience</span>
              <span><GraduationCap /> {doctor.qualification}</span>
              <span><Star /> {doctor.rating} Rating</span>
              <span><IndianRupee /> {doctor.fee} Consultation Fee</span>
            </div>

            <button
              disabled={!doctor.available}
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
              className="book-btn"
            >
              <CalendarDays size={18} /> Book Appointment
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default DoctorProfile;
