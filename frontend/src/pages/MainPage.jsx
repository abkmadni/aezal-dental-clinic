import React, { useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Footer from '../components/Footer';
import About from '../components/About';
import FAQ from '../components/FAQ';
import ContactForm from '../components/AppointmentForm';

export default function MainPage() {
  const scrollToHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToHash();
  }, []);

  return (
    <>
      <Navbar />
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="faq"><FAQ /></section>
      <section id="footer"><Footer /></section>
    </>
  );
}
