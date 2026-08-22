import React from 'react';
import {
  Nav,
  Hero,
  Capabilities,
  Transformation,
  HumanReview,
  Work,
  Process,
  About,
  FAQ,
  FinalCTA,
  Footer,
  Marquee,
} from './sections';
import { ScrollReveal, Section, SectionHead } from './components/Section';
import { MagneticButton } from './components/MagneticButton';
import { CapMockup, WorkMockup } from './components/Mockups';

import { WorkShowcase, ResourcesRail, DecisionLayer, RequestPanel } from './PremiumExperience';
import LivingDocument from './LivingDocument';
import LeadForm from './LeadForm';
import Founder from './Founder';
import Privacy from './Privacy';
import { DocumentStateProvider } from './motion';

export { ScrollReveal, Section, SectionHead, MagneticButton, CapMockup, WorkMockup };

export default function App() {
  return (
    <DocumentStateProvider>
      <div className="app">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        <main id="main-content">
          <Hero />
          <ScrollReveal stagger={0}><Marquee /></ScrollReveal>
          <Capabilities />
          <Transformation />
          <HumanReview />
          <Work />
          <WorkShowcase />
          <ResourcesRail />
          <Process />
          <DecisionLayer />
          <About />
          <Founder />
          <FAQ />
          <RequestPanel />
          <FinalCTA />
          <LeadForm />
        </main>
        <Privacy />
        <Footer />
      </div>
    </DocumentStateProvider>
  );
}