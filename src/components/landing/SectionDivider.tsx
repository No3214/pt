import { useStore } from '../../stores/useStore';

/** A premium gradient mesh divider between sections */
export default function SectionDivider({ variant = 'default' }: { variant?: 'default' | 'accent' | 'subtle' }) {
  const { darkMode } = useStore();
  const dm = darkMode;

  if (variant === 'subtle') {
    return <div className="w-full h-px bg-gradient-to-r from-transparent via-text-main/[0.06] to-transparent" />;
  }

  if (variant === 'accent') {
    return (
      <div className="relative py-1">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <div className="relative h-24 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-b from-bg via-bg-alt/20 to-bg' : 'bg-gradient-to-b from-bg via-bg-alt/50 to-bg'}`} />
    </div>
  );
}
