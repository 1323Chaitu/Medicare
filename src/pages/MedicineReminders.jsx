
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Pill, Trash2, Clock } from "lucide-react";

function MedicineReminders() {
  const user = JSON.parse(
    localStorage.getItem("medicareUser") || "null"
  );

  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    medicine: "",
    dosage: "",
    time: "",
    date: ""
  });

  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/medicineReminders"
      );

      if (!response.ok) throw new Error("Unable to load reminders");

      const data = await response.json();

      setReminders(
        data.filter(item => String(item.patientId) === String(user.id))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.role === "patient") fetchReminders();
  }, [user?.id]);

  const addReminder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/medicineReminders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            patientId: user.id
          })
        }
      );

      if (!response.ok) throw new Error("Unable to save reminder");

      setForm({
        medicine: "",
        dosage: "",
        time: "",
        date: ""
      });

      await fetchReminders();
      alert("Medicine reminder added!");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this medicine reminder?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/medicineReminders/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Unable to delete reminder");

      await fetchReminders();

    } catch (error) {
      alert(error.message);
    }
  };

  if (!user || user.role !== "patient") {
    return (
      <div className="profile-message">
        Patient login required. <Link to="/login">Login here</Link>.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <section className="reminder-page">
        <div className="reminder-heading">
          <span>HEALTH MANAGEMENT</span>
          <h1>Medicine Reminders</h1>
          <p>Manage your medicine schedule in one place.</p>
        </div>

        <div className="reminder-layout">

          <div className="reminder-form-card">
            <h2><Pill /> Add Medicine</h2>

            <form onSubmit={addReminder}>
              <label>Medicine Name</label>
              <input
                value={form.medicine}
                onChange={e => setForm({
                  ...form,
                  medicine: e.target.value
                })}
                placeholder="Enter medicine name"
                required
              />

              <label>Dosage</label>
              <input
                value={form.dosage}
                onChange={e => setForm({
                  ...form,
                  dosage: e.target.value
                })}
                placeholder="Example: 1 tablet"
                required
              />

              <label>Reminder Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({
                  ...form,
                  time: e.target.value
                })}
                required
              />

              <label>Start Date</label>
              <input
                type="date"
                value={form.date}
                min={new Date().toLocaleDateString("en-CA")}
                onChange={e => setForm({
                  ...form,
                  date: e.target.value
                })}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add Reminder"}
              </button>
            </form>
          </div>

          <div className="reminder-list-card">
            <h2><Clock /> My Medicine Schedule</h2>

            {reminders.length === 0 ? (
              <div className="empty-state">
                <Pill size={35} />
                <p>No medicine reminders added yet.</p>
              </div>
            ) : (
              reminders.map(item => (
                <div className="reminder-item" key={item.id}>
                  <div>
                    <h3>{item.medicine}</h3>
                    <p>{item.dosage}</p>
                    <small>
                      {item.date} | {item.time}
                    </small>
                  </div>

                  <button
                    onClick={() => deleteReminder(item.id)}
                    aria-label={`Delete ${item.medicine} reminder`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default MedicineReminders;
