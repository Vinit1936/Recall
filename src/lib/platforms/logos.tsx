import Image from 'next/image';

type PlatformLogoProps = {
  platform: string;
  size?: number;
};

export function PlatformLogo({ platform, size = 24 }: PlatformLogoProps) {
  if (platform === 'LEETCODE') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          background: '#0F0F0F',
          borderRadius: 4,
          padding: 3,
          flexShrink: 0,
        }}
      >
        <img
          src="/LeetCode.png"
          alt="LeetCode"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </span>
    );
  }

  const configs: Record<string, { bg: string; text: string; color: string; fontSize: number }> = {
    CODEFORCES: { bg: '#1F8ACB', text: 'CF',  color: '#fff', fontSize: 10 },
    GFG:        { bg: '#2F8D46', text: 'GFG', color: '#fff', fontSize: 9  },
    HACKERRANK: { bg: '#00EA64', text: 'HR',  color: '#000', fontSize: 10 },
    CODECHEF:   { bg: '#5B4638', text: 'CC',  color: '#fff', fontSize: 10 },
  };

  const cfg = configs[platform] ?? { bg: '#333', text: '?', color: '#fff', fontSize: 10 };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        background: cfg.bg,
        borderRadius: 4,
        fontSize: cfg.fontSize,
        fontWeight: 700,
        color: cfg.color,
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      {cfg.text}
    </span>
  );
}
