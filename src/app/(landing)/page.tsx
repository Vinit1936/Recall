import { NoiseTexture } from '@/components/landing/noise';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';

export default function LandingPage() {
  return (
    <>
      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
      </main>
    </>
  );
}
