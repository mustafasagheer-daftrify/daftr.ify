export const DocumentPhase = {
  RAW: 'raw',
  STRUCTURED: 'structured',
  REVIEWED: 'reviewed',
  VERIFIED: 'verified',
};

export const PHASE_ORDER = [
  DocumentPhase.RAW,
  DocumentPhase.STRUCTURED,
  DocumentPhase.REVIEWED,
  DocumentPhase.VERIFIED,
];

export const PHASE_LABELS = {
  [DocumentPhase.RAW]: 'RAW INPUT',
  [DocumentPhase.STRUCTURED]: 'STRUCTURED',
  [DocumentPhase.REVIEWED]: 'HUMAN REVIEW',
  [DocumentPhase.VERIFIED]: 'VERIFIED',
};

export const PHASE_COLORS = {
  [DocumentPhase.RAW]: 'var(--accent)',
  [DocumentPhase.STRUCTURED]: 'var(--green)',
  [DocumentPhase.REVIEWED]: 'var(--warning)',
  [DocumentPhase.VERIFIED]: 'var(--green)',
};

export function createDocumentState(initialPhase = DocumentPhase.RAW) {
  let phase = initialPhase;
  const listeners = new Set();

  function getPhase() {
    return phase;
  }

  function setPhase(newPhase) {
    if (!PHASE_ORDER.includes(newPhase)) return;
    phase = newPhase;
    listeners.forEach(fn => fn(phase));
  }

  function nextPhase() {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1]);
    }
  }

  function prevPhase() {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx > 0) {
      setPhase(PHASE_ORDER[idx - 1]);
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    getPhase,
    setPhase,
    nextPhase,
    prevPhase,
    subscribe,
    PHASE_ORDER,
    PHASE_LABELS,
    PHASE_COLORS,
  };
}

export const documentState = createDocumentState();