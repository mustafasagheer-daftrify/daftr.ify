import { useEffect, useState } from 'react';
import { useReducedMotion as useMotionReducedMotion } from 'framer-motion';

export function useReducedMotion() {
  const motionReduced = useMotionReducedMotion();
  const [cssReduced, setCssReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setCssReduced(mql.matches);
    const handler = (e) => setCssReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return motionReduced || cssReduced;
}

export function useReducedMotionValue(initialValue, reducedValue) {
  const reduced = useReducedMotion();
  return reduced ? reducedValue : initialValue;
}