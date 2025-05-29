import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (section) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${section}`;
    } else {
      const el = document.getElementById(section);
      if (el) {
        const yOffset = -80; // Adjust based on your navbar height
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };


  const handleAppointmentClick = () => {
    navigate('/bookappointment');
  };

  return (
    <header className="bg-[#661043] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <img src="/Logo.png" alt="=Logo" className="w-[50px] h-[50px]" />
          <span className="font-bold text-xl md:text-2xl tracking-tight text-white">
            AEZAL DENTAL CLINIC
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => handleScroll('home')} className="text-white hover:text-blue-500 cursor-pointer">Home</button>
          <button onClick={() => handleScroll('about')} className="text-white hover:text-blue-500 cursor-pointer">About</button>
          <button onClick={() => handleScroll('services')} className="text-white hover:text-blue-500 cursor-pointer">Services</button>
          <Link to="/login" className="text-white hover:text-blue-500 cursor-pointer">Login</Link>
          <button
            onClick={handleAppointmentClick}
            className="bg-white hover:bg-[#47062b] text-[#47062b] hover:text-white px-4 py-2 rounded text-sm cursor-pointer"
          >
            Book an Appointment
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none cursor-pointer">
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white border-t">
          <button onClick={() => handleScroll('home')} className="block w-full text-left bg-white text-[#47062b] cursor-pointer">Home</button>
          <button onClick={() => handleScroll('about')} className="block w-full text-left bg-white text-[#47062b] cursor-pointer">About</button>
          <button onClick={() => handleScroll('services')} className="block w-full text-left bg-white text-[#47062b] cursor-pointer">Services</button>
          <Link to="/login" className="block w-full text-left bg-white text-[#47062b] cursor-pointer">Login</Link>
          <button
            onClick={handleAppointmentClick}
            className="w-full bg-[#a36] hover:bg-[#47062b] text-white px-4 py-2 rounded text-sm cursor-pointer"
          >
            Book an Appointment
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
