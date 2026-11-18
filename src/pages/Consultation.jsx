
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Video, VideoOff, Mic, MicOff,
  FileText, Pill, CheckCircle
} from "lucide-react";

function Consultation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("medicareUser") || "null"
  );

  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] = useState({
    medicines: "",
    instructions: ""
  });

  const [report, setReport] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/appointments/${id}`
        );

        if (!response.ok) throw new Error("Appointment not found");

        const data = await response.json();

        setAppointment(data);

        const doctorResponse = await fetch(
          `http://localhost:5000/doctors/${data.doctorId}`
        );

        if (!doctorResponse.ok) throw new Error("Doctor not found");

        setDoctor(await doctorResponse.json());

      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [id]);

  const savePrescription = async (e) => {
    e.preventDefault();

    if (!prescription.medicines.trim()) {
      alert("Please enter medicine details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/prescriptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            doctorName: appointment.doctorName,
            appointmentId: appointment.id,
            medicines: prescription.medicines,
            instructions: prescription.instructions,
            date: new Date().toLocaleDateString("en-CA")
          })
        }
      );

      if (!response.ok) throw new Error("Prescription could not be saved");

      alert("Prescription saved successfully!");

      setPrescription({ medicines: "", instructions: "" });

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (e) => {
    e.preventDefault();

    if (!report.title.trim() || !report.description.trim()) {
      alert("Please complete all report fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/medicalReports",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            doctorName: appointment.doctorName,
            appointmentId: appointment.id,
            title: report.title,
            description: report.description,
            date: new Date().toLocaleDateString("en-CA")
          })
        }
      );

      if (!response.ok) throw new Error("Report could not be saved");

      alert("Medical report saved successfully!");

      setReport({ title: "", description: "" });

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeConsultation = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" })
        }
      );

      if (!response.ok) throw new Error("Unable to complete consultation");

      alert("Consultation completed successfully!");

      navigate("/doctor-dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  if (!user || user.role !== "doctor") {
    return (
      <div className="profile-message">
        Doctor login required. <Link to="/login">Login here</Link>.
      </div>
    );
  }

  if (!appointment || !doctor) {
    return (
      <>
        <Navbar />
        <div className="profile-message">
          Loading consultation...
        </div>
        <Footer />
      </>
    );
  }

  if (String(user.doctorId) !== String(appointment.doctorId)) {
    return (
      <>
        <Navbar />
        <div className="profile-message">
          You are not authorized to access this consultation.
        </div>
        <Footer />
      </>
    );
  }

  if (appointment.status !== "Confirmed") {
    return (
      <>
        <Navbar />
        <div className="profile-message">
          <h2>Consultation unavailable</h2>
          <p>This appointment must be confirmed before consultation.</p>
          <Link to="/doctor-dashboard">Back to Dashboard</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="consultation-page">
        <div className="consultation-heading">
          <span>ONLINE CONSULTATION</span>
          <h1>Patient Consultation</h1>
          <p>
            Patient: {appointment.patientName} |
            Doctor: {doctor.name}
          </p>
        </div>

        <div className="video-container">
          <div className="video-screen">
            {videoStarted && videoOn ? (
              <div className="video-placeholder">
                <Video size={55} />
                <h2>Video Consultation Active</h2>
                <p>Demo video interface – no live video connection.</p>
              </div>
            ) : (
              <div className="video-placeholder">
                <VideoOff size={55} />
                <h2>{videoStarted ? "Camera is off" : "Consultation Room"}</h2>
                <p>
                  {videoStarted
                    ? "Turn on your camera to continue."
                    : "Start the demo consultation when ready."}
                </p>
              </div>
            )}

            <div className="video-controls">
              <button onClick={() => setMicOn(!micOn)}>
                {micOn ? <Mic /> : <MicOff />}
              </button>

              <button onClick={() => setVideoOn(!videoOn)}>
                {videoOn ? <Video /> : <VideoOff />}
              </button>

              <button
                className="start-call-btn"
                onClick={() => setVideoStarted(!videoStarted)}
              >
                {videoStarted ? "End Demo Call" : "Start Consultation"}
              </button>
            </div>
          </div>
        </div>

        <div className="consultation-forms">

          <div className="consultation-form-card">
            <h2><Pill /> Digital Prescription</h2>

            <form onSubmit={savePrescription}>
              <label>Medicines and Dosage</label>
              <textarea
                rows="4"
                placeholder="Example: Medicine name, dosage and frequency..."
                value={prescription.medicines}
                onChange={e => setPrescription({
                  ...prescription,
                  medicines: e.target.value
                })}
                required
              />

              <label>Instructions</label>
              <textarea
                rows="3"
                placeholder="Enter consultation and medicine instructions..."
                value={prescription.instructions}
                onChange={e => setPrescription({
                  ...prescription,
                  instructions: e.target.value
                })}
              />

              <button type="submit" disabled={loading}>
                Save Prescription
              </button>
            </form>
          </div>

          <div className="consultation-form-card">
            <h2><FileText /> Medical Report</h2>

            <form onSubmit={saveReport}>
              <label>Report Title</label>
              <input
                placeholder="Enter report title"
                value={report.title}
                onChange={e => setReport({
                  ...report,
                  title: e.target.value
                })}
                required
              />

              <label>Report Description</label>
              <textarea
                rows="5"
                placeholder="Enter report findings or notes..."
                value={report.description}
                onChange={e => setReport({
                  ...report,
                  description: e.target.value
                })}
                required
              />

              <button type="submit" disabled={loading}>
                Save Medical Report
              </button>
            </form>
          </div>

        </div>

        <button
          className="finish-consultation-btn"
          onClick={completeConsultation}
        >
          <CheckCircle size={19} />
          Complete Consultation
        </button>

      </section>

      <Footer />
    </>
  );
}

export default Consultation;
