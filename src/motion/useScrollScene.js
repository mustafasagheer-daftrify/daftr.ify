import { useEffect, useRef } from 'react';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export function useScrollScene(options = {}) {
  const {
    target,
    offset = ['start start', 'end end'],
    yRange = [0, 1],
    opacityRange = [1, 0],
    scaleRange = [1, 1],
    rotateRange = [0, 0],
    xRange = [0, 0],
  } = options;

  const reduced = useReducedMotion();
  const ref = useRef(null);
  const scrollY = useRef(null);
  const scrollYProgress = useRef(null);

  if (target) {
    const scroll = useScroll({ target, offset });
    scrollY.current = scroll.scrollY;
    scrollYProgress.current = scroll.scrollYProgress;
  }

  const y = useTransform(scrollYProgress.current || useMotionValue(0), [0, 1], yRange);
  const opacity = useTransform(scrollYProgress.current || useMotionValue(0), [0, 1], opacityRange);
  const scale = useTransform(scrollYProgress.current || useMotionValue(0), [0, 1], scaleRange);
  const rotate = useTransform(scrollYProgress.current || useMotionValue(0), [0, 1], rotateRange);
  const x = useTransform(scrollYProgress.current || useMotionValue(0), [0, 1], xRange);

  const getValues = () => ({
    y: reduced ? yRange[0] : y,
    opacity: reduced ? opacityRange[0] : opacity,
    scale: reduced ? scaleRange[0] : scale,
    rotate: reduced ? rotateRange[0] : rotate,
    x: reduced ? xRange[0] : x,
  });

  return { ref, getValues, scrollYProgress: scrollYProgress.current };
}

export function useElementScroll(target, offset = ['start start', 'end end']) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: target || ref, offset });

  return { ref, scrollYProgress, reduced };
}