import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RevealSection, fadeUp } from './LandingUI';
import { useStore } from '../../stores/useStore';
import { tenantConfig } from '../../config/tenant';
import { contactFormSchema, type ContactFormData } from '../../lib/validations';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const { darkMode, language, addLead } = useStore();
  const dm = darkMode;
  const isTr = language === 'tr';
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { goal: 'voleybol' }
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('sending');

    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        goal: data.goal,
        message: data.notes || '',
        status: 'New'
      }]);

      if (dbError) throw dbError;

      addLead({
        name: data.name,
        phone: data.phone,
        goal: data.goal,
        notes: data.notes || ''
      });

      const msg = isTr
        ? `Merhaba! Sana sporcu portalından ulaşıyorum.\n\nAd: ${data.name}\nTelefon: ${data.phone}\nHedef: ${data.goal}\nNotlarım: ${data.notes || '-'}`
        : `Hello! I'm reaching out from the athlete portal.\n\nName: ${data.name}\nPhone: ${data.phone}\nGoal: ${data.goal}\nNotes: ${data.notes || '-'}`;
      const whatsappUrl = `https://wa.me/${tenantConfig.brand.contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;

      window.open(whatsappUrl, '_blank');
      setFormStatus('success');
      reset();
    } catch (err: unknown) {
      console.error('Lead submission failed:', err);
      addLead({
        name: data.name,
        phone: data.phone,
        goal: data.goal,
        notes: data.notes || ''
      });
      setFormStatus('success');
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full p-5 rounded-2xl border transition-all duration-300 text-[1rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--color-primary-rgb),0.1)] ${
      dm ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/20' : 'bg-black/[0.02] border-black/5 placeholder:text-black/20'
    } ${hasError ? 'border-red-500' : ''}`;

  return (
    <section id="iletisim" className="py-32 md:py-48 bg-bg-alt relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-20 lg:gap-32 items-center">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
              {isTr ? 'İletişim' : 'Contact'}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em] mb-10 text-text-main">
              {isTr ? 'Değişime hazır mısın?' : 'Ready for change?'}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2}
              className="text-[1.15rem] leading-[1.8] max-w-[480px] mb-12 text-text-main/40 font-medium">
              {isTr
                ? 'Sınırlı kontenjan nedeniyle başvuruları değerlendirerek alıyorum. Formu doldurduğunda 24 saat içinde seninle iletişime geçeceğim.'
                : 'Due to limited spots, I evaluate applications carefully. After you fill out the form, I will contact you within 24 hours.'}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="space-y-6">
              <div className="flex items-center gap-4 text-text-main/60">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dm ? 'bg-white/5' : 'bg-text-main/5'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[1.05rem] font-medium">{tenantConfig.brand.contact.email}</span>
              </div>
              <div className="flex items-center gap-4 text-text-main/60">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dm ? 'bg-white/5' : 'bg-text-main/5'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <span className="text-[1.05rem] font-medium">{isTr ? 'İstanbul / Online' : 'Istanbul / Online'}</span>
              </div>
            </motion.div>
          </RevealSection>

          <RevealSection>
            <div className={`p-8 md:p-12 rounded-[2.5rem] border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-white shadow-2xl'}`}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[0.8rem] font-bold uppercase tracking-widest text-text-main/40 ml-2">
                      {isTr ? 'İsim Soyisim' : 'Full Name'}
                    </label>
                    <input {...register('name')} type="text"
                      placeholder={isTr ? 'Adınız' : 'Your name'}
                      className={inputCls(!!errors.name)} />
                    {errors.name && <p className="text-red-500 text-xs ml-2 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.8rem] font-bold uppercase tracking-widest text-text-main/40 ml-2">
                      {isTr ? 'Telefon' : 'Phone'}
                    </label>
                    <input {...register('phone')} type="tel"
                      placeholder={isTr ? '05XX XXX XX XX' : '+90 5XX XXX XX XX'}
                      className={inputCls(!!errors.phone)} />
                    {errors.phone && <p className="text-red-500 text-xs ml-2 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.8rem] font-bold uppercase tracking-widest text-text-main/40 ml-2">
                    {isTr ? 'Ana Hedef' : 'Main Goal'}
                  </label>
                  <select {...register('goal')}
                    className={`${inputCls(!!errors.goal)} appearance-none`}>
                    <option value="voleybol">{isTr ? 'Voleybol Performans' : 'Volleyball Performance'}</option>
                    <option value="fitness">{isTr ? 'Genel Fitness / Güç' : 'General Fitness / Strength'}</option>
                    <option value="kilo-kaybi">{isTr ? 'Kilo Kaybı / Sıkılaşma' : 'Weight Loss / Toning'}</option>
                    <option value="diger">{isTr ? 'Diğer' : 'Other'}</option>
                  </select>
                  {errors.goal && <p className="text-red-500 text-xs ml-2 mt-1">{errors.goal.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[0.8rem] font-bold uppercase tracking-widest text-text-main/40 ml-2">
                    {isTr ? 'Ek Notlar' : 'Additional Notes'}
                  </label>
                  <textarea {...register('notes')}
                    placeholder={isTr ? 'Hedeflerin ve spor geçmişin...' : 'Your goals and sports history...'}
                    rows={4}
                    className={`${inputCls(!!errors.notes)} resize-none`} />
                  {errors.notes && <p className="text-red-500 text-xs ml-2 mt-1">{errors.notes.message}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className={`w-full py-5 rounded-2xl font-bold text-[1.1rem] transition-all duration-500 shadow-xl flex items-center justify-center gap-3 border-none cursor-pointer ${
                    formStatus === 'success'
                      ? 'bg-secondary text-white'
                      : formStatus === 'sending'
                        ? 'opacity-50 cursor-not-allowed bg-primary text-white'
                        : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
                  }`}
                >
                  {formStatus === 'success'
                    ? (isTr ? 'Başvuru Gönderildi!' : 'Application Sent!')
                    : formStatus === 'sending'
                      ? (isTr ? 'Gönderiliyor...' : 'Sending...')
                      : (isTr ? 'WhatsApp ile Gönder' : 'Send via WhatsApp')}
                  {formStatus === 'sending' && (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  )}
                </motion.button>
              </form>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
