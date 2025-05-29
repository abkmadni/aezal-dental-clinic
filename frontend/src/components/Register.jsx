import { useState } from "react";
import Navbar from '../components/Navbar';
import { Link, useNavigate } from "react-router-dom";

const navigate = useNavigate;

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "patient",
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login"); // or navigate to dashboard if you want
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
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
          {/* Register Form */}
          <div className="w-full max-w-md px-4 sm:px-6 mt-10 mb-10">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-800">Register</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
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

                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-2 px-4 bg-[#661043] hover:bg-[#47062b] text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Register
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-700">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Login
                    </Link>{" "}
                    instead.
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
