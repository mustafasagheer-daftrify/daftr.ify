import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ScanSearch, Zap, MoveUpRight } from 'lucide-react';
import { useReducedMotion, useParallax } from '../motion';
import { documentState, DocumentPhase, PHASE_LABELS, PHASE_COLORS } from '../motion/documentState';

const EASE = [0.22, 1, 0.36, 1];

export default function DocumentMachine({ autoCycle = true, cycleInterval = 5000, controlledPhase }) {
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const { style: parallaxStyle } = useParallax({ containerRef });

  const [currentPhase, setCurrentPhase] = useState(controlledPhase || DocumentPhase.RAW);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (controlledPhase !== undefined) {
      setCurrentPhase(controlledPhase);
    }
  }, [controlledPhase]);

  useEffect(() => {
    if (!autoCycle || controlledPhase !== undefined) return;
    if (reduced) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentPhase(prev => {
        const phases = Object.values(DocumentPhase);
        const idx = phases.indexOf(prev);
        const next = phases[(idx + 1) % phases.length];
        return next;
      });
      setTimeout(() => setIsTransitioning(false), 800);
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [autoCycle, cycleInterval, controlledPhase, reduced]);

  const phases = Object.values(DocumentPhase);

  return (
    <div className="document-machine" data-cursor="explore" ref={containerRef}>
      <div className="machine__header">
        <span>DAFTRIFY / DOCUMENT LAB</span>
        <span>LIVE SYSTEM 001</span>
      </div>

      <div className="machine__stage" style={{ ...parallaxStyle, transformPerspective: 1000 }}>
        {!reduced && (
          <>
            <div className="machine__ambient" />
            <div className="machine__floor" />
            <motion.div
              className="machine__scan"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        <AnimatePresence mode="wait">
          {phases.map((phase, i) => {
            const isActive = phase === currentPhase;
            const isExiting = isTransitioning && phases.indexOf(currentPhase) > i;
            const config = {
              [DocumentPhase.RAW]: { label: 'RAW INPUT', badge: '04 FILES', note: 'needs structure', accent: PHASE_COLORS[DocumentPhase.RAW] },
              [DocumentPhase.STRUCTURED]: { label: 'PROCESSING', badge: 'STRUCTURE', note: 'organizing', accent: PHASE_COLORS[DocumentPhase.STRUCTURED] },
              [DocumentPhase.REVIEWED]: { label: 'HUMAN REVIEW', badge: 'REVIEWING', note: 'verifying', accent: PHASE_COLORS[DocumentPhase.REVIEWED] },
              [DocumentPhase.VERIFIED]: { label: 'FINAL PASS', badge: 'READY', note: 'verified', accent: PHASE_COLORS[DocumentPhase.VERIFIED] },
            }[phase];

            return (
              <motion.div
                key={phase}
                className={`machine__paper machine__paper--${phase}`}
                initial={reduced ? false : { opacity: 0, rotateY: i < 2 ? -25 : 25, rotateZ: i < 2 ? -12 : 12, x: i < 2 ? -120 : 120, z: -80 }}
                animate={
                  isActive
                    ? { opacity: 1, rotateY: i < 2 ? [-25, -20, -25] : [25, 20, 25], rotateZ: i < 2 ? [-12, -8, -12] : [12, 8, 12], rotateX: [4, 8, 4], x: i < 2 ? [-120, -90, -120] : [120, 90, 120], y: [0, -12, 0], z: [-80, -50, -80] }
                    : isExiting
                      ? { opacity: 0, scale: 0.9, y: -20 }
                      : { opacity: 0.4, rotateY: i < 2 ? -25 : 25, rotateZ: i < 2 ? -12 : 12, x: i < 2 ? -120 : 120, z: -80 }
                }
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: reduced ? 0.01 : 1.2, delay: reduced ? 0 : i * 0.15, ease: EASE }}
                style={{
                  transformOrigin: 'center center',
                  zIndex: 10 - i,
                  '--phase-accent': config.accent,
                }}
              >
                <div className="machine__paper-header">
                  <span>{config.label}</span>
                  <span className={phase === DocumentPhase.VERIFIED ? 'green' : ''}>{config.badge}</span>
                </div>
                <div className="machine__paper-content">
                  {phase === DocumentPhase.RAW && (
                    <>
                      <div className="machine__scribbles"><i /><i /><i /><i /><i /></div>
                      <span className="machine__note">{config.note}</span>
                    </>
                  )}
                  {phase === DocumentPhase.STRUCTURED && (
                    <>
                      <motion.div className="machine__node" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="node-ring" />
                        <Sparkles size={18} />
                        <span>STRUCTURE</span>
                      </motion.div>
                    </>
                  )}
                  {phase === DocumentPhase.REVIEWED && (
                    <>
                      <div className="machine__review-content">
                        <span className="machine__review-icon"><ScanSearch size={20} /></span>
                        <span>Quality check</span>
                      </div>
                    </>
                  )}
                  {phase === DocumentPhase.VERIFIED && (
                    <>
                      <div className="machine__verified-content">
                        <Check size={20} style={{ color: 'var(--green)' }} />
                        <span>VERIFIED</span>
                      </div>
                      <motion.div className="machine__check" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5, ease: EASE }}>
                        <Check size={11} /> VERIFIED
                      </motion.div>
                    </>
                  )}
                </div>
                <div className="machine__paper-edges">
                  <div className="machine__edge machine__edge--top" />
                  <div className="machine__edge machine__edge--right" />
                  <div className="machine__edge machine__edge--left" />
                  <div className="machine__edge machine__edge--bottom" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!reduced && (
          <>
            <motion.div className="machine__tag tag--1" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ScanSearch size={13} /><span>Quality checked</span>
            </motion.div>
            <motion.div className="machine__tag tag--2" animate={{ y: [0, 8, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
              <Zap size={13} /><span>Intelligent</span>
            </motion.div>
            <motion.div className="machine__tag tag--3" animate={{ x: [0, 8, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <MoveUpRight size={13} /><span>Document flow</span>
            </motion.div>
          </>
        )}

        <svg className="machine__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <motion.line
            x1="30" y1="50" x2="48" y2="50"
            stroke="rgba(77,159,255,0.15)" strokeWidth="0.3" strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
          />
          <motion.line
            x1="52" y1="50" x2="70" y2="50"
            stroke="rgba(77,159,255,0.15)" strokeWidth="0.3" strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.3 }}
          />
        </svg>
      </div>

      <div className="machine__footer">
        <span>01</span>
        <div className="machine__bar">
          <motion.i
            animate={{ width: ['0%', '100%', '24%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: EASE }}
          />
        </div>
        <span>04</span>
      </div>
    </div>
  );
}