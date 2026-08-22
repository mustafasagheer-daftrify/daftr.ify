import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, FileText, Loader2, Edit3, Search, Minus } from 'lucide-react';
import { Section, SectionHead } from '../components/Section';
import { Redline, Annotation, StatusBadge, PhaseIndicator, DocumentProgress } from '../motion/primitives';
import { useReducedMotion, useScrollScene, useDocumentState, useParallax } from '../motion';

const EASE = [0.22, 1, 0.36, 1];

const REVIEW_STEPS = [
  {
    id: 'flagged',
    label: 'FLAGGED',
    subtitle: 'Issue detected',
    icon: AlertTriangle,
    color: 'var(--warning)',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.15)',
    issue: 'Inconsistent financial evidence formatting across bank statements',
    location: 'Page 3, Section 2.1',
    severity: 'HIGH',
    annotation: 'Amounts use mixed currency formats (£1,200 vs 1200 GBP). Embassy requires standardized format per UKVI guidance.',
    correction: 'Standardized all amounts to GBP 1,200.00 format. Added currency legend to document index.',
    documentLines: [
      { text: 'Financial evidence: bank statements', status: 'issue', issueText: 'Mixed currency formats' },
      { text: 'Accommodation: confirmed booking', status: 'pending' },
      { text: 'Cover letter: drafted', status: 'pending' },
      { text: 'Photographs: spec format', status: 'pending' },
    ],
  },
  {
    id: 'review',
    label: 'HUMAN REVIEW',
    subtitle: 'Expert verification',
    icon: Edit3,
    color: 'var(--accent)',
    bg: 'rgba(77,159,255,0.06)',
    border: 'rgba(77,159,255,0.15)',
    issue: 'Cover letter tone lacks required formal address',
    location: 'Page 1, Header',
    severity: 'MEDIUM',
    annotation: 'Missing "Entry Clearance Officer" address. Visa type reference (Student Route) not explicitly stated in opening paragraph.',
    correction: 'Added formal address block. Explicitly referenced Student Route visa. Aligned tone with UKVI communication standards.',
    documentLines: [
      { text: 'Financial evidence: bank statements', status: 'resolved', correction: 'Standardized to GBP 1,200.00' },
      { text: 'Cover letter: drafted', status: 'issue', issueText: 'Missing formal address block' },
      { text: 'Accommodation: confirmed booking', status: 'pending' },
      { text: 'Photographs: spec format', status: 'pending' },
    ],
  },
  {
    id: 'verified',
    label: 'VERIFIED',
    subtitle: 'Resolution confirmed',
    icon: Check,
    color: 'var(--green)',
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.15)',
    issue: 'All flags resolved — document set submission ready',
    location: 'Complete document set',
    severity: 'RESOLVED',
    annotation: 'Financial evidence formatting standardized. Cover letter address and visa reference corrected. Cross-references validated. Index updated.',
    correction: 'Final consistency pass complete. No outstanding issues. Generated submission-ready PDF package.',
    documentLines: [
      { text: 'Financial evidence: bank statements', status: 'resolved' },
      { text: 'Cover letter: drafted', status: 'resolved', correction: 'Formal address added; visa type referenced' },
      { text: 'Accommodation: confirmed booking', status: 'resolved' },
      { text: 'Photographs: spec format', status: 'resolved' },
    ],
  },
];

function DocumentLine({ line, reduced, accent }) {
  const statusColors = {
    issue: { dot: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', text: 'var(--warning)' },
    resolved: { dot: 'var(--green)', bg: 'rgba(52,211,153,0.08)', text: 'var(--green)' },
    pending: { dot: 'var(--text-muted)', bg: 'transparent', text: 'var(--text-dim)' },
    resolvedText: { dot: 'var(--green)', bg: 'rgba(52,211,153,0.08)', text: 'var(--green)' },
  };

  const c = statusColors[line.status] || statusColors.pending;

  return (
    <motion.div
      className="review-doc__line"
      initial={reduced ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.35, ease: EASE }}
      style={{ '--line-color': c.dot, '--line-bg': c.bg, '--line-text': c.text }}
    >
      <span className="review-doc__line-dot" />
      <span className="review-doc__line-text">{line.text}</span>
      {line.issueText && (
        <motion.span
          className="review-doc__issue-badge"
          initial={reduced ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.01 : 0.3, delay: reduced ? 0 : 0.15, ease: EASE }}
        >
          <Search size={9} /> {line.issueText}
        </motion.span>
      )}
      {line.correction && (
        <motion.span
          className="review-doc__correction-badge"
          initial={reduced ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.01 : 0.3, delay: reduced ? 0 : 0.2, ease: EASE }}
        >
          <Edit3 size={9} /> {line.correction}
        </motion.span>
      )}
    </motion.div>
  );
}

function ReviewDocument({ activeStep, reduced }) {
  const step = REVIEW_STEPS.find(s => s.id === activeStep);
  const steps = REVIEW_STEPS;
  const activeIndex = steps.findIndex(s => s.id === activeStep);

  return (
    <div className="review-document" aria-label="Document under review">
      <div className="review-doc__header">
        <div className="review-doc__meta">
          <span className="review-doc__filename">VISA_APPLICATION_PACK.pdf</span>
          <StatusBadge status={activeStep === 'verified' ? 'verified' : activeStep === 'review' ? 'reviewed' : 'raw'} style={{ '--badge-color': step.color }} />
        </div>
      </div>

      <div className="review-doc__pages">
        {steps.map((s, i) => (
          <motion.div
            key={s.id}
            className={`review-doc__page ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'completed' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : i * 0.08, ease: EASE }}
            style={{ '--page-accent': s.color }}
          >
            <div className="review-doc__page-header">
              <span className="review-doc__page-label">{s.label}</span>
              <span className="review-doc__page-num">p.{i + 1}</span>
            </div>
            <div className="review-doc__page-content">
              {s.documentLines.map((line, li) => (
                <DocumentLine key={`${s.id}-${li}`} line={line} reduced={reduced} accent={step.color} />
              ))}
            </div>
            <div className="review-doc__page-footer">
              {i === activeIndex && step.issue && (
                <Redline active={true}>
                  {step.issue}
                </Redline>
              )}
              {i < activeIndex && (
                <motion.div
                  className="review-doc__page-resolved"
                  initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduced ? 0.01 : 0.3, ease: EASE }}
                >
                  <Check size={14} style={{ color: 'var(--green)' }} />
                  <span>Resolved</span>
                </motion.div>
              )}
              {i > activeIndex && (
                <div className="review-doc__page-pending">
                  <Loader2 size={14} className="review-doc__pending-spin" />
                  <span>Awaiting review</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReviewStepMarker({ step, index, isActive, isCompleted, reduced, onClick }) {
  return (
    <motion.div
      className={`review-step-marker ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : index * 0.1, ease: EASE }}
      onClick={() => onClick(step.id)}
      style={{ '--step-color': step.color }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(step.id); }}
    >
      <div className="review-step-marker__connector">
        <span className="review-step-marker__line" style={{ background: isCompleted ? step.color : 'var(--border)' }} />
        <span className="review-step-marker__dot" style={{ background: isCompleted ? step.color : isActive ? step.color : 'var(--border)', borderColor: isCompleted ? step.color : isActive ? step.color : 'var(--border)' }} />
      </div>
      <div className="review-step-marker__content">
        <span className="review-step-marker__label">{step.label}</span>
        <span className="review-step-marker__subtitle">{step.subtitle}</span>
        <StatusBadge status={isCompleted ? 'verified' : isActive ? 'reviewed' : 'raw'} style={{ '--badge-color': step.color }} />
      </div>
    </motion.div>
  );
}

export default function HumanReview() {
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState('flagged');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const { phase } = useDocumentState();
  const { style: parallaxStyle } = useParallax({ containerRef: { current: null } });

  const { ref, getValues } = useScrollScene({
    offset: ['start start', 'end end'],
    yRange: [0, 100],
    opacityRange: [0, 1],
    scaleRange: [1, 1],
  });

  const { y, opacity } = getValues();

  const handleResolve = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const steps = REVIEW_STEPS.map(s => s.id);
    const idx = steps.indexOf(stepId);
    if (idx < steps.length - 1) {
      setTimeout(() => setActiveStep(steps[idx + 1]), 400);
    }
  };

  useEffect(() => {
    if (reduced || isPaused) return;
    const timer = setTimeout(() => {
      if (activeStep !== 'verified' && !completedSteps.has(activeStep)) {
        handleResolve(activeStep);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeStep, completedSteps, reduced, isPaused]);

  return (
    <Section ref={ref} id="human-review" className="section--human-review" style={{ transform: y, opacity }}>
      <div className="review-layout"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="review-panel" style={{ ...parallaxStyle }}>
          <SectionHead
            kicker="02 / Human in the loop"
            title={<>Automation drafts.<br /><span className="gradient-text">Humans decide.</span></>}
            desc="Every document passes through a human review checkpoint. AI structures; a person verifies, corrects, and takes responsibility for the final output."
          />

          <DocumentProgress
            phase={activeStep}
            phases={REVIEW_STEPS.map(s => s.label)}
          />

          <PhaseIndicator
            phase={activeStep}
            phases={REVIEW_STEPS.map(s => s.label)}
            onPhaseClick={setActiveStep}
          />

          <div className="review-steps" role="list" aria-label="Review steps">
            {REVIEW_STEPS.map((step, i) => (
              <ReviewStepMarker
                key={step.id}
                step={step}
                index={i}
                isActive={activeStep === step.id}
                isCompleted={completedSteps.has(step.id)}
                reduced={reduced}
                onClick={setActiveStep}
              />
            ))}
          </div>

          <div className="review-principle">
            <FileText size={20} />
            <div>
              <strong>No invented metrics. No fake guarantees.</strong>
              <p>This checkpoint exists because document decisions have real consequences. The human reviewer is accountable for what gets submitted.</p>
            </div>
          </div>
        </div>

        <div className="review-preview-panel">
          <ReviewDocument activeStep={activeStep} reduced={reduced} />
        </div>
      </div>
    </Section>
  );
}