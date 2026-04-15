import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../locales';

export default function ReloadPrompt() {
  const { t } = useTranslation()
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      // Service worker registered
    },
    onRegisterError(error: unknown) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-[400px] w-full"
        >
          <div className="bg-white dark:bg-bg-alt border border-black/[0.08] dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl p-6 rounded-[2rem] flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-text-main leading-tight">
                  {offlineReady ? t.portal.admin.reload_ready_title : t.portal.admin.reload_update_title}
                </h4>
                <p className="text-[0.75rem] text-text-main/50 font-medium leading-relaxed mt-1">
                  {offlineReady
                    ? t.portal.admin.reload_ready_text
                    : t.portal.admin.reload_update_text}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {needRefresh && (
                <button
                  onClick={() => updateServiceWorker(true)}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-2xl text-[0.75rem] font-bold uppercase tracking-wider transition-all"
                >
                  {t.portal.admin.reload_update_btn}
                </button>
              )}
              <button
                onClick={close}
                className="flex-1 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-500 dark:text-white/60 py-3 px-6 rounded-2xl text-[0.75rem] font-bold uppercase tracking-wider transition-all"
              >
                {t.portal.admin.reload_close}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
