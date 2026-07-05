// Utility: deterministic topic color from name hash
// Returns [background, textColor]
export const TOPIC_PALETTE: [string, string][] = [
  ['#1a1a3a', '#818cf8'],
  ['#1a3a3a', '#34d399'],
  ['#3a1a3a', '#c084fc'],
  ['#3a3a1a', '#facc15'],
  ['#1a2a3a', '#38bdf8'],
  ['#3a1a1a', '#fb7185'],
  ['#1a3a2a', '#4ade80'],
  ['#2a1a3a', '#a78bfa'],
  ['#3a2a1a', '#fdba74'],
  ['#1a1a2a', '#94a3b8'],
  ['#2a3a1a', '#86efac'],
  ['#3a2a2a', '#fca5a5'],
];

export function getTopicColor(topic: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = (hash * 31 + topic.charCodeAt(i)) >>> 0;
  }
  return TOPIC_PALETTE[hash % TOPIC_PALETTE.length];
}

export function getDifficultyStyle(difficulty: string): { bg: string; text: string } {
  switch (difficulty) {
    case 'EASY':   return { bg: '#1a3a1a', text: '#4ade80' };
    case 'MEDIUM': return { bg: '#3a2a0a', text: '#fb923c' };
    case 'HARD':   return { bg: '#3a0a0a', text: '#f87171' };
    default:       return { bg: '#1a1a1a', text: '#888' };
  }
}

// Pill component
export function Pill({ bg, text, children }: { bg: string; text: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        background: bg,
        color: text,
        borderRadius: 999,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}
