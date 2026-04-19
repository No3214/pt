import { Suspense, lazy, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import SEO from '../components/SEO';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Marquee from '../components/landing/Marquee';
import { GrainOverlay } from '../components/landing/LandingUI';
import { VolleyballDivider, VolleyballScrollRoller, VolleyballCursorTrail } from '../components/animations/Volleyball';
import ScrollReveal from '../components/animations/ScrollReveal';

// Below-the-fold sections — lazy-loaded so the initial `index` chunk only
// carries above-the-fold UI (Navbar + Hero + Marquee). Chunks are named so
// the bundle audit can recognise them as opt-in on-demand payloads.
const About = lazy(() => import(/* webpackChunkName: "landing-about" */ '../components/landing/About'));
const HowItWorks = lazy(() => import(/* webpackChunkName: "landing-how" */ '../components/landing/HowItWorks'));
const Stats = lazy(() => import(/* webpackChunkName: "landing-stats" */ '../components/landing/Stats'));
const Gallery = lazy(() => import(/* webpackChunkName: "landing-gallery" */ '../components/landing/Gallery'));
const Testimonials = lazy(() => import(/* webpackChunkName: "landing-testimonials" */ '../components/landing/Testimonials'));
const Programs = lazy(() => import(/* webpackChunkName: "landing-programs" */ '../components/landing/Programs'));
const LeadMagnet = lazy(() => import(/* webpackChunkName: "landing-lead" */ '../components/landing/LeadMagnet'));
const FAQ = lazy(() => import(/* webpackChunkName: "landing-faq" */ '../components/landing/FAQ'));
const Contact = lazy(() => import(/* webpackChunkName: "landing-contact" */ '../components/landing/Contact'));
const Footer = lazy(() => import(/* webpackChunkName: "landing-footer" */ '../components/landing/Footer'));

// Min-height placeholder keeps CLS near zero while the section chunk streams in.
function Placeholder({ h = 400 }: { h?: number }) {
  return <div aria-hidden style={{ minHeight: h }} />;
}

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
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><About /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><HowItWorks /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={400} />}>
          <ScrollReveal preset="scaleIn"><Stats /></ScrollReveal>
        </Suspense>
        <VolleyballDivider className="my-4" />
        <Suspense fallback={<Placeholder h={500} />}>
          <ScrollReveal preset="fadeUp"><Gallery /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={500} />}>
          <ScrollReveal preset="fadeUp"><Testimonials /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={700} />}>
          <ScrollReveal preset="fadeUp"><Programs /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={400} />}>
          <ScrollReveal preset="scaleIn"><LeadMagnet /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={500} />}>
          <ScrollReveal preset="fadeUp"><FAQ /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><Contact /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={300} />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}
