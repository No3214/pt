import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { Scale, Ruler, FileText, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function StudentMeasurementForm() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, addMeasurement, darkMode: dm, showToast } = useStore();
  
  const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    weight: '', bodyFat: '',
    shoulder: '', chest: '', waist: '', hip: '', leg: '', arm: '',
    notes: '', date: new Date().toISOString().split('T')[0]
  });

  if (!client) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-bg text-text-main' : 'bg-[#FAF6F1]'}`}>
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-primary mx-auto opacity-50" />
          <h2 className="text-2xl font-bold">Geçersiz Link</h2>
          <p className="opacity-50">Lütfen antrenörünüzden yeni bir link talep edin.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.weight) {
      showToast('Lütfen kilonuzu giriniz.');
      return;
    }
    
    addMeasurement(client.id, formData);
    showToast('Ölçümleriniz başarıyla kaydedildi!');
    setIsSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-bg text-text-main' : 'bg-[#FAF6F1]'}`}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Kayıt Başarılı!</h2>
          <p className="opacity-60 max-w-sm mx-auto">Gelişimin harika görünüyor! Verilerin grafiklerine yansıdı bile.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-6 ${dm ? 'bg-bg text-text-main font-sans' : 'bg-[#FAF6F1] font-sans'}`}>
      <div className="max-w-xl mx-auto text-center mb-16">
        <p className="text-[0.7rem] font-bold text-primary uppercase tracking-[0.3em] mb-4">Gelişim Takibi</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Hoş Geldin, {client.name.split(' ')[0]}!</h1>
        <p className="opacity-40 font-medium italic">"Bugün yaptığın ölçüm, yarınki başarının temelidir."</p>
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
                   Vücut Kompozisyonu
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Kilo (kg)" value={formData.weight} onChange={v => setFormData({...formData, weight: v})} placeholder="75.5" type="number" />
                <Input label="Yağ Oranı %" value={formData.bodyFat} onChange={v => setFormData({...formData, bodyFat: v})} placeholder="15.2" type="number" />
              </div>

              <Button onClick={() => setStep(2)} disabled={!formData.weight}>
                Çevre Ölçümlerine Geç <ChevronRight className="w-4 h-4 ml-1" />
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
                   Çevre Ölçümleri (cm)
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input label="Omuz" value={formData.shoulder} onChange={v => setFormData({...formData, shoulder: v})} placeholder="120" />
                <Input label="Göğüs" value={formData.chest} onChange={v => setFormData({...formData, chest: v })} placeholder="105" />
                <Input label="Bel" value={formData.waist} onChange={v => setFormData({...formData, waist: v})} placeholder="85" />
                <Input label="Kalça" value={formData.hip} onChange={v => setFormData({...formData, hip: v})} placeholder="100" />
                <Input label="Bacak" value={formData.leg} onChange={v => setFormData({...formData, leg: v})} placeholder="60" />
                <Input label="Kol" value={formData.arm} onChange={v => setFormData({...formData, arm: v})} placeholder="35" />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-8 bg-text-main/5 text-text-main/60 p-5 rounded-2xl font-bold hover:bg-text-main/10 transition-all border-none">Geri</button>
                <Button onClick={() => setStep(3)}>Son Adım</Button>
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
                   Notlar & Tarih
                </h2>
              </div>

              <div className="space-y-4">
                <Input label="Ölçüm Tarihi" value={formData.date} onChange={v => setFormData({...formData, date: v})} type="date" />
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Antrenörüne eklemek istediğin bir not var mı?"
                  rows={4}
                  className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl p-5 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-8 bg-text-main/5 text-text-main/60 p-5 rounded-2xl font-bold hover:bg-text-main/10 transition-all border-none">Geri</button>
                <Button onClick={handleSubmit}>Ölçümleri Kaydet</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-[0.65rem] uppercase tracking-widest font-bold opacity-40 ml-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-text-main/5 border border-text-main/10 rounded-2xl p-4 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all outline-none font-medium placeholder:opacity-30"
      />
    </div>
  );
}

function Button({ children, onClick, disabled }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-primary text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-30 border-none cursor-pointer"
    >
      {children}
    </button>
  );
}
