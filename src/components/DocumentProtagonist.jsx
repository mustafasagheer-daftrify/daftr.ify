import React, { useRef, useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { useReducedMotion, useParallax } from '../motion';
import { useDocumentState, DocumentPhase, PHASE_LABELS, PHASE_COLORS } from '../motion';

const EASE = [0.22, 1, 0.36, 1];

const PHASE_CONFIG = {
  [DocumentPhase.RAW]: {
    label: 'RAW INPUT',
    subtitle: 'Unstructured material',
    icon: FileText,
    accent: 'var(--accent)',
    paperClass: 'paper--raw',
    lines: [
      'Passport validity: 6+ months',
      'Financial evidence: bank statements',
      'Accommodation: confirmed booking',
      'Cover letter: drafted',
      'Photographs: spec format',
    ],
    checks: ['Gaps identified', 'Requirements mapped', 'Missing items flagged'],
  },
  [DocumentPhase.STRUCTURED]: {
    label: 'STRUCTURED',
    subtitle: 'Organized document set',
    icon: FileText,
    accent: 'var(--green)',
    paperClass: 'paper--structured',
    lines: [
      'Application form completed',
      'Supporting documents ordered',
      'Evidence indexed & labeled',
      'Narrative flow established',
    ],
    checks: ['Hierarchy consistent', 'Cross-references valid', 'Format standardized'],
  },
  [DocumentPhase.REVIEWED]: {
    label: 'HUMAN REVIEW',
    subtitle: 'Expert verification',
    icon: AlertTriangle,
    accent: 'var(--warning)',
    paperClass: 'paper--reviewed',
    lines: [
      'Requirement compliance checked',
      'Clarity & tone reviewed',
      'Edge cases flagged',
      'Corrections annotated',
    ],
    checks: ['Accuracy verified', 'Judgment applied', 'Resolution noted'],
  },
  [DocumentPhase.VERIFIED]: {
    label: 'VERIFIED',
    subtitle: 'Submission ready',
    icon: Check,
    accent: 'var(--green)',
    paperClass: 'paper--verified',
    lines: [
      'Final consistency pass',
      'All flags resolved',
      'Output generated',
      'Delivery confirmed',
    ],
    checks: ['Complete', 'Accurate', 'Ready for use'],
  },
};

function PaperSheet({ phase, isActive, isExiting, index, reduced }) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;
  const zIndex = 10 - index;

  const initial = reduced ? false : { opacity: 0, y: 40, scale: 0.95, rotateX: -5 };
  const animate = isActive
    ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
    : isExiting
      ? { opacity: 0, y: -40, scale: 0.95, rotateX: 5 }
      : { opacity: 0.3, y: index * 8, scale: 0.98 - index * 0.01, rotateX: -3 };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        className={`document-paper ${config.paperClass}`}
        initial={initial}
        animate={animate}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.95, rotateX: 5 }}
        transition={{ duration: reduced ? 0.01 : 0.6, ease: EASE }}
        style={{
          zIndex,
          transformOrigin: 'center bottom',
          '--phase-accent': config.accent,
        }}
      >
        <div className="paper__header">
          <div className="paper__header-left">
            <span className="paper__phase-label">{config.label}</span>
            <span className="paper__phase-subtitle">{config.subtitle}</span>
          </div>
          <div className="paper__header-right">
            <StatusBadge phase={phase} />
          </div>
        </div>

        <div className="paper__content">
          <div className="paper__lines">
            {config.lines.map((line, i) => (
              <motion.div
                key={line}
                className="paper__line"
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
                transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : isActive ? 0.2 + i * 0.06 : 0, ease: EASE }}
              >
                <span className="paper__bullet" />
                <span>{line}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="paper__footer">
          <div className="paper__checks">
            {config.checks.map((check, i) => (
              <motion.div
                key={check}
                className="paper__check"
                initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: reduced ? 0 : isActive ? 0.4 + i * 0.08 : 0 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <motion.path
                    d="M2 5l2 2 4-4"
                    stroke="var(--green)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: reduced ? 0.01 : 0.3, ease: EASE }}
                  />
                </svg>
                <span>{check}</span>
              </motion.div>
            ))}
          </div>
          <div className="paper__progress">
            <motion.div
              className="paper__progress-bar"
              initial={reduced ? false : { scaleX: 0 }}
              animate={isActive ? { scaleX: 1 } : { scaleX: index / 3 }}
              transition={{ duration: reduced ? 0.01 : 0.8, ease: EASE }}
              style={{ transformOrigin: 'left center', background: config.accent }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatusBadge({ phase }) {
  const config = PHASE_CONFIG[phase];
  return (
    <span className="status-badge" style={{ '--badge-color': config.accent }}>
      {config.label}
    </span>
  );
}

function PhaseNavigator({ currentPhase, onPhaseClick, reduced }) {
  const phases = Object.values(DocumentPhase);

  return (
    <div className="phase-navigator" role="tablist" aria-label="Document phases">
      {phases.map((phase, i) => {
        const config = PHASE_CONFIG[phase];
        const isCurrent = phase === currentPhase;
        const isPast = phases.indexOf(currentPhase) > i;
        return (
          <motion.button
            key={phase}
            role="tab"
            aria-selected={isCurrent}
            aria-label={config.label}
            onClick={() => onPhaseClick?.(phase)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') onPhaseClick?.(phases[Math.min(i + 1, phases.length - 1)]);
              if (e.key === 'ArrowLeft') onPhaseClick?.(phases[Math.max(i - 1, 0)]);
            }}
            className={`phase-nav-step ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : i * 0.08, ease: EASE }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="phase-nav-step__dot" style={{ background: isCurrent || isPast ? config.accent : 'transparent', borderColor: isCurrent || isPast ? config.accent : 'var(--border)' }} />
            <span className="phase-nav-step__label">{config.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function DocumentProtagonist({ autoCycle = true, cycleInterval = 6000 }) {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();
  const { style: parallaxStyle } = useParallax({ containerRef });
  const { phase, isTransitioning, nextPhase, PHASE_ORDER, PHASE_LABELS, PHASE_COLORS } = useDocumentState();

  const [currentPhase, setCurrentPhase] = useState(phase);

  useEffect(() => {
    setCurrentPhase(phase);
  }, [phase]);

  useEffect(() => {
    if (!autoCycle || reduced) return;

    const interval = setInterval(() => {
      nextPhase();
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [autoCycle, cycleInterval, reduced, nextPhase]);

  const phases = Object.values(DocumentPhase);

  return (
    <div className="document-protagonist-wrapper" ref={containerRef}>
      {!reduced && (
        <div className="protagonist-glow" style={{ background: `radial-gradient(circle, ${PHASE_COLORS[currentPhase]}20, transparent 70%)` }} />
      )}

      <div className="document-protagonist" style={{ ...parallaxStyle, transformPerspective: 1000 }}>
        <AnimatePresence mode="wait">
          {phases.map((phase, i) => (
            <PaperSheet
              key={phase}
              phase={phase}
              isActive={phase === currentPhase}
              isExiting={isTransitioning && phases.indexOf(currentPhase) > i}
              index={i}
              reduced={reduced}
            />
          ))}
        </AnimatePresence>
      </div>

      <PhaseNavigator currentPhase={currentPhase} onPhaseClick={setCurrentPhase} reduced={reduced} />

      <div className="protagonist-caption">
        <span className="protagonist-caption__label">Document lifecycle</span>
        <span className="protagonist-caption__phase" style={{ color: PHASE_COLORS[currentPhase] }}>{PHASE_LABELS[currentPhase]}</span>
      </div>
    </div>
  );
}