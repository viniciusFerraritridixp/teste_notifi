import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

// animationData in Lottie files is typically a JSON object. Use a permissive but typed shape
type AnimationData = Record<string, unknown> | Array<unknown>;

type Props = {
  animationData: AnimationData;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function LottiePlayer({ animationData, loop = true, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // destroy previous animation if any
    if (animRef.current) {
      try { animRef.current.destroy(); } catch (e) { /* noop */ }
      animRef.current = null;
    }

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: loop,
      autoplay: true,
      // lottie-web accepts a JSON object or a path string; cast to unknown here to avoid `any`
      animationData: animationData as unknown,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    const el = containerRef.current;
    if (el) el.style.transform = 'translateZ(0)';

    return () => {
      if (animRef.current) {
        try { animRef.current.destroy(); } catch (e) { /* noop */ }
        animRef.current = null;
      }
    };
  }, [animationData, loop]);

  return <div ref={containerRef} className={className} style={style} />;
}
