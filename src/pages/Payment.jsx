
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CreditCard, ShieldCheck } from "lucide-react";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("medicareUser") || "null");

  const [appointment, setAppointment] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/appointments/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Appointment not found");
        return res.json();
      })
      .then(data => setAppointment(data))
      .catch(error => console.error(error));
  }, [id]);

  const handlePayment = async () => {
    if (!appointment || !user) return;

    if (String(appointment.patientId) !== String(user.id)) {
      alert("You cannot pay for another patient's appointment.");
      return;
    }

    if (appointment.status === "Cancelled") {
      alert("Payment is unavailable for cancelled appointments.");
      return;
    }

    if (appointment.paymentStatus === "Paid") {
      alert("This appointment is already paid.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentStatus: "Paid",
            paymentMethod: method,
            paymentDate: new Date().toISOString()
          })
        }
      );

      if (!response.ok) throw new Error("Payment update failed");

      alert("Demo payment successful!");

      navigate("/patient-dashboard");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "patient") {
    return <div className="profile-message">
      Patient login required. <Link to="/login">Login here</Link>.
    </div>;
  }

  if (!appointment) {
    return <><Navbar /><p className="profile-message">Loading payment details...</p><Footer /></>;
  }

  if (String(appointment.patientId) !== String(user.id)) {
    return <><Navbar /><p className="profile-message">Appointment not found for this account.</p><Footer /></>;
  }

  return (
    <>
      <Navbar />

      <section className="payment-page">
        <div className="payment-card">
          <h1><CreditCard /> Appointment Payment</h1>
          <p>Review your consultation details.</p>

          <div className="payment-summary">
            <p>Doctor: <strong>{appointment.doctorName}</strong></p>
            <p>Date: <strong>{appointment.date}</strong></p>
            <p>Time: <strong>{appointment.time}</strong></p>
            <p>Appointment Status: <strong>{appointment.status}</strong></p>

            <h2>₹{appointment.fee}</h2>
            <span>Consultation Fee</span>
          </div>

          {appointment.paymentStatus === "Paid" ? (
            <div className="success-message">
              Payment already completed.
            </div>
          ) : (
            <>
              <h3>Select Payment Method</h3>

              <div className="payment-methods">
                {["UPI", "Card", "Net Banking"].map(item => (
                  <label key={item}>
                    <input
                      type="radio"
                      value={item}
                      checked={method === item}
                      onChange={e => setMethod(e.target.value)}
                    />
                    {item}
                  </label>
                ))}
              </div>

              <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : `Pay ₹${appointment.fee}`}
              </button>
            </>
          )}

          <p className="payment-note">
            <ShieldCheck size={16} />
            Demonstration payment only. No real transaction is performed.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Payment;
