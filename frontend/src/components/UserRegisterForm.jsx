import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function UserRegisterForm({ title = "Register User", role = "patient", onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    staffRole: "", // Only relevant if role === 'Staff'
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    role = formData.staffRole || role;

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
          role: role.toLowerCase(),
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        onClose;
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">
        {title || `Register ${role}`}
      </h2>

      <div className="relative max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        )}
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="text-blue-600 mr-2" size={22} />
          <h2 className="text-xl font-bold text-gray-800">{role} Registration</h2>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4 text-sm text-center">
            {role} registered successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={`Enter ${role.toLowerCase()}'s full name`}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Age */}
          <div className="sm:col-span-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder={`Enter Age`}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={`Enter Phone Number`}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Gender */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4">
              {["Male", "Female"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    required
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Staff Role Selector (Only for Staff) */}
          {role === "Staff" && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Role</label>
              <div className="flex gap-4">
                {["Receptionist", "Admin"].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="staffRole"
                      value={r.toLowerCase()}
                      checked={formData.staffRole === r.toLowerCase()}
                      onChange={handleChange}
                      required
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Email */}
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={`Enter ${role.toLowerCase()}'s email`}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition ${submitting ? "bg-[#661043] cursor-not-allowed" : "bg-[#661043] hover:bg-[#47062b]"
                }`}
            >
              {submitting ? `Registering ${role}...` : `Register ${role}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
