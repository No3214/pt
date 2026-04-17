import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
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
import { GrainOverlay } from '../components/landing/LandingUI';
import { VolleyballDivider, VolleyballScrollRoller, VolleyballCursorTrail } from '../components/animations/Volleyball';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function Landing() {
  const { darkMode } = useStore();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  return (
    <div className={`font-body overflow-x-hidden min-h-screen ${darkMode ? 'dark bg-bg' : 'bg-bg'}`}>
      <SEO />
      <GrainOverlay />
      <Navbar />
      <VolleyballScrollRoller top={72} />
      <VolleyballCursorTrail size={20} />
      <main id="ana-icerik">
        <Hero />
        <Marquee />
        <ScrollReveal preset="fadeUp"><About /></ScrollReveal>
        <ScrollReveal preset="fadeUp"><HowItWorks /></ScrollReveal>
        <ScrollReveal preset="scaleIn"><Stats /></ScrollReveal>
        <VolleyballDivider className="my-4" />
        <ScrollReveal preset="fadeUp"><Gallery /></ScrollReveal>
        <ScrollReveal preset="fadeUp"><Testimonials /></ScrollReveal>
        <ScrollReveal preset="fadeUp"><Programs /></ScrollReveal>
        <ScrollReveal preset="scaleIn"><LeadMagnet /></ScrollReveal>
        <ScrollReveal preset="fadeUp"><FAQ /></ScrollReveal>
        <ScrollReveal preset="fadeUp"><Contact /></ScrollReveal>
        <Footer />
      </main>
    </div>
  );
}
