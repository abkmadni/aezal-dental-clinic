import React, { useState } from "react";
import { X, Menu } from "lucide-react";

const DashboardNavbar = ({ role, username, activeTab, onTabChange, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#661043] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Title */}
        <div className="flex items-center gap-4">
          <img src="/Logo.png" alt="Logo" className="w-[50px] h-[50px]" />
          <span className="font-bold text-xl md:text-2xl tracking-tight text-white">
            AEZAL DENTAL CLINIC
          </span>
        </div>

        {/* Welcome message instead of tabs */}
        <div className="text-white font-bold text-xl md:text-2xl">
          Welcome, {username || "User"}!
        </div>

        {/* Logout button */}
        <nav className="hidden md:flex items-center">
          <button
            onClick={onLogout}
            className="ml-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: just Logout button and welcome message */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#661043] px-4 pb-4 space-y-3">
          <div className="text-white font-bold text-lg px-3 py-2">
            Welcome, {username || "User"}!
          </div>
          <button
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
