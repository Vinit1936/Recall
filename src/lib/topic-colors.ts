export function getTopicColor(topic: string): { bg: string; text: string; border: string } {
  if (!topic) return { bg: '#1a1a1a', text: '#555555', border: '#2a2a2a' };
  const palette = [
    { bg: '#1a1a3a', text: '#ffffff', border: '#2a2a5a' },
    { bg: '#1a3a2a', text: '#34d399', border: '#2a5a3a' },
    { bg: '#3a1a3a', text: '#c084fc', border: '#5a2a5a' },
    { bg: '#3a3a0f', text: '#facc15', border: '#5a5a1a' },
    { bg: '#0f2a3a', text: '#38bdf8', border: '#1a3a5a' },
    { bg: '#3a0f1a', text: '#fb7185', border: '#5a1a2a' },
    { bg: '#1a3a1a', text: '#4ade80', border: '#2a5a2a' },
    { bg: '#2a1a3a', text: '#a78bfa', border: '#3a2a5a' },
    { bg: '#3a2a0a', text: '#fdba74', border: '#5a3a1a' },
    { bg: '#1a1a2a', text: '#94a3b8', border: '#2a2a3a' },
    { bg: '#1a3a2a', text: '#86efac', border: '#2a5a3a' },
    { bg: '#3a1a1a', text: '#fca5a5', border: '#5a2a2a' },
  ];
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
