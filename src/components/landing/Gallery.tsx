import { useState, useRef, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { useStore } from '../../stores/useStore';
import Lightbox from '../Lightbox';
import { useTranslation } from '../../locales';

interface GalleryImage {
  src: string;
  caption: string;
}

const GalleryCard = memo(function GalleryCard({ image, index, onClick, dm }: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
  dm: boolean;
}) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative cursor-pointer overflow-hidden ${
        index === 0 ? 'md:col-span-2 md:row-span-2' : ''
      } rounded-[2rem] border ${dm ? 'border-white/5' : 'border-black/[0.04]'}`}
      role="button"
      tabIndex={0}
      aria-label={`${image.caption} — büyütmek için tıkla`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
        <motion.img
          src={image.src}
          alt={image.caption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent transition-opacity duration-700 ${
          dm
            ? 'from-black/80 to-transparent opacity-60 group-hover:opacity-90'
            : 'from-black/60 to-transparent opacity-0 group-hover:opacity-100'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] skew-x-[-20deg]" />
      </div>

      <motion.div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <p className="text-white font-display text-xl md:text-2xl font-bold tracking-tight">
          {image.caption}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-[2px] bg-primary rounded-full" />
          <span className="text-white/60 text-[0.75rem] uppercase tracking-[0.15em] font-medium">
            {t.gallery.badge}
          </span>
        </div>
      </motion.div>

      <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </div>
    </motion.div>
  );
});

export default function Gallery() {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  const galleryItems = t.gallery.items || [];

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <section ref={sectionRef} id="galeri" className="py-32 md:py-40 bg-bg relative overflow-hidden">
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] bg-secondary/5 rounded-full blur-[100px]" />
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
          <RevealSection className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">
              {t.gallery.badge}
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em] text-text-main mb-8">
              <>{t.gallery.title1}</>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
          </RevealSection>

          <RevealSection className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
            {galleryItems.map((img: GalleryImage, i: number) => (
              <GalleryCard
                key={i}
                image={img}
                index={i}
                onClick={() => openLightbox(i)}
                dm={dm}
              />
            ))}
          </RevealSection>

          <RevealSection className="mt-16 text-center">
            <motion.a
              variants={fadeUp}
              href="https://instagram.com/elaebeoglu"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[0.85rem] font-bold uppercase tracking-widest no-underline transition-all duration-500 border ${
                dm
                  ? 'border-white/10 text-white/50 hover:text-white hover:border-primary/40 hover:bg-primary/5'
                  : 'border-text-main/10 text-text-main/40 hover:text-text-main hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <span className="text-lg">📸</span>
              {t.gallery.followIg}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </RevealSection>
        </div>
      </section>

      <Lightbox
        images={galleryItems.map((img: GalleryImage) => img.src)}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex(prev => (prev + 1) % galleryItems.length)}
        onPrev={() => setLightboxIndex(prev => (prev - 1 + galleryItems.length) % galleryItems.length)}
      />
    </>
  );
}

