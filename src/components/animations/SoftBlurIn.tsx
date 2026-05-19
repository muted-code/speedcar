import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
}

/**
 * soft-blur-in — Per-character fade-in con blur y movimiento suave hacia arriba.
 * Spec: duration 900ms, stagger 25ms, easing cubic-bezier(0.22, 1, 0.36, 1)
 * from: opacity 0, y +16px, blur 12px
 */
export default function SoftBlurIn({ text, className = '', as: Tag = 'span', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-char]'));

    chars.forEach((char, i) => {
      char.animate(
        [
          { opacity: 0, transform: 'translateY(16px)', filter: 'blur(12px)' },
          { opacity: 1, transform: 'translateY(0px)',  filter: 'blur(0px)' },
        ],
        {
          duration: 900,
          delay: delay + i * 25,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        }
      );
    });
  }, [text, delay]);

  // Divide el texto en palabras y las palabras en caracteres para preservar espacios
  const words = text.split(' ');

  return (
    // @ts-ignore - el ref es compatible con todos los elementos HTML
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block"
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
          {/* Espacio entre palabras excepto la última */}
          {wi < words.length - 1 && (
            <span className="inline-block" style={{ width: '0.28em' }} aria-hidden="true">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
