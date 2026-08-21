import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import DocumentProtagonist from '../components/DocumentProtagonist';
import { MagneticButton } from '../components/MagneticButton';
import { useScrollScene, useReducedMotion, useDocumentState } from '../motion';

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { phase, PHASE_LABELS, PHASE_COLORS } = useDocumentState();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { ref, getValues } = useScrollScene({
    offset: ['start start', 'end start'],
    yRange: [0, isMobile ? 150 : 250],
    opacityRange: [1, 0],
    scaleRange: [1, isMobile ? 0.92 : 0.88],
    rotateRange: [0, 0],
  });

  const { y, opacity, scale } = getValues();

  const scrollY = useTransform(y, [0, 250], [0, isMobile ? 80 : 120]);
  const scrollScale = useTransform(y, [0, 250], [1, isMobile ? 0.95 : 0.95]);

  return (
    <section ref={ref} id="top" className={`hero ${isMobile ? 'hero--mobile' : ''}`}>
      <div className="hero__bg">
        <img src="/images/hero-bg.jpg" alt="" loading="eager" />
      </div>
      <div className="hero__atmosphere" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      <div className="hero__canvas">
        <motion.div
          style={{ y, opacity, scale }}
          className="hero__content-layer"
          initial={reduced ? false : { opacity: 0, y: isMobile ? 16 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.8, ease: EASE }}
        >
          <motion.div
            className="hero__tag"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.7, delay: reduced ? 0 : 0.1, ease: EASE }}
          >
            <span className="pulse" aria-hidden="true" />
            Document operations studio
            <span className="hero__tag-divider" aria-hidden="true" />
            <span className="hero__tag-step">01 / 04</span>
          </motion.div>

          <motion.h1
            className={`hero__title ${isMobile ? 'hero__title--mobile' : ''}`}
            initial={reduced ? false : { opacity: 0, y: isMobile ? 32 : 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 1.0, delay: reduced ? 0 : 0.15, ease: EASE }}
          >
            <span className="hero__title-line">Messy information.</span>
            <span className="hero__title-line hero__title-line--accent">Clear documents.</span>
          </motion.h1>

          <motion.p
            className={`hero__desc ${isMobile ? 'hero__desc--mobile' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.8, delay: reduced ? 0 : 0.3, ease: EASE }}
          >
            Turn messy work into clear workflows.
            Structured by process, refined by people.
          </motion.p>

          <motion.div
            className={`hero__actions ${isMobile ? 'hero__actions--mobile' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.8, delay: reduced ? 0 : 0.4, ease: EASE }}
          >
            <MagneticButton>Bring a document problem</MagneticButton>
            <a href="#capabilities" className="link-arrow">
              Explore the studio <ArrowDownRight size={15} />
            </a>
          </motion.div>

          <motion.div
            className="hero__state-indicator"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.8, delay: reduced ? 0 : 0.5, ease: EASE }}
            style={{ '--phase-color': PHASE_COLORS[phase] }}
          >
            <span className="hero__state-label">Current state</span>
            <span className="hero__state-value">{PHASE_LABELS[phase]}</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: scrollY, scale: scrollScale }}
          className="hero__protagonist-layer"
          initial={reduced ? false : { opacity: 0, scale: 0.95, y: isMobile ? 20 : 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 1.2, delay: reduced ? 0 : 0.2, ease: EASE }}
        >
          <DocumentProtagonist autoCycle={!isMobile} cycleInterval={7000} />
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll-indicator"
        animate={reduced ? false : { y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <i />
      </motion.div>
    </section>
  );
}