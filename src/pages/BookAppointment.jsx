
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("medicareUser") || "null");

  useEffect(() => {
    fetch(`http://localhost:5000/doctors/${id}`)
      .then(res => res.json())
      .then(data => setDoctor(data))
      .catch(console.error);
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!doctor?.available) {
      alert("This doctor is currently unavailable.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          doctorId: doctor.id,
          doctorName: doctor.name,
          date,
          time,
          fee: doctor.fee,
          status: "Pending",
          paymentStatus: "Unpaid"
        })
      });

      if (!response.ok) throw new Error("Booking failed");

      const appointment = await response.json();

      alert("Appointment booked successfully!");

      navigate("/patient-dashboard");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <><Navbar /><p className="profile-message">Loading...</p><Footer /></>;
  }

  return (
    <>
      <Navbar />

      <section className="booking-page">
        <div className="booking-card">
          <h1>Book Your Appointment</h1>
          <p>Consultation with {doctor.name}</p>

          <h3>Consultation Fee: ₹{doctor.fee}</h3>

          <form onSubmit={handleBooking}>
            <label>Select Appointment Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={e => setDate(e.target.value)}
              required
            />

            <label>Select Consultation Time</label>
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            >
              <option value="">Choose a time</option>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default BookAppointment;
