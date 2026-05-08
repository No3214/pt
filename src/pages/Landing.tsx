import { Suspense, lazy, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import SEO from '../components/SEO';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Marquee from '../components/landing/Marquee';
import { GrainOverlay } from '../components/landing/LandingUI';
import { VolleyballScrollRoller, VolleyballCursorTrail } from '../components/animations/Volleyball';
import ScrollReveal from '../components/animations/ScrollReveal';

// Below-the-fold sections — lazy-loaded so the initial `index` chunk only
// carries above-the-fold UI (Navbar + Hero + Marquee). Chunks are named so
// the bundle audit can recognise them as opt-in on-demand payloads.
const MissionStatement = lazy(() => import(/* webpackChunkName: "landing-mission" */ '../components/landing/MissionStatement'));
const About = lazy(() => import(/* webpackChunkName: "landing-about" */ '../components/landing/About'));
const HowItWorks = lazy(() => import(/* webpackChunkName: "landing-how" */ '../components/landing/HowItWorks'));
const Stats = lazy(() => import(/* webpackChunkName: "landing-stats" */ '../components/landing/Stats'));
const Gallery = lazy(() => import(/* webpackChunkName: "landing-gallery" */ '../components/landing/Gallery'));
const TrainingScenes = lazy(() => import(/* webpackChunkName: "landing-scenes" */ '../components/landing/TrainingScenes'));
const Testimonials = lazy(() => import(/* webpackChunkName: "landing-testimonials" */ '../components/landing/Testimonials'));
const Programs = lazy(() => import(/* webpackChunkName: "landing-programs" */ '../components/landing/Programs'));
const LeadMagnet = lazy(() => import(/* webpackChunkName: "landing-lead" */ '../components/landing/LeadMagnet'));
const AssessmentCTA = lazy(() => import(/* webpackChunkName: "landing-assessment-cta" */ '../components/landing/AssessmentCTA'));
const FAQ = lazy(() => import(/* webpackChunkName: "landing-faq" */ '../components/landing/FAQ'));
const Contact = lazy(() => import(/* webpackChunkName: "landing-contact" */ '../components/landing/Contact'));
const Footer = lazy(() => import(/* webpackChunkName: "landing-footer" */ '../components/landing/Footer'));

// Sprint 1 Components
const AuthorityStrip = lazy(() => import(/* webpackChunkName: "sprint1-authority" */ '../components/sprint1/AuthorityStrip'));
const PortalPreview = lazy(() => import(/* webpackChunkName: "sprint1-portal" */ '../components/sprint1/PortalPreview'));
const PricingAnchor = lazy(() => import(/* webpackChunkName: "sprint1-pricing" */ '../components/sprint1/PricingAnchor'));
const SystemBenefits = lazy(() => import(/* webpackChunkName: "landing-benefits" */ '../components/landing/SystemBenefits'));
const PartnerSection = lazy(() => import(/* webpackChunkName: "landing-partner" */ '../components/landing/PartnerSection'));

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
        <div className="-mt-12 md:-mt-16">
          <Marquee />
        </div>
        <Suspense fallback={<Placeholder h={600} />}>
          <MissionStatement />
        </Suspense>
        <Suspense fallback={<Placeholder h={160} />}>
          <ScrollReveal preset="fadeUp"><AuthorityStrip /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><About /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><HowItWorks /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={400} />}>
          <ScrollReveal preset="scaleIn"><Stats /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={500} />}>
          <ScrollReveal preset="fadeUp"><Gallery /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={520} />}>
          <ScrollReveal preset="fadeUp"><TrainingScenes /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><PortalPreview /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={500} />}>
          <ScrollReveal preset="fadeUp"><Testimonials /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={420} />}>
          <ScrollReveal preset="scaleIn"><AssessmentCTA /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={700} />}>
          <ScrollReveal preset="fadeUp">
            <Programs />
            <div className="max-w-[1400px] mx-auto px-8 md:px-12 mt-12">
              <PricingAnchor />
            </div>
          </ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={400} />}>
          <ScrollReveal preset="fadeUp"><SystemBenefits /></ScrollReveal>
        </Suspense>
        <Suspense fallback={<Placeholder h={600} />}>
          <ScrollReveal preset="fadeUp"><PartnerSection /></ScrollReveal>
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
