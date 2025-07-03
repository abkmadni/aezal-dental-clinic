import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './components/Login';
import Register from './components/Register';
import BookAppointment from './components/BookAppointment';
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Unauthorized from './components/Unauthorized';

function App() {

  useEffect(() => {
    // Dynamically inject the Convai script once when App mounts
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      // clean up if App ever unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookappointment" element={<BookAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      <a
        href="https://wa.me/923152924704"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-0 z-50 translate-x-3/4 hover:translate-x-0 transition-transform duration-300 ease-in-out"
        title="Chat on WhatsApp"
      >
        <img
          src="/whatsapp-click-to-chat.png"
          alt="WhatsApp"
          className="h-14"
        />
      </a>

      {/* Convai chat widget: */}
      <elevenlabs-convai agent-id="agent_01jz7gfc88epka76jby40c6468" />


    </Router>



  );
}

export default App;