import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
// Modular Components
import SEO from '../components/SEO';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Marquee from '../components/landing/Marquee';
import About from '../components/landing/About';
import HowItWorks from '../components/landing/HowItWorks';
import Stats from '../components/landing/Stats';
import Gallery from '../components/landing/Gallery';
import Testimonials from '../components/landing/Testimonials';
import Programs from '../components/landing/Programs';
import LeadMagnet from '../components/landing/LeadMagnet';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import AuthorityStrip from '../components/sprint1/AuthorityStrip';
import PortalPreview from '../components/sprint1/PortalPreview';
import { GrainOverlay } from '../components/landing/LandingUI';
import { VolleyballDivider, VolleyballScrollRoller, VolleyballCursorTrail } from '../components/animations/Volleyball';

export default function Landing() {
  const { darkMode } = useStore();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div className={`font-body overflow-x-hidden min-h-screen ${darkMode ? 'dark bg-bg' : 'bg-bg'}`}>
      {/* SEO Meta Tags & Structured Data */}
      <SEO />

      {/* Visual Enhancements */}
      <GrainOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Scroll progress — voleybol topu yuvarlanarak ilerler */}
      <VolleyballScrollRoller top={72} />

      {/* Cursor trail — desktop-only premium mikroetkileşim */}
      <VolleyballCursorTrail size={20} />

      {/* Hero Section */}
      <main id="ana-icerik">
      <Hero />

      {/* Authority Strip */}
      <AuthorityStrip />

      {/* Infinite Scroll Trust Banner */}
      <Marquee />

      {/* Philosophy & About */}
      <About />

      {/* How It Works — 3 Step Process */}
      <HowItWorks />

      {/* Portal Preview */}
      <PortalPreview />

      {/* Key Metrics */}
      <Stats />

      {/* Voleybol divider — net + zıplayan top */}
      <VolleyballDivider className="my-4" />

      {/* Voleybol & Sports Gallery */}
      <Gallery />

      {/* Transformation Stories */}
      <Testimonials />

      {/* Program Categories & Pricing */}
      <Programs />

      {/* Lead Magnet — Free PDF email capture */}
      <LeadMagnet />

      {/* FAQ */}
      <FAQ />

      {/* High-Conversion Lead Form */}
      <Contact />

      {/* Footer */}
      <Footer />
      </main>
    </div>
  );
}
