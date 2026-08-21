import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DocumentPhase, PHASE_ORDER, PHASE_LABELS, PHASE_COLORS } from './documentState';

const DocumentStateContext = createContext(null);

export function DocumentStateProvider({ children, initialPhase = DocumentPhase.RAW }) {
  const [phase, setPhase] = useState(initialPhase);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const controlledSetPhase = useCallback((newPhase) => {
    if (!PHASE_ORDER.includes(newPhase)) return;
    setIsTransitioning(true);
    setPhase(newPhase);
    setTimeout(() => setIsTransitioning(false), 400);
  }, []);

  const nextPhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      controlledSetPhase(PHASE_ORDER[idx + 1]);
    }
  }, [phase]);

  const prevPhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx > 0) {
      controlledSetPhase(PHASE_ORDER[idx - 1]);
    }
  }, [phase]);

  const value = useMemo(() => ({
    phase,
    setPhase: controlledSetPhase,
    nextPhase,
    prevPhase,
    isTransitioning,
    PHASE_ORDER,
    PHASE_LABELS,
    PHASE_COLORS,
  }), [phase, controlledSetPhase, nextPhase, prevPhase, isTransitioning]);

  return (
    <DocumentStateContext.Provider value={value}>
      {children}
    </DocumentStateContext.Provider>
  );
}

export function useDocumentState() {
  const context = useContext(DocumentStateContext);
  if (!context) {
    throw new Error('useDocumentState must be used within a DocumentStateProvider');
  }
  return context;
}

export { DocumentPhase, PHASE_ORDER, PHASE_LABELS, PHASE_COLORS };