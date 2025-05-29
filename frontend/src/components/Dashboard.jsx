import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import AppointmentForm from "./AppointmentForm"; // Make sure you import your form component
import UserRegisterForm from "./UserRegisterForm";
import axios from "axios";


const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false); // track form visibility
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showTreatmentsForm, setShowTreatmentsForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    age: "",
    dob: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // for the “New Treatment” modal:
  const [newTreatment, setNewTreatment] = useState({
    name: "",
    description: "",
    price: 0,
    priceRange: "",
    discountAvailable: false,
    image: ""
  });


  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!storedRole) {
      navigate("/login");
    } else {
      setRole(storedRole);

      const storedUsername = localStorage.getItem("username") || sessionStorage.getItem("username");
      if (!storedUsername) {
        setUsername('User');
      } else {
        setUsername(storedUsername);
      }

      if (storedRole === "admin" || storedRole === "receptionist") {
        setActiveTab("appointments");
      } else if (storedRole === "patient") {
        setActiveTab("upcomingAppointments");
      } else {
        setActiveTab("");
      }
    }
  }, [navigate]);

  // fetch live appointments once we know the role
  // For patients: load only their own appts
  useEffect(() => {
    if (role !== "patient") return;

    fetch("/api/appointments/mine", {
      credentials: "include",
      cache: "no-cache"
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setUpcomingAppointments(
          data.filter((a) => ["confirmed", "pending"].includes(a.status.toLowerCase()))
        );
        setPreviousAppointments(
          data.filter((a) => ["completed", "cancelled"].includes(a.status.toLowerCase()))
        );
      })
      .catch((err) => console.error("Fetch patient appts error:", err));
  }, [role]);

  // For admins/receptionists: load all appts
  useEffect(() => {
    if (!(role === "admin" || role === "receptionist")) return;

    fetch("/api/appointments", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setUpcomingAppointments(
          data.filter((a) => ["confirmed", "pending"].includes(a.status.toLowerCase()))
        );
        setPreviousAppointments(
          data.filter((a) => ["completed", "cancelled"].includes(a.status.toLowerCase()))
        );
      })
      .catch((err) => console.error("Fetch all appts error:", err));
  }, [role]);


  useEffect(() => {
    if (role === "admin" || role === "receptionist") {
      const base = "";
      fetch(`${base}/api/auth/users`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          // keep only patients
          setPatients(data.filter((u) => u.role === "patient"));
          setStaff(data.filter((u) => u.role === "admin" || u.role === "receptionist"));
        })
        .catch((err) => console.error("Failed to load patients:", err));
    }
  }, [role]);

  useEffect(() => {
    if (role === "admin" || role === "receptionist") {
      const base = "";
      fetch(`${base}/api/treatments`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          setTreatments(data);
        })
        .catch((err) => console.error("Failed to load treatments:", err));
    }
  }, [role]);

  const [editingAppt, setEditingAppt] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingTreatment, setEditingTreatment] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updated Profile:", formData);
    // TODO: Call update profile API here
  };


  const handleEditStaff = (staff) => {
    console.log("Edit staff", staff);
    setEditingStaff({ ...staff });
  };

  // Save the edited staff back to the server
  const handleSaveStaff = (e) => {
    e.preventDefault();
    const base = "";
    fetch(`${base}/api/auth/users/${editingPatient._id}`, {
      method: "PUT",                     // your update route
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingPatient.name,
        email: editingPatient.email,
        phone: editingPatient.phone
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((updatedUser) => {
        setStaff(prev =>
          prev.map(u => u._id === updatedUser._id ? updatedUser : u)
        );
        setEditingPatient(null);
      })
      .catch(err => console.error("Edit staff error:", err));
  };

  // Delete a staff
  const handleDeleteStaff = (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    const base = "";
    fetch(`${base}/api/auth/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setStaff(prev => prev.filter(u => u._id !== id));
      })
      .catch(err => console.error("Delete staff error:", err));
  };

  // When “Edit” is clicked
  const handleEditPatient = (patient) => {
    console.log("Edit patient", patient);
    setEditingPatient({ ...patient });
  };

  // Save the edited patient back to the server
  const handleSavePatient = (e) => {
    e.preventDefault();
    const base = "";
    fetch(`${base}/api/auth/users/${editingPatient._id}`, {
      method: "PUT",                     // your update route
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingPatient.name,
        email: editingPatient.email,
        phone: editingPatient.phone
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((updatedUser) => {
        setPatients(prev =>
          prev.map(u => u._id === updatedUser._id ? updatedUser : u)
        );
        setEditingPatient(null);
      })
      .catch(err => console.error("Edit patient error:", err));
  };

  // Delete a patient
  const handleDeletePatient = (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    const base = "";
    fetch(`${base}/api/auth/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setPatients(prev => prev.filter(u => u._id !== id));
      })
      .catch(err => console.error("Delete patient error:", err));
  };

  // When “Edit” is clicked
  const handleEditTreatment = (t) => {
    console.log("Edit treatment", t);
    setEditingTreatment({ ...t });
  };

  const handleCreateTreatment = async (e) => {
    e.preventDefault();
    const base = "";

    try {
      const res = await fetch(`${base}/api/treatments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTreatment)
      });
      if (!res.ok) throw new Error(res.statusText);
      const { treatment: created } = await res.json();

      // add to local list, reset form, and close modal
      setTreatments(prev => [created, ...prev]);
      setNewTreatment({
        name: "",
        description: "",
        price: 0,
        priceRange: "",
        discountAvailable: false,
        image: ""
      });
      setShowTreatmentsForm(false);
    } catch (err) {
      console.error("Create treatment error:", err);
    }
  };


  // Save edits back to the server
  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    const base = "";
    try {
      const res = await fetch(
        `${base}/api/treatments/${editingTreatment._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingTreatment.name,
            description: editingTreatment.description,
            price: editingTreatment.price,
            priceRange: editingTreatment.priceRange,
            discountAvailable: editingTreatment.discountAvailable,
            image: editingTreatment.image,
          }),
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const { treatment: updated } = await res.json();
      setTreatments((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setEditingTreatment(null);
    } catch (err) {
      console.error("Edit treatment error:", err);
    }
  };

  // Delete a treatment
  const handleDeleteTreatment = (id) => {
    if (!window.confirm("Delete this treatment?")) return;
    const base = "";
    fetch(`${base}/api/treatments/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        setTreatments((prev) => prev.filter((t) => t._id !== id));
      })
      .catch((err) => console.error("Delete treatment error:", err));
  };

  // Reset showAppointmentForm whenever tab changes
  useEffect(() => {
    setShowAppointmentForm(false);
  }, [activeTab]);

  // Reset showPatientForm whenever tab changes
  useEffect(() => {
    setShowPatientForm(false);
  }, [activeTab]);

  // Reset showStaffForm whenever tab changes
  useEffect(() => {
    setShowStaffForm(false);
  }, [activeTab]);

  if (!role)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  const adminTabs = [
    { key: "appointments", label: "Manage Appointments" },
    { key: "patients", label: "Manage Patient Records" },
    { key: "staff", label: "Manage Staff Records" },
    { key: "treatments", label: "Manage Treatments" },
  ];

  const patientTabs = [
    { key: "upcomingAppointments", label: "Upcoming Appointments" },
    { key: "treatmentHistory", label: "Treatment History" },
    { key: "profile", label: "Update Profile" },
  ];

  // Place renderTabs inside Dashboard, before return
  const renderTabs = (tabs) => (
    <div className="flex justify-center mb-6">
      <nav className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 transition ${activeTab === tab.key
              ? "border-[#661043] text-[#661043]"
              : "border-transparent text-gray-600 hover:text-[#661043]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );


  // Dynamic button config based on activeTab
  const getActionButton = () => {
    if (role === "admin" || role === "receptionist") {
      switch (activeTab) {
        case "appointments":
          return {
            label: "+ New Appointment",
            onClick: () => setShowAppointmentForm(true),
          };
        case "patients":
          return {
            label: "+ New Patient",
            onClick: () => setShowPatientForm(true),
          };
        case "staff":
          return {
            label: "+ New Staff",
            onClick: () => setShowStaffForm(true),
          };
        case "treatments":
          return {
            label: "+ New Treatment",
            onClick: () => setShowTreatmentsForm(true),
          };
        default:
          return null;
      }
    } else if (role === "patient") {
      if (activeTab === "upcomingAppointments") {
        return {
          label: "+ New Appointment",
          onClick: () => setShowAppointmentForm(true),
        };
      }
      return null;
    }
    return null;
  };

  const handleEdit = (appt) => {
    console.log("Edit appointment", appt);
    setEditingAppt({ ...appt });
    // setSelectedAppointment(appt);
    // setShowEditModal(true);
  };


  const handleSaveEdit = (e) => {
    e.preventDefault();
    console.log("Saving edits for:", editingAppt);

    const base = "";
    fetch(`${base}/api/appointments/${editingAppt._id}`, {
      method: "PATCH",
      credentials: "include",               // send your JWT cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: editingAppt.patientName,
        appointmentDate: editingAppt.appointmentDate,
        patientName: editingAppt.patientName,
        appointmentDate: editingAppt.appointmentDate,
        status: editingAppt.status
        // add any other fields you let the user edit
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ appointment }) => {
        // replace the one in state with the server-returned version
        setUpcomingAppointments(prev =>
          prev.map(a => (a._id === appointment._id ? appointment : a))
        );
        setEditingAppt(null);
      })
      .catch(err => console.error("Edit error:", err));
  };

  const handleConfirm = (id) => {
    console.log("Confirming appointment ID:", id);
    const base = "";
    fetch(`${base}/api/appointments/${id}`, {
      method: "PATCH",
      credentials: "include",              // send your JWT cookie
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "status": "confirmed" })
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ appointment }) => {
        // backend returns { message, appointment }
        setUpcomingAppointments(prev =>
          prev.map(appt =>
            appt._id === id ? appointment : appt
          )
        );
      })
      .catch(err => console.error("Confirm error:", err));
  };



  const handleDelete = (id) => {
    console.log("Deleting appointment ID:", id);

    if (confirm("Are you sure you want to delete this appointment?")) {
      const base = "";

      fetch(`${base}/api/appointments/${id}`, {
        method: "DELETE",
        credentials: "include"     // send your JWT cookie
      })
        .then(res => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then(() => {
          // remove from state once server confirms deletion
          setUpcomingAppointments(prev =>
            prev.filter(appt => appt._id !== id)
          );
        })
        .catch(err => console.error("Delete error:", err));
    }
  };



  // Render content based on active tab and form visibility
  const renderContent = () => {
    if (role === "admin" || role === "receptionist") {
      switch (activeTab) {
        // case "appointments":
        //   if (showAppointmentForm) {
        //     return <AppointmentForm title="New Appointment" onClose={() => setShowAppointmentForm(false)} />;
        //   }
        //   return <p>Here you can manage appointments — list, edit, cancel, etc.</p>;
        case "appointments":
          if (showAppointmentForm) {
            return (
              <AppointmentForm
                title="New Appointment"
                onClose={() => setShowAppointmentForm(false)}
              />
            );
          }

          if (editingAppt) {
            return (
              <section className="bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">
                  Edit Appointment
                </h2>
                <div className="relative max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
                  { /* Close button */}
                  <button
                    onClick={() => setEditingAppt(null)}
                    type="button"
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold focus:outline-none"
                    aria-label="Close"
                  >
                    &times;
                  </button>

                  <form onSubmit={handleSaveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Patient Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Name
                      </label>
                      <input
                        id="patientName"
                        name="patientName"
                        type="text"
                        value={editingAppt.patientName}
                        onChange={(e) => setEditingAppt({ ...editingAppt, patientName: e.target.value })}
                        required
                        placeholder="Enter patient name"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      />
                    </div>

                    {/* Patient Phone */}
                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={editingAppt.phone}
                        onChange={(e) => setEditingAppt({ ...editingAppt, phone: e.target.value })}
                        required
                        placeholder="Enter contact number"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      />
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={editingAppt.status}
                        onChange={(e) => setEditingAppt({ ...editingAppt, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Appointment Date */}
                    <div className="sm:col-span-2">
                      <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Date
                      </label>
                      <input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="date"
                        value={editingAppt.appointmentDate.split("T")[0]}
                        onChange={(e) => setEditingAppt({ ...editingAppt, appointmentDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#661043] hover:bg-[#47062b] text-white font-medium rounded-md text-sm transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            );
          }

          return (
            <div>
              {/* UPCOMING */}
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border mb-8">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Patient</th>
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appt) => (
                      <tr key={appt.id} className="text-center">
                        <td className="border px-4 py-2">{appt.patientName}</td>
                        <td className="border px-4 py-2">{appt.appointmentDate.split("T")[0]}</td>
                        <td className="border px-4 py-2">{appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</td>
                        <td className="border px-4 py-2 space-x-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(appt)}>Edit</button>
                          {appt.status.toLowerCase() === "pending" && (
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => handleConfirm(appt._id)}>Confirm</button>
                          )}
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(appt._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* HISTORY */}
              <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Patient</th>
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousAppointments.map((appt) => (
                      <tr key={appt.id} className="text-center">
                        <td className="border px-4 py-2">{appt.patientName}</td>
                        <td className="border px-4 py-2">{appt.appointmentDate.split("T")[0]}</td>
                        <td className="border px-4 py-2">{appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br /><br />
            </div>
          );
        // case "patients":
        //   return <p>Here you can view and edit patient records.</p>;
        case "patients":
          if (showPatientForm) {
            return (
              <UserRegisterForm title="Register Patient" role="Patient" onClose={() => setShowPatientForm(false)} />

            );
          }

          if (editingPatient) {
            return (
              <section className="bg-white">
                <h2 className="text-2xl font-bold text-center text-[#661043] mb-8">
                  Edit Patient
                </h2>
                <div className="relative max-w-md mx-auto p-6 bg-white rounded-xl shadow border border-gray-200">
                  <button
                    onClick={() => setEditingPatient(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
                  >
                    &times;
                  </button>
                  <form onSubmit={handleSavePatient} className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label htmlFor="editName" className="text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="editName"
                        type="text"
                        value={editingPatient.name}
                        onChange={e => setEditingPatient({ ...editingPatient, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                      <label htmlFor="editEmail" className="text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="editEmail"
                        type="email"
                        value={editingPatient.email}
                        onChange={e => setEditingPatient({ ...editingPatient, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col">
                      <label htmlFor="editPhone" className="text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="editPhone"
                        type="tel"
                        value={editingPatient.phone}
                        onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Save / Cancel */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setEditingPatient(null)}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#661043] text-white rounded hover:bg-[#47062b]"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            );
          }
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Phone</th>
                      <th className="border px-4 py-2">Registered At</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient._id} className="text-center">
                        <td className="border px-4 py-2">{patient.name}</td>
                        <td className="border px-4 py-2">{patient.email}</td>
                        <td className="border px-4 py-2">{patient.phone}</td>
                        <td className="border px-4 py-2">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                            onClick={() => handleEditPatient(patient)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            onClick={() => handleDeletePatient(patient._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br />
              <br />
            </div>
          );
        // case "staff":
        //   return <p>Here you can manage staff members.</p>;
        case "staff":
          if (showStaffForm) {
            return (
              <UserRegisterForm title="Register Staff" role="Staff" onClose={() => setShowStaffForm(false)} />
            );
          }
          if (editingStaff) {
            return (
              <section className="bg-white">
                <h2 className="text-2xl font-bold text-center text-[#661043] mb-8">
                  Edit Staff
                </h2>
                <div className="relative max-w-md mx-auto p-6 bg-white rounded-xl shadow border border-gray-200">
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
                  >
                    &times;
                  </button>
                  <form onSubmit={handleSaveStaff} className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label htmlFor="editName" className="text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="editName"
                        type="text"
                        value={editingStaff.name}
                        onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                      <label htmlFor="editEmail" className="text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="editEmail"
                        type="email"
                        value={editingStaff.email}
                        onChange={e => seteditingStaff({ ...editingStaff, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col">
                      <label htmlFor="editPhone" className="text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="editPhone"
                        type="tel"
                        value={editingStaff.phone}
                        onChange={e => seteditingStaff({ ...editingStaff, phone: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Save / Cancel */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => seteditingStaff(null)}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#661043] text-white rounded hover:bg-[#47062b]"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            );
          }
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">Clinic Staff</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Role</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((staff) => (
                      <tr key={staff.id} className="text-center">
                        <td className="border px-4 py-2">{staff.name}</td>
                        <td className="border px-4 py-2">{staff.email}</td>
                        <td className="border px-4 py-2">{staff.role}</td>
                        <td className="border px-4 py-2 space-x-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => handleEditStaff(staff)}>
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDeleteStaff(staff._id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br /><br />
            </div>
          );
        case "treatments":
          if (showTreatmentsForm) {
            return (
              <section className="bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">
                  New Treatment
                </h2>
                <div className="relative max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
                  <button
                    onClick={() => setShowTreatmentsForm(false)}
                    type="button"
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold focus:outline-none"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <form onSubmit={handleCreateTreatment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="newName"
                        name="name"
                        type="text"
                        value={newTreatment.name}
                        onChange={e => setNewTreatment({ ...newTreatment, name: e.target.value })}
                        required
                        placeholder="Treatment name"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label htmlFor="newDesc" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="newDesc"
                        name="description"
                        value={newTreatment.description}
                        onChange={e => setNewTreatment({ ...newTreatment, description: e.target.value })}
                        required
                        placeholder="Short description"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    {/* Price */}
                    <div>
                      <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        id="newPrice"
                        name="price"
                        type="number"
                        value={newTreatment.price}
                        onChange={e => setNewTreatment({ ...newTreatment, price: e.target.valueAsNumber })}
                        required
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    {/* Price Range */}
                    <div>
                      <label htmlFor="newRange" className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <input
                        id="newRange"
                        name="priceRange"
                        type="text"
                        value={newTreatment.priceRange}
                        onChange={e => setNewTreatment({ ...newTreatment, priceRange: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    {/* Discount */}
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        id="newDiscount"
                        name="discountAvailable"
                        type="checkbox"
                        checked={newTreatment.discountAvailable}
                        onChange={e => setNewTreatment({ ...newTreatment, discountAvailable: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <label htmlFor="newDiscount" className="text-sm text-gray-700">
                        Discount Available
                      </label>
                    </div>
                    {/* Image URL */}
                    <div className="sm:col-span-2">
                      <label htmlFor="newImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        id="newImage"
                        name="image"
                        type="text"
                        value={newTreatment.image}
                        onChange={e => setNewTreatment({ ...newTreatment, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    {/* Submit */}
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#661043] hover:bg-[#47062b] text-white rounded-md text-sm font-medium"
                      >
                        Add Treatment
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            );
          }
          if (editingTreatment) {
            return (
              <section className="bg-white">
                <h2 className="text-2xl font-bold text-center text-[#661043] mb-8">
                  Edit Treatment
                </h2>
                <div className="relative max-w-md mx-auto p-6 bg-white rounded-xl shadow border border-gray-200">
                  <button
                    onClick={() => setEditingTreatment(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                  >
                    &times;
                  </button>
                  <form onSubmit={handleSaveTreatment} className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label htmlFor="treatName" className="text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="treatName"
                        type="text"
                        value={editingTreatment.name}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, name: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col">
                      <label htmlFor="treatDesc" className="text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="treatDesc"
                        value={editingTreatment.description}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, description: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col">
                      <label htmlFor="treatPrice" className="text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        id="treatPrice"
                        type="number"
                        value={editingTreatment.price}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, price: e.target.valueAsNumber })
                        }
                        required
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Price Range */}
                    <div className="flex flex-col">
                      <label htmlFor="treatRange" className="text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <input
                        id="treatRange"
                        type="text"
                        value={editingTreatment.priceRange}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, priceRange: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Discount Available */}
                    <div className="flex items-center gap-2">
                      <input
                        id="treatDiscount"
                        type="checkbox"
                        checked={editingTreatment.discountAvailable}
                        onChange={(e) =>
                          setEditingTreatment({
                            ...editingTreatment,
                            discountAvailable: e.target.checked,
                          })
                        }
                        className="h-4 w-4"
                      />
                      <label htmlFor="treatDiscount" className="text-sm text-gray-700">
                        Discount Available
                      </label>
                    </div>
                    {/* Image URL */}
                    <div className="flex flex-col">
                      <label htmlFor="treatImage" className="text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        id="treatImage"
                        type="text"
                        value={editingTreatment.image}
                        onChange={(e) =>
                          setEditingTreatment({ ...editingTreatment, image: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setEditingTreatment(null)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#661043] text-white rounded hover:bg-[#47062b]"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )
          }
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Treatments</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Description</th>
                      <th className="border px-4 py-2">Price</th>
                      <th className="border px-4 py-2">Price Range</th>
                      <th className="border px-4 py-2">Discount</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((t) => (
                      <tr key={t._id} className="text-center">
                        <td className="border px-4 py-2">{t.name}</td>
                        <td className="border px-4 py-2">{t.description}</td>
                        <td className="border px-4 py-2">Rs. {t.price}</td>
                        <td className="border px-4 py-2">{t.priceRange}</td>
                        <td className="border px-4 py-2">
                          {t.discountAvailable ? 'Yes' : 'No'}
                        </td>
                        <td className="border px-4 py-2 space-x-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            onClick={() => handleEditTreatment(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            onClick={() => handleDeleteTreatment(t._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
                <br />
                <br />
              </div>
            </div>

          );
        default:
          return <p>Select an option above.</p>;
      }
    } else if (role === "patient") {
      switch (activeTab) {
        case "upcomingAppointments":
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your Upcoming Appointments
              </h2>
              <ul className="space-y-3">
                {upcomingAppointments.map((appt) => {
                  const dt = new Date(appt.appointmentDate);
                  const date = dt.toLocaleDateString();
                  const time = dt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <li
                      key={appt._id}
                      className="p-4 bg-gray-50 border rounded shadow-sm"
                    >
                      <p>
                        <strong>Date:</strong> {date} at {time}
                      </p>
                      <p>
                        <strong>Doctor:</strong>{" "}
                        {appt.doctor || "—"} {/* or however you attach a doctor */}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <br />
              <br />
            </div>
          );
        // case "treatmentHistory":
        //   return <p>Your past treatments and history are shown here.</p>;
        case "treatmentHistory":
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">Treatment History</h2>
              <ul className="space-y-3">
                {treatmentHistory.map((treatment) => (
                  <li
                    key={treatment.id}
                    className="p-4 bg-gray-50 border rounded shadow-sm"
                  >
                    <p><strong>Date:</strong> {treatment.date}</p>
                    <p><strong>Type:</strong> {treatment.type}</p>
                    <p><strong>Doctor:</strong> {treatment.doctor}</p>
                    <p><strong>Notes:</strong> {treatment.notes}</p>
                    <p><strong>Total Billed Amount:</strong> Rs. {treatment.totalPrice}</p>
                    <button
                      onClick={() => {
                        // TODO: Implement PDF bill download logic here
                        console.log(`Download bill for treatment ID ${treatment.id}`);
                      }}
                      className="mt-2 px-4 py-1 bg-[#661043] hover:bg-[#47062b] text-white rounded"
                    >
                      Download Bill
                    </button>
                    <span> </span>
                    <button
                      onClick={() => {
                        // TODO: Implement PDF bill download logic here
                        console.log(`Share bill for treatment ID ${treatment.id} on WhatsApp`);
                      }}
                      className="mt-2 px-4 py-1 bg-[#25D366] hover:bg-[#075E54  ] text-white rounded"
                    >
                      Share Bill on WhatsApp
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );

        // case "profile":
        //   return <p>Update your profile information here.</p>;
        case "profile":
          return (
            <div>
              <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
              <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border rounded shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Name", name: "name", type: "text", required: true },
                    { label: "Email", name: "email", type: "email", required: true },
                    { label: "Phone", name: "phone", type: "text", required: true },
                    { label: "Address", name: "address", type: "text", required: false },
                    { label: "Age", name: "age", type: "number", required: false, min: 0 },
                    { label: "Old Password", name: "oldPassword", type: "password", required: false },
                    { label: "New Password", name: "newPassword", type: "password", required: false },
                    { label: "Confirm Password", name: "confirmPassword", type: "password", required: false },
                  ].map(({ label, name, type, required, min }) => (
                    <div key={name} className="flex flex-col">
                      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}{required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id={name}
                        name={name}
                        type={type}
                        min={min}
                        required={required}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={label}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Show mismatch warning if passwords don’t match */}
                {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="text-red-600 text-sm">New password and confirmation do not match.</p>
                )}

                <button
                  type="submit"
                  disabled={!!(formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)}
                  className="w-full py-2 px-4 bg-[#661043] hover:bg-[#47062b] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Profile
                </button>
              </form>
            </div>

          );


        default:
          return <p>Select an option above.</p>;
      }
    } else {
      return <p className="text-red-600 font-semibold">Invalid role detected.</p>;
    }
  };

  const actionButton = getActionButton();

  return (
    <div>
      <DashboardNavbar
        role={role}
        username={username}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => {
          localStorage.removeItem("userRole");
          sessionStorage.removeItem("userRole");
          navigate("/login");
        }}
      />

      <h1 className="text-4xl font-extrabold text-[#661043] mt-6 mb-4 text-center">
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h1>

      <div>
        {role === "admin" || role === "receptionist"
          ? renderTabs(adminTabs)
          : role === "patient"
            ? renderTabs(patientTabs)
            : null}
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 min-h-[200px] relative">
        {renderContent()}

        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="absolute bottom-6 left-8 bg-[#661043] hover:bg-[#47062b] text-white px-6 py-3 rounded shadow-lg transition"
          >
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
