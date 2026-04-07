import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, youtubeId, title }: Props) {

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
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[95%] max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
          >
            <div className="absolute top-4 left-6 z-10">
              <h3 className="text-white font-display text-lg font-bold shadow-sm">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border-none"
            >
              ✕
            </button>

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
