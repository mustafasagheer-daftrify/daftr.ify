import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, FileText, Loader2, Eye, Edit3, ArrowRight } from 'lucide-react';
import { Section, SectionHead } from '../components/Section';
import { Redline, Annotation, StatusBadge, PhaseIndicator, DocumentProgress } from '../motion/primitives';
import { useReducedMotion, useScrollScene } from '../motion';

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
  },
];

function ReviewCard({ step, index, isActive, isCompleted, reduced, onAction }) {
  const Icon = step.icon;

  return (
    <motion.article
      className={`review-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.6, delay: reduced ? 0 : index * 0.12, ease: EASE }}
      style={{
        '--step-color': step.color,
        '--step-bg': step.bg,
        '--step-border': step.border,
      }}
    >
      <div className="review-card__header">
        <div className="review-card__phase">
          <span className="review-card__phase-label">{step.label}</span>
          <span className="review-card__phase-subtitle">{step.subtitle}</span>
        </div>
        <StatusBadge
          status={isCompleted ? 'verified' : isActive ? 'reviewed' : 'raw'}
          style={{ '--badge-color': step.color }}
        />
      </div>

      <div className="review-card__content">
        <div className="review-card__issue-block">
          <div className="review-card__issue-meta">
            <span className="review-card__location">{step.location}</span>
            <span className="review-card__severity" style={{ background: step.severity === 'HIGH' ? 'rgba(239,68,68,0.15)' : step.severity === 'MEDIUM' ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)' }}>
              {step.severity}
            </span>
          </div>
          <p className="review-card__issue">{step.issue}</p>
        </div>

        <div className="review-card__annotation-block">
          <Annotation
            active={isActive || isCompleted}
            position={{ top: 'auto', left: 'auto' }}
            reduced={reduced}
          >
            <div className="annotation-content">
              <div className="annotation-content__header">
                <Icon size={12} style={{ color: step.color }} />
                <span>Human annotation</span>
              </div>
              <p>{step.annotation}</p>
            </div>
          </Annotation>
        </div>

        {isCompleted && (
          <motion.div
            className="review-card__resolution"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: reduced ? 0.01 : 0.5, delay: reduced ? 0 : 0.3, ease: EASE }}
          >
            <div className="review-card__resolution-header">
              <Check size={12} style={{ color: 'var(--green)' }} />
              <span>Correction applied</span>
            </div>
            <p>{step.correction}</p>
          </motion.div>
        )}

        {isActive && !isCompleted && (
          <motion.div
            className="review-card__action"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : 0.2, ease: EASE }}
          >
            <button
              onClick={() => onAction?.(step.id)}
              className="review-action-btn"
              style={{ borderColor: step.color, color: step.color }}
            >
              <Eye size={13} /> Review & resolve
            </button>
          </motion.div>
        )}
      </div>

      <div className="review-card__connector" aria-hidden="true">
        <span className="review-card__connector-line" style={{ background: isCompleted ? step.color : 'var(--border)' }} />
        <span className="review-card__connector-dot" style={{ background: isCompleted ? step.color : isActive ? step.color : 'var(--border)', borderColor: isCompleted ? step.color : isActive ? step.color : 'var(--border)' }} />
      </div>
    </motion.article>
  );
}

function ReviewDocumentPreview({ activeStep, reduced }) {
  const steps = REVIEW_STEPS;
  const activeIndex = steps.findIndex(s => s.id === activeStep);

  return (
    <div className="review-document-preview" aria-label="Document preview">
      <div className="review-doc__header">
        <div className="review-doc__dots">
          <span /><span /><span />
        </div>
        <span className="review-doc__title">VISA_APPLICATION_PACK.pdf</span>
        <StatusBadge status={activeStep === 'verified' ? 'verified' : activeStep === 'review' ? 'reviewed' : 'raw'} />
      </div>

      <div className="review-doc__pages">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            className={`review-doc__page ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'completed' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.4, delay: reduced ? 0 : i * 0.08, ease: EASE }}
            style={{ '--page-accent': step.color }}
          >
            <div className="review-doc__page-header">
              <span className="review-doc__page-label">{step.label}</span>
              <span className="review-doc__page-num">p.{i + 1}</span>
            </div>
            <div className="review-doc__page-content">
              {step.issue && i === activeIndex && (
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

export default function HumanReview() {
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState('flagged');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [autoAdvance, setAutoAdvance] = useState(true);

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
    if (!autoAdvance || reduced) return;
    const timer = setTimeout(() => {
      if (activeStep !== 'verified' && !completedSteps.has(activeStep)) {
        handleResolve(activeStep);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeStep, completedSteps, autoAdvance, reduced]);

  return (
    <Section ref={ref} id="human-review" className="section--human-review" style={{ transform: y, opacity }}>
      <div className="review-layout">
        <div className="review-panel">
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

          <div className="review-cards" role="list" aria-label="Review steps">
            {REVIEW_STEPS.map((step, i) => (
              <ReviewCard
                key={step.id}
                step={step}
                index={i}
                isActive={activeStep === step.id}
                isCompleted={completedSteps.has(step.id)}
                reduced={reduced}
                onAction={handleResolve}
              />
            ))}
          </div>

          <div className="review-principle">
            <div className="review-principle__icon">
              <FileText size={20} />
            </div>
            <div>
              <strong>No invented metrics. No fake guarantees.</strong>
              <p>This checkpoint exists because document decisions have real consequences. The human reviewer is accountable for what gets submitted.</p>
            </div>
          </div>
        </div>

        <div className="review-preview-panel">
          <ReviewDocumentPreview activeStep={activeStep} reduced={reduced} />
        </div>
      </div>
    </Section>
  );
}