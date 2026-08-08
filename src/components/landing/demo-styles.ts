import { getTopicColor } from '@/lib/topic-colors';

export { getTopicColor };

export function getDifficultyStyle(difficulty: string): { bg: string; text: string; border: string } {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return { bg: '#1c3a1c', text: '#4ade80', border: '#2d5a2d' };
    case 'MEDIUM':
      return { bg: '#3a2a0d', text: '#fb923c', border: '#5a3d10' };
    case 'HARD':
      return { bg: '#3a0f0f', text: '#f87171', border: '#5a1a1a' };
    default:
      return { bg: '#1a1a1a', text: '#888888', border: '#2a2a2a' };
  }
}

export const CONF_BUTTONS = {
  CLEAN: {
    label: 'Clean',
    symbol: '✓',
    doneBg: 'rgba(74, 222, 128, 0.1)',
    doneBorder: 'rgba(74, 222, 128, 0.3)',
    doneText: '#4ade80',
    hoverBorder: '#4ade80',
  },
  SHAKY: {
    label: 'Shaky',
    symbol: '~',
    doneBg: 'rgba(251, 146, 60, 0.1)',
    doneBorder: 'rgba(251, 146, 60, 0.3)',
    doneText: '#fb923c',
    hoverBorder: '#fb923c',
  },
  STRUGGLED: {
    label: 'Struggled',
    symbol: '✗',
    doneBg: 'rgba(248, 113, 113, 0.1)',
    doneBorder: 'rgba(248, 113, 113, 0.3)',
    doneText: '#f87171',
    hoverBorder: '#f87171',
  },
};
