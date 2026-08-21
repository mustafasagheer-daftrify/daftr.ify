import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useReducedMotion } from './useReducedMotion';

const EASE = [0.22, 1, 0.36, 1];

export function StatusBadge({ status, children }) {
  const reduced = useReducedMotion();
  const configs = {
    raw: { label: 'RAW', color: 'var(--accent)', icon: AlertTriangle },
    structured: { label: 'STRUCTURED', color: 'var(--green)', icon: Check },
    reviewed: { label: 'IN REVIEW', color: 'var(--warning)', icon: AlertTriangle },
    verified: { label: 'VERIFIED', color: 'var(--green)', icon: Check },
    processing: { label: 'PROCESSING', color: 'var(--accent)', icon: Loader2 },
  };

  const config = configs[status] || configs.raw;
  const Icon = config.icon;

  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="status-badge"
      style={{ '--badge-color': config.color }}
    >
      <Icon size={10} style={{ color: config.color }} />
      {children || config.label}
    </motion.span>
  );
}

export function Redline({ children, active = true, onResolve }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="redline"
      initial={reduced ? false : { opacity: 0, width: 0 }}
      animate={active ? { opacity: 1, width: '100%' } : { opacity: 0, width: 0 }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.4, ease: EASE }}
    >
      <span className="redline__mark" />
      <span className="redline__content">{children}</span>
      {onResolve && (
        <motion.button
          className="redline__resolve"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onResolve}
          whileTap={{ scale: 0.95 }}
        >
          <X size={10} />
        </motion.button>
      )}
    </motion.div>
  );
}

export function Annotation({ children, position, active = true }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="annotation"
          style={position}
          initial={reduced ? false : { opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: reduced ? 0.01 : 0.3, ease: EASE }}
        >
          <span className="annotation__pointer" />
          <span className="annotation__content">{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PhaseIndicator({ phase, phases, onPhaseClick }) {
  const reduced = useReducedMotion();

  return (
    <div className="phase-indicator" role="tablist" aria-label="Document phases">
      {phases.map((p, i) => {
        const isCurrent = p === phase;
        const isPast = phases.indexOf(phase) > i;
        return (
          <motion.button
            key={p}
            role="tab"
            aria-selected={isCurrent}
            aria-label={p}
            onClick={() => onPhaseClick?.(p)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                onPhaseClick?.(phases[Math.min(i + 1, phases.length - 1)]);
              }
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                onPhaseClick?.(phases[Math.max(i - 1, 0)]);
              }
              if (e.key === 'Home') {
                e.preventDefault();
                onPhaseClick?.(phases[0]);
              }
              if (e.key === 'End') {
                e.preventDefault();
                onPhaseClick?.(phases[phases.length - 1]);
              }
            }}
            className={`phase-step ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : i * 0.08, ease: EASE }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="phase-step__dot" />
            <span className="phase-step__label">{p}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function DocumentProgress({ phase, phases }) {
  const currentIndex = phases.indexOf(phase);
  const progress = phases.length > 1 ? currentIndex / (phases.length - 1) : 0;

  return (
    <div className="document-progress" role="progressbar" aria-valuenow={currentIndex} aria-valuemin={0} aria-valuemax={phases.length - 1}>
      <motion.div
        className="document-progress__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformOrigin: 'left center' }}
      />
      <div className="document-progress__steps">
        {phases.map((p, i) => (
          <span key={p} className={`document-progress__step ${i <= currentIndex ? 'reached' : ''} ${i === currentIndex ? 'current' : ''}`} />
        ))}
      </div>
    </div>
  );
}