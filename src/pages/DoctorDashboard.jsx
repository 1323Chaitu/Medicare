
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarDays, Users, CheckCircle, Clock } from "lucide-react";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("medicareUser") || "null");
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
        try {
            const response = await fetch(
            "http://localhost:5000/appointments"
            );

            if (!response.ok) {
            throw new Error("Unable to load appointments");
            }

            const allAppointments = await response.json();

            const doctorAppointments = allAppointments.filter(
            (appointment) =>
                String(appointment.doctorId) === String(user.doctorId)
            );

            console.log("Logged-in Doctor ID:", user.doctorId);
            console.log("All Appointments:", allAppointments);
            console.log("Doctor Appointments:", doctorAppointments);
            
            setAppointments(doctorAppointments);

        } catch (error) {
            console.error("Appointment loading error:", error);
        }
    };

  useEffect(() => {
    if (user?.role === "doctor") {
      fetchAppointments();
    }
  }, [user?.doctorId]);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) throw new Error("Unable to update appointment");

      await fetchAppointments();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!user || user.role !== "doctor") {
    return (
      <div className="profile-message">
        Doctor access required. <Link to="/login">Login here</Link>.
      </div>
    );
  }

  const pending = appointments.filter(a => a.status === "Pending").length;
  const confirmed = appointments.filter(a => a.status === "Confirmed").length;

  return (
    <>
      <Navbar />

      <section className="dashboard">

        <div className="dashboard-welcome">
          <div>
            <span>DOCTOR DASHBOARD</span>
            <h1>Welcome, {user.name}!</h1>
            <p>Manage your patient appointments and consultations.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <CalendarDays />
            <h2>{appointments.length}</h2>
            <p>Total Appointments</p>
          </div>

          <div className="stat-card">
            <Clock />
            <h2>{pending}</h2>
            <p>Pending Appointments</p>
          </div>

          <div className="stat-card">
            <CheckCircle />
            <h2>{confirmed}</h2>
            <p>Confirmed Appointments</p>
          </div>

          <div className="stat-card">
            <Users />
            <h2>{new Set(appointments.map(a => a.patientId)).size}</h2>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Patient Appointments</h2>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={35} />
              <p>No appointments received yet.</p>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(item => (
                    <tr key={item.id}>
                      <td>{item.patientName}</td>
                      <td>{item.date}</td>
                      <td>{item.time}</td>
                      <td>₹{item.fee}</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.status === "Pending" && (
                          <button
                            className="confirm-btn"
                            onClick={() => updateStatus(item.id, "Confirmed")}
                          >
                            Confirm
                          </button>
                        )}

                        {item.status === "Confirmed" && (
                            <Link
                                to={`/consultation/${item.id}`}
                                className="start-consultation-btn"
                            >
                                Start Consultation
                            </Link>
                        )}

                        {item.status === "Completed" && "Finished"}
                        {item.status === "Cancelled" && "Cancelled"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>

      <Footer />
    </>
  );
}

export default DoctorDashboard;
