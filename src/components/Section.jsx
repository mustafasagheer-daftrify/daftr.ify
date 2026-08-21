import React from 'react';
import { motion } from 'framer-motion';

export function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHead({ kicker, title, desc, align = 'start' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`section__head ${align === 'center' ? 'section__head--center' : ''}`}
    >
      <span className="kicker">{kicker}</span>
      <h2 className="section__title">{title}</h2>
      {desc && <p className="section__desc">{desc}</p>}
    </motion.div>
  );
}

export function ScrollReveal({ children, className = '', stagger = 0.08, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            >{child}</motion.div>
          : child
      )}
    </motion.div>
  );
}