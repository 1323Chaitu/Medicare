
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CalendarDays, FileText, ClipboardList,
  Stethoscope, Search, Pill
} from "lucide-react";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("medicareUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      try {
        const [a, p, r] = await Promise.all([
          fetch(`http://localhost:5000/appointments?patientId=${user.id}`),
          fetch(`http://localhost:5000/prescriptions?patientId=${user.id}`),
          fetch(`http://localhost:5000/medicalReports?patientId=${user.id}`)
        ]);

        if (!a.ok || !p.ok || !r.ok) {
          throw new Error("Unable to load dashboard data");
        }

        setAppointments(await a.json());
        setPrescriptions(await p.json());
        setReports(await r.json());
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, [user?.id]);

  const upcoming = appointments.filter(
    item => item.date >= new Date().toLocaleDateString("en-CA") &&
    item.status !== "Cancelled"
  );

  if (!user) {
    return (
      <div className="profile-message">
        Please <Link to="/login">login</Link> to access your dashboard.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <section className="dashboard">
        <div className="dashboard-welcome">
          <div>
            <span>PATIENT DASHBOARD</span>
            <h1>Welcome, {user.name}!</h1>
            <p>Manage your healthcare and appointments in one place.</p>
          </div>

          <Link to="/doctors" className="dashboard-book-btn">
            <Search size={18} /> Find a Doctor
          </Link>
          
          <Link to="/medicine-reminders" className="dashboard-book-btn">
            <Pill size={18} /> Medicine Reminders
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <CalendarDays />
            <h2>{appointments.length}</h2>
            <p>Total Appointments</p>
          </div>

          <div className="stat-card">
            <ClipboardList />
            <h2>{upcoming.length}</h2>
            <p>Upcoming Appointments</p>
          </div>

          <div className="stat-card">
            <FileText />
            <h2>{prescriptions.length}</h2>
            <p>Prescriptions</p>
          </div>

          <div className="stat-card">
            <Stethoscope />
            <h2>{reports.length}</h2>
            <p>Medical Reports</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>My Appointments</h2>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={35} />
              <p>No appointments booked yet.</p>
              <Link to="/doctors">Book your first appointment</Link>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(item => (
                    <tr key={item.id}>
                      <td>{item.doctorName}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>₹{item.fee}</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.paymentStatus === "Paid" ? (
                            <span className="status completed">Paid</span>
                        ) : item.status !== "Cancelled" ? (
                            <Link
                            to={`/payment/${item.id}`}
                            className="pay-now-btn"
                            >
                            Pay Now
                            </Link>
                        ) : (
                            "Unavailable"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>My Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <p className="dashboard-empty">No prescriptions available yet.</p>
          ) : (
            prescriptions.map(item => (
              <div className="record-card" key={item.id}>
                <FileText />
                <div>
                  <h4>{item.doctorName}</h4>
                  <p>{item.medicines}</p>
                  <small>{item.date}</small>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-section">
          <h2>Medical Reports</h2>
          {reports.length === 0 ? (
            <p className="dashboard-empty">No medical reports available yet.</p>
          ) : (
            reports.map(item => (
              <div className="record-card" key={item.id}>
                <FileText />
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <small>{item.date}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default PatientDashboard;
