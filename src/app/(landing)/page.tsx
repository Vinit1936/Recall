import { NoiseTexture } from '@/components/landing/noise';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { RevisionSection } from '@/components/landing/revision-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PlatformStrip } from '@/components/landing/platform-strip';
import { StatsBar } from '@/components/landing/stats-bar';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <>
      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <RevisionSection />
        <HowItWorks />
        <PlatformStrip />
        <StatsBar />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
