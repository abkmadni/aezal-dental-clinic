import { useState } from "react";
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    emailPhone: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Local admin login check
    if (formData.emailPhone === "admin@test.com" && formData.password === "test123") {
      const role = "admin";
      if (rememberMe) {
        localStorage.setItem("userRole", role);
      } else {
        sessionStorage.setItem("userRole", role);
      }
      navigate("/admin/dashboard");
      return;
    }

    // Local patient login check
    if (formData.emailPhone === "patient@test.com" && formData.password === "test123") {
      const role = "patient";
      if (rememberMe) {
        localStorage.setItem("userRole", role);
      } else {
        sessionStorage.setItem("userRole", role);
      }
      navigate("/patient/dashboard");
      return;
    }

    // Local receptionist login check
    if (formData.emailPhone === "receptionist@test.com" && formData.password === "test123") {
      const role = "receptionist";
      if (rememberMe) {
        localStorage.setItem("userRole", role);
      } else {
        sessionStorage.setItem("userRole", role);
      }
      navigate("/admin/dashboard");
      return;
    }

    // Otherwise, backend login fetch
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Assuming backend sends back user role as plain string in data.role
      const role = data.user?.role;
      const username = data.user?.name;

      if (rememberMe) {
        localStorage.setItem("username", username);
      } else {
        sessionStorage.setItem("username", username);
      }

      if (rememberMe) {
        localStorage.setItem("userRole", role);
      } else {
        sessionStorage.setItem("userRole", role);
      }

      if (role === "admin" || role === "receptionist") {
        navigate("/admin/dashboard");
      } else if (role === "patient") {
        navigate("/patient/dashboard");
      } else {
        alert("Unknown role. Access denied.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
          {/* Login Form */}
          <div className="w-full max-w-md px-4 sm:px-6">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-800">Login</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label
                    htmlFor="emailPhone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email Address / Phone
                  </label>
                  <input
                    id="emailPhone"
                    name="emailPhone"
                    type="email"
                    value={formData.emailPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember Me
                    </label>
                  </div>
                  <div>
                    <a className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                      Forgot Your Password?
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-2 px-4 bg-[#661043] hover:bg-[#47062b] text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-700">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Register
                    </Link>{" "}
                    Now.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
