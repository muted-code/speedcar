import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * micro-scale-fade — A calm, tiny scale pop for labels and headings.
 * Spec: duration 600ms, easing cubic-bezier(0.32, 0.72, 0, 1)
 * from: opacity 0, scale 0.96
 */
export default function MicroScaleFade({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.animate(
      [
        { opacity: 0, transform: 'scale(0.96)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        duration: 600,
        delay,
        easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
        fill: 'both',
      }
    );
  }, [children, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
