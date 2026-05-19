import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
}

/**
 * soft-blur-in — Per-WORD fade-in con blur y movimiento suave.
 * Adaptado del spec original para textos largos (>40 chars).
 * Spec fallback: duration 500ms, stagger 60ms per word, blur 8px
 * Total visible en ~500ms para títulos de 8 palabras.
 */
export default function SoftBlurIn({ text, className = '', as: Tag = 'span', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-word]'));

    words.forEach((word, i) => {
      word.animate(
        [
          { opacity: 0, transform: 'translateY(12px)', filter: 'blur(8px)' },
          { opacity: 1, transform: 'translateY(0px)',  filter: 'blur(0px)' },
        ],
        {
          duration: 500,
          delay: delay + i * 60,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        }
      );
    });
  }, [text, delay]);

  const words = text.split(' ');

  return (
    // @ts-ignore
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          data-word
          className="inline-block"
          aria-hidden="true"
        >
          {word}
          {wi < words.length - 1 && '\u00a0'}
        </span>
      ))}
    </Tag>
  );
}
