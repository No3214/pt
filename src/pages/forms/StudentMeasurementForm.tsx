import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { Scale, Ruler, FileText, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../locales';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function StudentMeasurementForm() {
  const { t } = useTranslation();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, addMeasurement, darkMode: dm, showToast } = useStore();
  
  const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const [formData, setFormData] = useState({
    weight: '', bodyFat: '',
    shoulder: '', chest: '', waist: '', hip: '', leg: '', arm: '',
    notes: '', date: new Date().toISOString().split('T')[0]
  });

  const m = t.forms.measurement;

  if (!client) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-bg text-text-main' : 'bg-bg'}`}>
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-primary mx-auto opacity-50" />
          <h2 className="text-2xl font-bold">{m.invalid_title}</h2>
          <p className="opacity-50">{m.invalid_desc}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.weight) {
      showToast(m.toast_weight_required);
      return;
    }
    
    addMeasurement(client.id, formData);
    showToast(m.toast_success);
    setIsSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-bg text-text-main' : 'bg-bg'}`}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{m.success_title}</h2>
          <p className="opacity-60 max-w-sm mx-auto">{m.success_desc}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-6 ${dm ? 'bg-bg text-text-main font-sans' : 'bg-bg font-sans'}`}>
      <div className="max-w-xl mx-auto text-center mb-16">
        <p className="text-[0.7rem] font-bold text-primary uppercase tracking-[0.3em] mb-4">{t.portal.gallery_title}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{m.welcome_title}, {client.name.split(' ')[0]}!</h1>
        <p className="opacity-40 font-medium italic">"{m.quote}"</p>
      </div>

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
                <h2 className="text-2xl font-bold flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Scale className="text-primary w-5 h-5" />
                   </div>
                   {m.step1_title}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label={m.weight_label} value={formData.weight} onChange={(v: string) => setFormData({...formData, weight: v})} placeholder="75.5" type="number" />
                <Input label={m.fat_label} value={formData.bodyFat} onChange={(v: string) => setFormData({...formData, bodyFat: v})} placeholder="15.2" type="number" />
              </div>

              <Button onClick={() => setStep(2)} disabled={!formData.weight}>
                {m.btn_next} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate="visible" exit={{ opacity: 0, x: -20 }} variants={fadeUp} className="space-y-8">
               <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Ruler className="text-primary w-5 h-5" />
                   </div>
                   {m.step2_title}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input label={m.shoulder_label} value={formData.shoulder} onChange={(v: string) => setFormData({...formData, shoulder: v})} placeholder="120" />
                <Input label={m.chest_label} value={formData.chest} onChange={(v: string) => setFormData({...formData, chest: v })} placeholder="105" />
                <Input label={m.waist_label} value={formData.waist} onChange={(v: string) => setFormData({...formData, waist: v})} placeholder="85" />
                <Input label={m.hip_label} value={formData.hip} onChange={(v: string) => setFormData({...formData, hip: v})} placeholder="100" />
                <Input label={m.leg_label} value={formData.leg} onChange={(v: string) => setFormData({...formData, leg: v})} placeholder="60" />
                <Input label={m.arm_label} value={formData.arm} onChange={(v: string) => setFormData({...formData, arm: v})} placeholder="35" />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-8 bg-text-main/5 text-text-main/60 p-5 rounded-2xl font-bold hover:bg-text-main/10 transition-all border-none">{m.btn_prev}</button>
                <Button onClick={() => setStep(3)}>{m.btn_last}</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate="visible" variants={fadeUp} className="space-y-8">
               <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="text-primary w-5 h-5" />
                   </div>
                   {m.step3_title}
                </h2>
              </div>

              <div className="space-y-4">
                <Input label={m.date_label} value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} type="date" />
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder={m.note_placeholder}
                  rows={4}
                  className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl p-5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30 resize-none"
                />
              </div>

              <div className="pt-6 border-t border-text-main/10">
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" checked={disclaimerChecked} onChange={e => setDisclaimerChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary bg-text-main/5 border-text-main/20 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                     <span className={`text-[0.65rem] font-medium leading-relaxed ${dm ? 'text-white/50' : 'text-text-main/50'}`}>
                       {m.disclaimer}
                     </span>
                 </label>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-8 bg-text-main/5 text-text-main/60 p-5 rounded-2xl font-bold hover:bg-text-main/10 transition-all border-none cursor-pointer">{m.btn_prev}</button>
                <Button onClick={handleSubmit} disabled={!disclaimerChecked}>{m.btn_send}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">{ label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl px-4 py-3 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30"
      />
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
      className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} bg-primary text-white`}
    >
      {children}
    </motion.button>
  );
}
