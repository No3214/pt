import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import ScrollToTop from '../components/ScrollToTop';

// Modular Components
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Stats from '../components/landing/Stats';
import Gallery from '../components/landing/Gallery';
import Programs from '../components/landing/Programs';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import { ScrollProgress, GrainOverlay } from '../components/landing/LandingUI';

export default function Landing() {
  const { darkMode } = useStore();

  useEffect(() => {
    // Ensure smooth scrolling for hydration
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div className={`font-body overflow-x-hidden min-h-screen ${darkMode ? 'dark bg-bg' : 'bg-bg'}`}>
      {/* Visual Enhancements */}
      <ScrollProgress />
      <GrainOverlay />
      <ScrollToTop />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Philosophy & About */}
      <About />

      {/* Key Metrics */}
      <Stats />

      {/* Voleybol & Spor Galerisi */}
      <Gallery />

      {/* Transformation Stories */}
      <Testimonials />

      {/* Program Categories & Selection */}
      <Programs />

      {/* Information & Trust */}
      <FAQ />

      {/* High-Conversion Lead Form */}
      <Contact />

      {/* Main Branding Footer */}
      <Footer />
    </div>
  );
}

