import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#661043] text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Clinic Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Aezal Dental Clinic</h3>
          <p className="text-sm">
            Shop #03, R-74, Block-B,<br />
            Gulshan-e-Millat, Korangi,<br />
            Sector 10, Karachi.
          </p>
          <p className="text-xs mt-2">Phone: 0315-2924704</p>
        </div>

        {/* Quick Links / Sitemap */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/services" className="hover:underline">Services</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Legal / Rights */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Legal</h3>
          <ul className="text-sm space-y-1">
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li>&copy; {new Date().getFullYear()} Aezal Dental Clinic</li>
            <li className="text-xs">Your smile, our priority.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
