import { useEffect, useRef } from 'react';

interface Props {
  lines: string[];
  className?: string;
  delay?: number;
}

/**
 * mask-reveal-up — Lines reveal upward with a soft masked feel and compact stagger.
 * Spec: duration 760ms, stagger 90ms, easing cubic-bezier(0.22, 1, 0.36, 1)
 * from: opacity 0, y +30px, blur 6px
 */
export default function MaskRevealUp({ lines, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lineEls = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-line]'));

    lineEls.forEach((line, i) => {
      line.animate(
        [
          { opacity: 0, transform: 'translateY(30px)', filter: 'blur(6px)' },
          { opacity: 1, transform: 'translateY(0px)',  filter: 'blur(0px)' },
        ],
        {
          duration: 760,
          delay: delay + i * 90,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        }
      );
    });
  }, [lines, delay]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          data-line
          className="block"
          style={{ overflow: 'hidden' }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
