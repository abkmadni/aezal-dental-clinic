import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 15,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 15,
        },
      },
    },
  });

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3500);
    return () => clearInterval(interval);
  }, [instanceRef]);

  // Fetch treatments
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch("/api/treatments");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch treatments:", err);
      }
    };

    fetchTreatments();
  }, []);

  const handleAppointmentClick = () => {
    navigate("/bookappointment");
  };

  return (
    <section className="py-16 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#661043] mb-12">
        Our Featured Services
      </h2>
      <div className="overflow-hidden px-4">
        {/* ⚠️ Key forces Keen Slider to re-init when services are loaded */}
        <div ref={sliderRef} key={services.length} className="keen-slider">
          {services.map((s, i) => (
            <div
              key={s._id || i}
              className="keen-slider__slide bg-blue-50 rounded-xl shadow-md p-4"
            >
              <img
                src={s.image || "/default-treatment.jpg"}
                alt={s.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="p-4 flex flex-col items-start">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{s.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                <button
                  onClick={handleAppointmentClick}
                  className="mt-auto bg-[#661043] text-white px-4 py-2 rounded hover:bg-[#47062b] text-sm"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
