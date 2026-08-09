'use client';

import dynamic from 'next/dynamic';
import { SmoothScroll } from '@/components/landing/v2/smooth-scroll';
import { Navbar } from '@/components/landing/v2/navbar';
import { Hero } from '@/components/landing/v2/hero';
import { RevisionSection } from '@/components/landing/v2/revision-section';
import { HowItWorks } from '@/components/landing/v2/how-it-works';
import { Science } from '@/components/landing/v2/science';
import { Capabilities } from '@/components/landing/v2/capabilities';
import { FAQ } from '@/components/landing/v2/faq';
import { FinalCTA } from '@/components/landing/v2/final-cta';
import { Footer } from '@/components/landing/v2/footer';

// Load demos client-side only to avoid SSR issues with animations
const TableDemo = dynamic(
  () => import('@/components/landing/table-demo').then((m) => ({ default: m.TableDemo })),
  { ssr: false }
);
const RevisionDemo = dynamic(
  () => import('@/components/landing/revision-demo').then((m) => ({ default: m.RevisionDemo })),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero TableDemo={TableDemo} />
        <RevisionSection RevisionDemo={RevisionDemo} />
        <HowItWorks />
        <Science />
        <Capabilities />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
