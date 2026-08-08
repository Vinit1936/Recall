'use client';

import dynamic from 'next/dynamic';
import { NoiseTexture } from '@/components/landing/noise';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { RevisionSection } from '@/components/landing/revision-section';
import { BentoGrid } from '@/components/landing/bento-grid';
import { ScienceSection } from '@/components/landing/science-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PlatformStrip } from '@/components/landing/platform-strip';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

const PixelBlast = dynamic(() => import('@/components/landing/pixel-blast'), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <>
      {/* Dynamic PixelBlast Background with subtle opacity for maximum text contrast */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.07,
        }}
      >
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#ffffff"
          patternScale={3}
          patternDensity={1.3}
          pixelSizeJitter={0.5}
          enableRipples={true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.4}
          edgeFade={0.25}
          transparent={true}
        />
      </div>

      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <RevisionSection />
        <BentoGrid />
        <ScienceSection />
        <HowItWorks />
        <PlatformStrip />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
