import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Target, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import LegalModal from '../../components/LegalModals';
import { useTranslation } from '../../locales';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function OnboardingForm() {
  const { t } = useTranslation();
  const { addLead, darkMode: dm, showToast } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [legalType, setLegalType] = useState<'kvkk' | 'terms'>('kvkk');
  const [isLegalModalOpen, setLegalModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', goal: '',
    age: '', height: '', weight: '',
    healthIssues: '', allergies: '', message: ''
  });

  const handleSubmit = async () => {
    addLead(formData);
    showToast(t.forms.onboarding.toast_success);
    setIsSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-bg text-text-main' : 'bg-[#FAF6F1]'}`}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{t.forms.onboarding.success_title}</h2>
          <p className="opacity-60 max-w-sm mx-auto">{t.forms.onboarding.success_desc}</p>
        </motion.div>
      </div>
    );
  }

  const o = t.forms.onboarding;

  return (
    <div className={`min-h-screen py-20 px-6 ${dm ? 'bg-bg text-text-main font-sans' : 'bg-[#FAF6F1] font-sans'}`}>
      <div className="max-w-xl mx-auto">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-text-main/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} variants={fadeUp} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">{o.step1_title}</h1>
                <p className="opacity-50 font-medium">{o.step1_desc}</p>
              </div>

              <div className="space-y-4">
                <InputGroup icon={<User />} label={o.name_label} value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} placeholder={o.name_placeholder} />
                <InputGroup icon={<Activity />} label={o.phone_label} value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} placeholder="05xx xxx xx xx" />
                <InputGroup icon={<Heart />} label={o.email_label} value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} placeholder={o.email_placeholder} />
              </div>

              <Button onClick={nextStep} disabled={!formData.name || !formData.phone}>{o.btn_next} <ChevronRight className="w-4 h-4" /></Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate="visible" exit={{ opacity: 0, x: -20 }} variants={fadeUp} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">{o.step2_title}</h1>
                <p className="opacity-50 font-medium">{o.step2_desc}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <InputGroup label={o.age_label} value={formData.age} onChange={(v: string) => setFormData({ ...formData, age: v })} placeholder="25" type="number" />
                <InputGroup label={o.height_label} value={formData.height} onChange={(v: string) => setFormData({ ...formData, height: v })} placeholder="180" type="number" />
                <InputGroup label={o.weight_label} value={formData.weight} onChange={(v: string) => setFormData({ ...formData, weight: v })} placeholder="75" type="number" />
              </div>

              <div className="space-y-4">
                <InputGroup icon={<Target />} label={o.goal_label} value={formData.goal} onChange={(v: string) => setFormData({ ...formData, goal: v })} placeholder={o.goal_placeholder} />
              </div>

              <div className="flex gap-4">
                <SecondaryButton onClick={prevStep}>{o.btn_prev}</SecondaryButton>
                <Button onClick={nextStep} disabled={!formData.goal}>{o.btn_next} <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate="visible" variants={fadeUp} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">{o.step3_title}</h1>
                <p className="opacity-50 font-medium">{o.step3_desc}</p>
              </div>

              <div className="space-y-4">
                <TextArea label={o.health_label} value={formData.healthIssues} onChange={(v: string) => setFormData({ ...formData, healthIssues: v })} placeholder={o.health_placeholder} />
                <TextArea label={o.allergy_label} value={formData.allergies} onChange={(v: string) => setFormData({ ...formData, allergies: v })} placeholder={o.allergy_placeholder} />
                <TextArea label={o.note_label} value={formData.message} onChange={(v: string) => setFormData({ ...formData, message: v })} placeholder={o.note_placeholder} />
              </div>

              <div className="space-y-4 pt-6 border-t border-text-main/10">
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" checked={kvkkChecked} onChange={e => setKvkkChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary bg-transparent border-text-main/20 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                     <span className={`text-[0.7rem] sm:text-xs font-medium leading-relaxed ${dm ? 'text-white/60' : 'text-text-main/70'}`}>
                       {o.kvkk_label} <button type="button" onClick={(e) => { e.preventDefault(); setLegalType('kvkk'); setLegalModalOpen(true); }} className="text-primary hover:underline font-bold bg-transparent border-none p-0 mx-1 cursor-pointer">KVKK</button>
                     </span>
                 </label>
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary bg-transparent border-text-main/20 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                     <span className={`text-[0.7rem] sm:text-xs font-medium leading-relaxed ${dm ? 'text-white/60' : 'text-text-main/70'}`}>
                        <button type="button" onClick={(e) => { e.preventDefault(); setLegalType('terms'); setLegalModalOpen(true); }} className="text-primary hover:underline font-bold bg-transparent border-none p-0 mr-1 cursor-pointer">{o.terms_label.split(' ')[0]}</button> {o.terms_label}
                     </span>
                 </label>
              </div>

              <div className="flex gap-4 pt-4">
                <SecondaryButton onClick={prevStep}>{o.btn_prev}</SecondaryButton>
                <Button onClick={handleSubmit} disabled={!kvkkChecked || !termsChecked}>{o.btn_complete}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <LegalModal
          isOpen={isLegalModalOpen}
          type={legalType}
          onClose={() => setLegalModalOpen(false)}
        />
      </div>
    </div>
  );
}

function InputGroup({ icon, label, value, onChange, placeholder, type = 'text' }: { icon?: React.ReactNode; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-text-main/10 bg-text-main/[0.02] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
        {icon && <div className="text-lg opacity-60">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:opacity-30 font-medium"
        />
      </div>
    </div>
  );
}

function Button({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white`}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="flex-1 py-4 rounded-2xl font-bold cursor-pointer bg-text-main/5 text-text-main/60 hover:bg-text-main/10 transition-all border-none"
    >
      {children}
    </motion.button>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-text-main/10 bg-text-main/[0.02] focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none font-medium placeholder:opacity-30 resize-none"
      />
    </div>
  );
}