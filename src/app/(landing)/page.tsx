'use client';

import dynamic from 'next/dynamic';
import { SmoothScroll } from '@/components/landing/smooth-scroll';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { RevisionSection } from '@/components/landing/revision-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Capabilities } from '@/components/landing/capabilities';
import { FAQ } from '@/components/landing/faq';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';
import DotBackgroundDemo from '@/components/dot-background-demo';

const TableDemo = dynamic(
  () => import('@/components/landing/table-demo').then((m) => ({ default: m.TableDemo })),
  { ssr: false }
);
const RevisionDemo = dynamic(
  () => import('@/components/landing/revision-demo').then((m) => ({ default: m.RevisionDemo })),
  { ssr: false }
);
const Science = dynamic(
  () => import('@/components/landing/science').then((m) => ({ default: m.Science })),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <DotBackgroundDemo>
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
    </DotBackgroundDemo>
  );
}
