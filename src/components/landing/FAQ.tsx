import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { faqItems } from '../../data/landingData';
import { useStore } from '../../stores/useStore';

function FaqItem({ question, answer, index, dm }: { question: string; answer: string; index: number; dm: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} custom={index}
      className={`border-b transition-colors duration-300 ${open ? 'border-primary/20' : 'border-text-main/5 hover:border-text-main/15'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-8 text-left bg-transparent border-none cursor-pointer group"
      >
        <span className={`font-display text-[1.25rem] font-bold pr-8 transition-all duration-500 ${open ? 'text-primary' : 'text-text-main group-hover:text-text-main/80'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            open
              ? 'bg-primary text-white shadow-lg'
              : `bg-text-main/5 text-text-main/30 group-hover:bg-text-main/10 group-hover:text-text-main/50`
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className={`pb-8 text-[1.05rem] leading-[1.8] max-w-[720px] ${dm ? 'text-white/40' : 'text-text-main/45 font-medium'}`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { darkMode } = useStore();
  return (
    <section className="py-32 md:py-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
              Soru & Cevap
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-display text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-text-main">
              Merak ettiklerin,
              <br />bilmen gerekenler.
            </motion.h2>
          </RevealSection>

          <RevealSection className="border-t border-text-main/5">
            {faqItems.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} dm={darkMode} />
            ))}
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
