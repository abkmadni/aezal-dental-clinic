import { useState } from 'react';
import { CalendarCheck2 } from 'lucide-react';

export default function AppointmentForm({ title = "Book your Appointment now", onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        day: '',
        age: '',
        gender: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientName: formData.name,
                    phone: formData.phone,
                    age: formData.age,
                    gender: formData.gender,
                    appointmentDate: formData.day,
                    email: formData.email
                })
            });

            // Declare the variable
            const data = await response.json();

            if (!response.ok) {
                console.error('Server error response:', data);
                throw new Error(text || 'Something went wrong');
            }


            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', day: '', age: '', gender: '' });
            alert('Appointment request sent successfully!', data);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error:', error.message);
            alert('Failed to book appointment: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <section className="bg-white">
            {/* Dynamic heading here */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">
                {title}
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
                    <CalendarCheck2 className="text-blue-600 mr-2" size={22} />
                    <h2 className="text-xl font-bold text-gray-800">Book an Appointment</h2>
                </div>

                {success && (
                    <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded mb-4 text-sm text-center">
                        Appointment request sent successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Please enter your name"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        />
                    </div>

                    {/* Gender */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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


                    {/* Age */}
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                            Age
                        </label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            min="1"
                            max="120"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            placeholder="Please enter your age"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        />
                    </div>

                    {/* Contact No */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="03123456789"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        />
                    </div>

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
                            placeholder="Please enter your email address"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        />
                    </div>

                    {/* Preferred Day */}
                    <div className="sm:col-span-2">
                        <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Day
                        </label>
                        <input
                            id="day"
                            name="day"
                            type="date"
                            value={formData.day}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                        />
                    </div>

                    {/* Submit */}
                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition ${submitting ? 'bg-[#661043] cursor-not-allowed' : 'bg-[#661043] hover:bg-[#47062b] text-white'
                                }`}
                        >
                            {submitting ? 'Scheduling...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
