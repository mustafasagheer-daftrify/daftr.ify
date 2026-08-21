import React, { useRef, useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, FileText, Loader2, Minus, Edit3, Search } from 'lucide-react';
import { useReducedMotion, useParallax } from '../motion';
import { useDocumentState, DocumentPhase, PHASE_LABELS, PHASE_COLORS } from '../motion';

const EASE = [0.22, 1, 0.36, 1];

const PHASE_CONTENT = {
  [DocumentPhase.RAW]: {
    label: 'RAW INPUT',
    subtitle: 'Unstructured material',
    icon: FileText,
    accent: 'var(--accent)',
    lines: [
      { text: 'Passport validity: 6+ months', status: 'pending', issue: false },
      { text: 'Financial evidence: bank statements', status: 'pending', issue: true, issueText: 'Mixed currency formats (£1,200 vs 1200 GBP)' },
      { text: 'Accommodation: confirmed booking', status: 'pending', issue: false },
      { text: 'Cover letter: drafted', status: 'pending', issue: true, issueText: 'Missing formal address block' },
      { text: 'Photographs: spec format', status: 'pending', issue: false },
    ],
    checks: ['Gaps identified', 'Requirements mapped', 'Missing items flagged'],
  },
  [DocumentPhase.STRUCTURED]: {
    label: 'STRUCTURED',
    subtitle: 'Organized document set',
    icon: FileText,
    accent: 'var(--green)',
    lines: [
      { text: 'Application form completed', status: 'done', issue: false },
      { text: 'Supporting documents ordered', status: 'done', issue: false },
      { text: 'Evidence indexed & labeled', status: 'done', issue: false },
      { text: 'Currency standardized to GBP 1,200.00', status: 'done', issue: false },
      { text: 'Narrative flow established', status: 'done', issue: false },
    ],
    checks: ['Hierarchy consistent', 'Cross-references valid', 'Format standardized'],
  },
  [DocumentPhase.REVIEWED]: {
    label: 'HUMAN REVIEW',
    subtitle: 'Expert verification',
    icon: AlertTriangle,
    accent: 'var(--warning)',
    lines: [
      { text: 'Requirement compliance checked', status: 'done', issue: false },
      { text: 'Clarity & tone reviewed', status: 'done', issue: false },
      { text: 'Edge cases flagged', status: 'review', issue: true, issueText: 'Cover letter tone lacks formal address' },
      { text: 'Corrections annotated', status: 'done', issue: false },
      { text: 'Final consistency pass', status: 'pending', issue: false },
    ],
    checks: ['Accuracy verified', 'Judgment applied', 'Resolution noted'],
  },
  [DocumentPhase.VERIFIED]: {
    label: 'VERIFIED',
    subtitle: 'Submission ready',
    icon: Check,
    accent: 'var(--green)',
    lines: [
      { text: 'Final consistency pass', status: 'done', issue: false },
      { text: 'All flags resolved', status: 'done', issue: false },
      { text: 'Output generated', status: 'done', issue: false },
      { text: 'Delivery confirmed', status: 'done', issue: false },
    ],
    checks: ['Complete', 'Accurate', 'Ready for use'],
  },
};

const TRANSITION_REDLINES = {
  [DocumentPhase.RAW]: [
    { text: 'Mixed currency formats (£1,200 vs 1200 GBP)', severity: 'high' },
    { text: 'Missing formal address block', severity: 'medium' },
  ],
  [DocumentPhase.STRUCTURED]: [
    { text: 'Cover letter tone lacks formal address', severity: 'medium' },
  ],
  [DocumentPhase.REVIEWED]: [],
};

function StatusIcon({ status, accent, reduced }) {
  const configs = {
    done: { icon: Check, color: 'var(--green)' },
    pending: { icon: Loader2, color: 'var(--text-muted)' },
    review: { icon: AlertTriangle, color: 'var(--warning)' },
  };
  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: reduced ? 0 : 0.2 }}
      style={{ color: config.color }}
    >
      <Icon size={10} />
    </motion.span>
  );
}

function RedlineMark({ text, severity, reduced, delay = 0 }) {
  const colors = {
    high: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', dot: '#ef4444' },
    medium: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', dot: '#f59e0b' },
  };
  const c = colors[severity] || colors.medium;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className="redline-inline"
      style={{ '--redline-color': c.dot }}
    >
      <span className="redline-inline__dot" style={{ background: c.dot }} />
      <span className="redline-inline__text">{text}</span>
    </motion.div>
  );
}

function PaperSheet({ phase, isActive, isExiting, index, reduced, showRedlines }) {
  const config = PHASE_CONTENT[phase];
  const Icon = config.icon;
  const zIndex = 10 - index;
  const transitionRedlines = TRANSITION_REDLINES[phase] || [];

  const initial = reduced ? false : { opacity: 0, y: 40, scale: 0.95, rotateX: -5 };
  const animate = isActive
    ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
    : isExiting
      ? { opacity: 0, y: -40, scale: 0.95, rotateX: 5 }
      : { opacity: 0.25, y: index * 6, scale: 0.98 - index * 0.01, rotateX: -3 };

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
                key={line.text}
                className={`paper__line paper__line--${line.status}`}
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 0 }}
                transition={{ duration: reduced ? 0.01 : 0.35, delay: reduced ? 0 : isActive ? 0.15 + i * 0.05 : 0, ease: EASE }}
              >
                <StatusIcon status={line.status} accent={config.accent} reduced={reduced} />
                <span className="paper__line-text">{line.text}</span>
                {line.issue && line.issueText && (
                  <motion.span
                    className="paper__issue-badge"
                    initial={reduced ? false : { opacity: 0, scale: 0.5 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: reduced ? 0.01 : 0.3, delay: reduced ? 0 : 0.3 + i * 0.08, ease: EASE }}
                  >
                    <Edit3 size={9} /> {line.issueText}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {showRedlines && isActive && transitionRedlines.length > 0 && (
            <motion.div
              className="paper__redlines"
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 0.4, ease: EASE }}
            >
              <span className="paper__redlines-label">Flagged for review:</span>
              {transitionRedlines.map((r, i) => (
                <RedlineMark key={r.text} text={r.text} severity={r.severity} reduced={reduced} delay={0.5 + i * 0.15} />
              ))}
            </motion.div>
          )}
        </div>

        <div className="paper__footer">
          <div className="paper__checks">
            {config.checks.map((check, i) => (
              <motion.div
                key={check}
                className="paper__check"
                initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: reduced ? 0 : isActive ? 0.35 + i * 0.07 : 0 }}
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
  const config = PHASE_CONTENT[phase];
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
        const config = PHASE_CONTENT[phase];
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

export default function DocumentProtagonist({ autoCycle = true, cycleInterval = 8000, showRedlines = true }) {
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
        <div className="protagonist-glow" style={{ background: `radial-gradient(circle, ${PHASE_COLORS[currentPhase]}15, transparent 70%)` }} />
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
              showRedlines={showRedlines}
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