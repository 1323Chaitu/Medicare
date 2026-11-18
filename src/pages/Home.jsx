
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  Video,
  CalendarDays,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Brain,
  Baby,
  Bone,
  Eye,
  ArrowRight
} from "lucide-react";

function Home() {
  const specialties = [
    { name: "General Physician", icon: Stethoscope },
    { name: "Cardiologist", icon: HeartPulse },
    { name: "Neurologist", icon: Brain },
    { name: "Pediatrician", icon: Baby },
    { name: "Orthopedic", icon: Bone },
    { name: "Ophthalmologist", icon: Eye }
  ];

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <span className="tag">YOUR HEALTH, OUR PRIORITY</span>

          <h1>
            Healthcare Made Simple,
            <span> Anytime, Anywhere.</span>
          </h1>

          <p>
            Consult experienced doctors online, book appointments,
            and manage your health records from the comfort of your home.
          </p>

          <div className="hero-buttons">
            <a href="/doctors" className="primary-btn">
              Find a Doctor <ArrowRight size={18} />
            </a>

            <a href="/register" className="secondary-btn">
              Get Started
            </a>
          </div>

          <div className="hero-features">
            <span><ShieldCheck /> Trusted Doctors</span>
            <span><Video /> Online Consultation</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900"
            alt="Professional doctor"
          />
        </div>
      </section>

      <section className="search-section">
        <div>
          <h2>Find the Right Doctor</h2>
          <p>Search doctors by name or specialization.</p>
        </div>

        <div className="search-box">
          <Search />
          <input placeholder="Search doctors or specialization..." />
          <a href="/doctors">Search</a>
        </div>
      </section>

      <section className="specialties" id="services">
        <div className="section-heading">
          <span>OUR SPECIALTIES</span>
          <h2>Explore Medical Specialties</h2>
          <p>Find the right specialist for your healthcare needs.</p>
        </div>

        <div className="specialty-grid">
          {specialties.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="specialty-card" key={index}>
                <div className="specialty-icon">
                  <Icon size={30} />
                </div>
                <h3>{item.name}</h3>
                <a href="/doctors">Explore Doctors <ArrowRight size={15} /></a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="appointment-banner" id="about">
        <div>
          <h2>Healthcare is just one click away.</h2>
          <p>Book your online consultation with experienced doctors.</p>
        </div>
        <a href="/doctors">Book Appointment <CalendarDays /></a>
      </section>

      <Footer />
    </>
  );
}

export default Home;
