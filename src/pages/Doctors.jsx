
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  Star,
  BriefcaseMedical,
  IndianRupee,
  ArrowRight
} from "lucide-react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/doctors");

        if (!response.ok) {
          throw new Error("Failed to fetch doctors.");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specializations = [
    "All",
    ...new Set(doctors.map((doctor) => doctor.specialization))
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSpecialization =
      specialization === "All" ||
      doctor.specialization === specialization;

    return matchesSearch && matchesSpecialization;
  });

  return (
    <>
      <Navbar />

      <section className="doctor-page">

        <div className="doctor-heading">
          <span>OUR MEDICAL EXPERTS</span>
          <h1>Find Your Doctor</h1>
          <p>
            Consult experienced healthcare professionals
            from the comfort of your home.
          </p>
        </div>

        <div className="doctor-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search doctor by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <h3>Filter by Specialization</h3>

          <div className="filter-buttons">
            {specializations.map((item) => (
              <button
                key={item}
                className={
                  specialization === item ? "filter-active" : ""
                }
                onClick={() => setSpecialization(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="doctor-results">
          <h2>Available Doctors ({filteredDoctors.length})</h2>

          {loading && <p>Loading doctors...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && filteredDoctors.length === 0 && (
            <p>No doctors found. Try another search.</p>
          )}

          <div className="doctor-grid">
            {filteredDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>

                <div className="doctor-image">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                  />
                </div>

                <div className="doctor-info">

                  <span className="availability">
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>

                  <h3>{doctor.name}</h3>

                  <p className="doctor-specialization">
                    {doctor.specialization}
                  </p>

                  <p className="doctor-qualification">
                    {doctor.qualification}
                  </p>

                  <div className="doctor-details">
                    <span>
                      <BriefcaseMedical size={16} />
                      {doctor.experience} Years
                    </span>

                    <span>
                      <Star size={16} fill="#f5b942" color="#f5b942" />
                      {doctor.rating}
                    </span>
                  </div>

                  <div className="doctor-bottom">
                    <div className="doctor-fee">
                      <IndianRupee size={17} />
                      {doctor.fee}
                      <small> / consultation</small>
                    </div>

                    <Link
                      to={`/doctors/${doctor.id}`}
                      className="view-profile"
                    >
                      View Profile <ArrowRight size={15} />
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}

export default Doctors;
