// Re-export from canonical location so existing imports still work
export { getTopicColor } from '@/lib/topic-colors';

export function getDifficultyStyle(difficulty: string): { bg: string; text: string; border: string } {
  switch (difficulty) {
    case 'EASY':   return { bg: '#1c3a1c', text: '#4ade80', border: '#2d5a2d' };
    case 'MEDIUM': return { bg: '#3a2a0d', text: '#fb923c', border: '#5a3d10' };
    case 'HARD':   return { bg: '#3a0f0f', text: '#f87171', border: '#5a1a1a' };
    default:       return { bg: '#1a1a1a', text: '#888',    border: '#2a2a2a' };
  }
}

// Pill component — exact spec: border-radius 4px, border included
export function Pill({ bg, text, border, children }: { bg: string; text: string; border?: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        background: bg,
        color: text,
        border: border ? `1px solid ${border}` : undefined,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}
