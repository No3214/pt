import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Target, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import LegalModal from '../../components/LegalModals';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function OnboardingForm() {
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
    showToast('Başvurunuz başarıyla alındı!');
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
          <h2 className="text-3xl font-bold tracking-tight">Harika! Bilgilerin Alındı.</h2>
          <p className="opacity-60 max-w-sm mx-auto">Antrenörün en kısa sürede seninle WhatsApp üzerinden iletişime geçecek. Hazır ol!</p>
        </motion.div>
      </div>
    );
  }

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
                <h1 className="text-4xl font-bold tracking-tight mb-3">Seni Tanıyalım.</h1>
                <p className="opacity-50 font-medium">Temel bilgilerini girerek başlayalım.</p>
              </div>

              <div className="space-y-4">
                <InputGroup icon={<User />} label="Ad Soyad" value={formData.name} onChange={(v: any) => setFormData({ ...formData, name: v })} placeholder="Adın nedir?" />
                <InputGroup icon={<Activity />} label="Telefon" value={formData.phone} onChange={(v: any) => setFormData({ ...formData, phone: v })} placeholder="05xx xxx xx xx" />
                <InputGroup icon={<Heart />} label="E-Posta" value={formData.email} onChange={(v: any) => setFormData({ ...formData, email: v })} placeholder="opsiyonel" />
              </div>

              <Button onClick={nextStep} disabled={!formData.name || !formData.phone}>Sonraki Adım <ChevronRight className="w-4 h-4" /></Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate="visible" exit={{ opacity: 0, x: -20 }} variants={fadeUp} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Fiziksel Durum.</h1>
                <p className="opacity-50 font-medium">Hedeflerini buna göre optimize edeceğiz.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <InputGroup label="Yaş" value={formData.age} onChange={(v: any) => setFormData({ ...formData, age: v })} placeholder="25" type="number" />
                <InputGroup label="Boy" value={formData.height} onChange={(v: any) => setFormData({ ...formData, height: v })} placeholder="180" type="number" />
                <InputGroup label="Kilo" value={formData.weight} onChange={(v: any) => setFormData({ ...formData, weight: v })} placeholder="75" type="number" />
              </div>

              <div className="space-y-4">
                <InputGroup icon={<Target />} label="Hedefin Nedir?" value={formData.goal} onChange={(v: any) => setFormData({ ...formData, goal: v })} placeholder="Örn: Yağ yakımı, kas kazanımı..." />
              </div>

              <div className="flex gap-4">
                <SecondaryButton onClick={prevStep}>Geri</SecondaryButton>
                <Button onClick={nextStep} disabled={!formData.goal}>Sonraki Adım <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate="visible" variants={fadeUp} className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">Son Detaylar.</h1>
                <p className="opacity-50 font-medium">Varsa sakatlık veya sağlık durumunu belirtmelisin.</p>
              </div>

              <div className="space-y-4">
                <TextArea label="Sağlık Sorunları / Sakatlıklar" value={formData.healthIssues} onChange={(v: any) => setFormData({ ...formData, healthIssues: v })} placeholder="Bel fıtığı, diz ağrısı vb." />
                <TextArea label="Alerjiler" value={formData.allergies} onChange={(v: any) => setFormData({ ...formData, allergies: v })} placeholder="Fıstık, gluten vb." />
                <TextArea label="Antrenöre Notun" value={formData.message} onChange={(v: any) => setFormData({ ...formData, message: v })} placeholder="Eklemek istediğin her şey..." />
              </div>

              <div className="space-y-4 pt-6 border-t border-text-main/10">
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" checked={kvkkChecked} onChange={e => setKvkkChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary bg-transparent border-text-main/20 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                     <span className={`text-[0.7rem] sm:text-xs font-medium leading-relaxed ${dm ? 'text-white/60' : 'text-text-main/70'}`}>
                       Sağlık beyanlarım dahil olmak üzere tüm "Özel Nitelikli Kişisel Verilerimin" işlenmesine ilişkin <button type="button" onClick={(e) => { e.preventDefault(); setLegalType('kvkk'); setLegalModalOpen(true); }} className="text-primary hover:underline font-bold bg-transparent border-none p-0 mx-1 cursor-pointer">KVKK Açık Rıza ve Aydınlatma Metni</button>'ni okudum, anladım ve tamamen kendi özgür irademle <strong className="text-text-main dark:text-white">açık rıza</strong> veriyorum.
                     </span>
                 </label>
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary bg-transparent border-text-main/20 rounded focus:ring-primary focus:ring-2 cursor-pointer" />
                     <span className={`text-[0.7rem] sm:text-xs font-medium leading-relaxed ${dm ? 'text-white/60' : 'text-text-main/70'}`}>
                       <button type="button" onClick={(e) => { e.preventDefault(); setLegalType('terms'); setLegalModalOpen(true); }} className="text-primary hover:underline font-bold bg-transparent border-none p-0 mr-1 cursor-pointer">Kullanım Koşullarını</button> okudum, anladım ve antrenman ile diyet programlarının medikal bir tavsiye olmadığını, oluşabilecek her türlü fiziksel/sağlıksal riskin sorumluluğunun bana ait olduğunu kabul ve beyan ederim.
                     </span>
                 </label>
              </div>

              <div className="flex gap-4">
                <SecondaryButton onClick={prevStep}>Geri</SecondaryButton>
                <Button onClick={handleSubmit} disabled={!kvkkChecked || !termsChecked}>Başvuruyu Tamamla</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        type={legalType} 
      />
    </div>
  );
}

function InputGroup({ icon, label, value, onChange, placeholder, type = 'text' }: any): any {
  return (
    <div className="space-y-2">
      <label className="text-[0.65rem] uppercase tracking-widest font-bold opacity-40 ml-1">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl p-4 pl-5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30"
        />
        {icon && <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">{icon}</div>}
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: any): any {
  return (
    <div className="space-y-2">
      <label className="text-[0.65rem] uppercase tracking-widest font-bold opacity-40 ml-1">{label}</label>
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl p-5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30 resize-none"
      />
    </div>
  );
}

function Button({ children, onClick, disabled }: any): any {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-primary text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer border-none"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: any): any {
  return (
    <button 
      onClick={onClick}
      className="px-8 bg-text-main/5 text-text-main/60 p-5 rounded-2xl font-bold hover:bg-text-main/10 transition-all border-none cursor-pointer"
    >
      {children}
    </button>
  );
}
