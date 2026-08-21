import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export function useParallax(options = {}) {
  const {
    containerRef,
    mouseRange = 300,
    rotateRange = 3,
    perspective = 1200,
    damping = 20,
    stiffness = 50,
  } = options;

  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotX = useSpring(
    useTransform(mouseY, [-mouseRange, mouseRange], [-rotateRange, rotateRange]),
    { stiffness, damping }
  );
  const rotY = useSpring(
    useTransform(mouseX, [-mouseRange, mouseRange], [-rotateRange, rotateRange]),
    { stiffness, damping }
  );

  useEffect(() => {
    if (reduced) return;
    const el = containerRef?.current;
    if (!el) return;

    const handleMouse = (e) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY, containerRef, reduced]);

  const style = {
    transformPerspective: perspective,
    rotateX: rotX,
    rotateY: rotY,
    transformStyle: 'preserve-3d',
  };

  return { style, rotX, rotY, mouseX, mouseY };
}

export function useScrollParallax(target, speed = 0.5) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);

  return reduced ? 0 : y;
}

