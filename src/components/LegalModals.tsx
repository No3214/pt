import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/useStore';
import { tenantConfig } from '../config/tenant';
import { useTranslation } from '../locales';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'kvkk' | 'terms';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const { t } = useTranslation();
  const dm = useStore(s => s.darkMode);
  const brandName = tenantConfig.brand.name;
  const email = tenantConfig.brand.contact.email;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-4 md:inset-x-auto md:inset-y-8 md:max-w-2xl md:mx-auto z-[401] rounded-2xl border overflow-hidden flex flex-col ${
              dm
                ? 'bg-[#111] border-white/[0.08] text-white'
                : 'bg-white border-black/[0.06] text-text-main'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <h2 className="font-display text-xl font-bold">
                {type === 'kvkk' ? t.legal.kvkk_title : t.legal.terms_title}
              </h2>
              <button
                onClick={onClose}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer ${
                  dm ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-black/5 text-text-main hover:bg-black/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
              {type === 'kvkk' ? (
                <KVKKContent brandName={brandName} email={email} dm={dm} />
              ) : (
                <TermsContent brandName={brandName} email={email} dm={dm} />
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-white rounded-full text-[0.82rem] font-semibold border-none cursor-pointer transition-all hover:shadow-lg"
              >
                {t.legal.btn_close}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ children, dm }: { children: React.ReactNode; dm: boolean }) {
  return <h3 className={`text-[1rem] font-display font-bold mt-6 mb-2 ${dm ? 'text-white' : 'text-text-main'}`}>{children}</h3>;
}

function P({ children, dm }: { children: React.ReactNode; dm: boolean }) {
  return <p className={`text-[0.85rem] leading-[1.8] mb-3 ${dm ? 'text-white/50' : 'text-text-main/60'}`}>{children}</p>;
}

function KVKKContent({ brandName, email, dm }: { brandName: string; email: string; dm: boolean }) {
  const { t } = useTranslation();
  const sections = t.legal.kvkk_sections;

  return (
    <div>
      <P dm={dm}>{t.legal.last_update}</P>
      <P dm={dm}>{t.legal.kvkk_intro.replace('{}', brandName)}</P>

      {Array.isArray(sections) && sections.map((section: { title: string; content: string }, idx: number) => (
        <div key={idx}>
          <SectionTitle dm={dm}>{section.title}</SectionTitle>
          <P dm={dm}>
            {section.content
              .replace('{}', brandName)
              .replace('{}', email)}
          </P>
        </div>
      ))}
    </div>
  );
}

function TermsContent({ brandName, email, dm }: { brandName: string; email: string; dm: boolean }) {
  const { t } = useTranslation();
  const sections = t.legal.terms_sections;

  return (
    <div>
      <P dm={dm}>{t.legal.last_update}</P>
      <P dm={dm}>{t.legal.terms_intro}</P>

      {Array.isArray(sections) && sections.map((section: { title: string; content: string }, idx: number) => (
        <div key={idx}>
          <SectionTitle dm={dm}>{section.title}</SectionTitle>
          <P dm={dm}>
            {section.content
              .replace('{}', brandName)
              .replace('{}', email)
              .replace('{}', brandName)}
          </P>
        </div>
      ))}
    </div>
  );
}
