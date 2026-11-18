# MediCare – Online Doctor Consultation & Telemedicine Website

MediCare is a responsive web application designed to simplify the process of finding doctors, booking appointments, and managing basic healthcare-related activities online.

The application provides separate dashboards for patients and doctors, appointment management, simulated video consultations, digital prescriptions, medical reports, payment simulation, and medicine reminders.

## 🚀 Features

### 👤 Patient Features
- Patient registration and login.
- Browse and search available doctors.
- Filter doctors by specialization.
- View doctor profiles, qualifications, experience, and consultation fees.
- Book doctor appointments.
- View appointment details and status.
- Simulated online payment using UPI, Card, and Net Banking options.
- View digital prescriptions.
- Access medical reports.
- Add and manage medicine reminders.

### 🩺 Doctor Features
- Doctor login.
- Dedicated doctor dashboard.
- View assigned patient appointments.
- Confirm pending appointments.
- Start simulated video consultations.
- Enable or disable microphone and camera controls in the demo interface.
- Create digital prescriptions.
- Add medical reports.
- Complete consultations.

### 💻 General Features
- Responsive user interface.
- React-based component architecture.
- Navigation using React Router.
- Dynamic data management using JSON Server.
- REST API operations using Fetch API.
- Icon integration using Lucide React.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JSON Server | Mock backend and REST API |
| React Router DOM | Client-side routing |
| Lucide React | Icons |
| Local Storage | Demo login session management |

## 📂 Project Structure

```text
MediCare/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── DoctorCard.jsx
│   │
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Doctors.jsx
│   │   ├── DoctorProfile.jsx
│   │   ├── BookAppointment.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── Consultation.jsx
│   │   ├── Payment.jsx
│   │   └── MedicineReminders.jsx
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── db.json
├── package.json
├── package-lock.json
├── index.html
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Visual Studio Code (recommended)

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd MediCare
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the JSON Server

The JSON Server provides mock REST API endpoints using the `db.json` file.

```bash
npm run server
```

The backend will run at:

```text
http://localhost:5000
```

### Step 4: Start the React Application

Open another terminal in the project directory and execute:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open the URL in your browser to access MediCare.

## 🔗 Application Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/login` | Login |
| `/register` | Patient registration |
| `/doctors` | Doctor listing |
| `/doctors/:id` | Doctor profile |
| `/book-appointment/:id` | Appointment booking |
| `/patient-dashboard` | Patient dashboard |
| `/doctor-dashboard` | Doctor dashboard |
| `/consultation/:id` | Video consultation demo |
| `/payment/:id` | Payment simulation |
| `/medicine-reminders` | Medicine reminders |

## 🗄️ Database Structure

The project uses `db.json` as its mock database.

Main collections include:

- **users:** Patient and doctor account information.
- **doctors:** Doctor profiles and availability information.
- **appointments:** Appointment details, status, and payment information.
- **prescriptions:** Digital prescription records.
- **medicalReports:** Patient medical report records.
- **medicineReminders:** Medicine reminder schedules.

## 🔄 Application Workflow

1. A patient registers and logs into the application.
2. The patient searches for a doctor based on specialization.
3. The patient views the doctor's profile and books an appointment.
4. The doctor logs in and confirms the appointment.
5. The doctor starts a simulated consultation.
6. The doctor can create a prescription and medical report.
7. The patient can view the saved records through the dashboard.
8. The patient can make a simulated payment and manage medicine reminders.

## 🧪 Testing

The project was manually tested for the following workflows:

- Patient and doctor authentication.
- Doctor search and profile navigation.
- Appointment booking.
- Patient and doctor dashboard operations.
- Appointment confirmation and completion.
- Prescription and medical report creation.
- Simulated payment processing.
- Medicine reminder creation and deletion.
- Responsive layout checks.
- Production build verification.

## 🔐 Important Security and Usage Notes

This project is developed for learning and demonstration purposes.

- JSON Server is used as a mock backend, not a production database.
- Authentication uses demonstration-level local storage and should not be considered secure.
- Passwords are not protected by production-grade password hashing in the demo implementation.
- Video consultation is a simulated interface and does not provide real-time video communication.
- Payment processing is simulated and does not connect to an actual payment gateway.
- Prescriptions and medical reports are demonstration records, not verified medical documents.

A production deployment would require secure backend authentication, encrypted data handling, access controls, a production database, real video infrastructure, and a compliant payment integration.

## 🎯 Project Objective

The main objective of MediCare is to demonstrate practical frontend development, REST API integration, authentication workflows, role-based dashboards, data management, and responsive web application development using React.

## 👨‍💻 Author

**Chaithanya Chapparapu**

GitHub: Add your GitHub profile URL here.

---

*Developed as a web development learning project.*