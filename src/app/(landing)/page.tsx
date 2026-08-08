import { NoiseTexture } from '@/components/landing/noise';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { RevisionDemo } from '@/components/landing/revision-demo';

export default function LandingPage() {
  return (
    <>
      <NoiseTexture />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />

        {/* Section: Revision Demo */}
        <section
          id="how-it-works"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '120px 32px 140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '64px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #1e1e1e',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '100px',
                padding: '4px 12px 4px 8px',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#555555', fontSize: '11px' }}>✦</span>
              <span
                style={{
                  color: '#666666',
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                Spaced repetition workflow
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-serif), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(36px, 4vw, 54px)',
                fontWeight: 400,
                color: '#f0f0f0',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Revise on schedule, build long-term memory.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '16px',
                color: '#666666',
                marginTop: '16px',
                lineHeight: 1.6,
              }}
            >
              Rate your confidence after every revision. Recall adjusts the algorithm dynamically to keep problem solutions sharp.
            </p>
          </div>

          {/* Browser Chrome Container */}
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              borderRadius: '12px',
              border: '1px solid #1a1a1a',
              background: '#0a0a0a',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px #111111, 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                height: '40px',
                background: '#111111',
                borderBottom: '1px solid #1a1a1a',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3a1a1a' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3a3010' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1a3a1a' }} />
              </div>
              <div
                style={{
                  flex: 1,
                  maxWidth: '280px',
                  margin: '0 auto',
                  background: '#0a0a0a',
                  border: '1px solid #1e1e1e',
                  borderRadius: '6px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#444444', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '11px' }}>
                  app.recall.dev/daily
                </span>
              </div>
            </div>

            {/* Revision Demo */}
            <RevisionDemo />
          </div>
        </section>
      </main>
    </>
  );
}
