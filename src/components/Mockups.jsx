import React from 'react';

export function CapMockup({ type, accent }) {
  if (type === 'visa') return (
    <div className="cap-mock">
      <div className="cap-mock__header">
        <span className="cap-mock__dot" style={{ background: accent }} />
        <span>VISA CHECKLIST</span>
      </div>
      <div className="cap-mock__body">
        <div className="cap-mock__row"><span className="cap-mock__check" />Passport validity</div>
        <div className="cap-mock__row"><span className="cap-mock__check" />Financial evidence</div>
        <div className="cap-mock__row cap-mock__row--pending"><span className="cap-mock__pending" />Accommodation proof</div>
        <div className="cap-mock__row cap-mock__row--pending"><span className="cap-mock__pending" />Cover letter</div>
      </div>
      <div className="cap-mock__footer">
        <div className="cap-mock__bar"><div className="cap-mock__bar-fill" style={{ width: '65%', background: accent }} /></div>
        <span>65% ready</span>
      </div>
    </div>
  );
  if (type === 'academic') return (
    <div className="cap-mock">
      <div className="cap-mock__header">
        <span className="cap-mock__dot" style={{ background: accent }} />
        <span>STATEMENT</span>
      </div>
      <div className="cap-mock__body">
        <div className="cap-mock__heading">Why this programme?</div>
        <div className="cap-mock__rule" />
        <div className="cap-mock__para"><i /><i /><i /><i /></div>
        <div className="cap-mock__label">MOTIVATION · EXPERIENCE · GOALS</div>
      </div>
      <div className="cap-mock__footer">
        <span className="cap-mock__badge" style={{ color: accent }}>DRAFT v2</span>
        <span>3 sections</span>
      </div>
    </div>
  );
  if (type === 'business') return (
    <div className="cap-mock">
      <div className="cap-mock__header">
        <span className="cap-mock__dot" style={{ background: accent }} />
        <span>COMPANY PROFILE</span>
      </div>
      <div className="cap-mock__body">
        <div className="cap-mock__logo-circle">DF</div>
        <div className="cap-mock__grid-3">
          <div className="cap-mock__box" /><div className="cap-mock__box" /><div className="cap-mock__box" />
        </div>
        <div className="cap-mock__label">STRATEGY · SERVICES · STORY</div>
      </div>
      <div className="cap-mock__footer">
        <span className="cap-mock__badge" style={{ color: accent }}>PROPOSAL</span>
        <span>Client-ready</span>
      </div>
    </div>
  );
  return (
    <div className="cap-mock">
      <div className="cap-mock__header">
        <span className="cap-mock__dot" style={{ background: accent }} />
        <span>CUSTOM WORKFLOW</span>
      </div>
      <div className="cap-mock__body">
        <div className="cap-mock__row"><span className="cap-mock__check" />Research gathered</div>
        <div className="cap-mock__row"><span className="cap-mock__check" />Structure defined</div>
        <div className="cap-mock__row"><span className="cap-mock__check" />Draft built</div>
        <div className="cap-mock__row cap-mock__row--pending"><span className="cap-mock__pending" />Final review</div>
      </div>
      <div className="cap-mock__footer">
        <span className="cap-mock__badge" style={{ color: accent }}>IN PROGRESS</span>
        <span>75% complete</span>
      </div>
    </div>
  );
}

export function WorkMockup({ index }) {
  const imgs = ['/images/visa-passport.jpg', '/images/academic-study.jpg', '/images/business-docs.jpg'];
  const labels = ['VISA APPLICATION', 'ACADEMIC', 'BUSINESS'];
  const titles = ['Application\nreadiness system', 'Statement &\nevidence set', 'Company\nprofile system'];
  return (
    <div className="mock mock--real">
      <img src={imgs[index]} alt={labels[index]} loading="lazy" />
      <div className="mock__overlay">
        <div className="mock__overlay-top">
          <span>{labels[index]}</span>
        </div>
        <strong>{titles[index].split('\n').map((l, i) => <React.Fragment key={i}>{l}{i === 0 && <br />}</React.Fragment>)}</strong>
      </div>
    </div>
  );
}