type PlatformLogoProps = {
  platform: string;
  size?: number;
  padding?: number;
};

const LOGO_CONFIG: Record<string, { src: string; bg: string; padding: number }> = {
  LEETCODE:   { src: '/LeetCode.png',   bg: '#0F0F0F', padding: 3 },
  CODEFORCES: { src: '/Codeforces.png', bg: '#0F0F0F', padding: 3 },
  GFG:        { src: '/gfg.png',        bg: '#0F0F0F', padding: 3 },
  HACKERRANK: { src: '/HackerRank.png', bg: 'transparent', padding: 0 },
  CODECHEF:   { src: '/CodeChef.png',   bg: '#f5f0eb', padding: 3 },
};

export function PlatformLogo({ platform = 'LEETCODE', size = 24, padding }: PlatformLogoProps) {
  const upper = (platform || 'LEETCODE').toUpperCase();
  const cfg = LOGO_CONFIG[upper] || LOGO_CONFIG['LEETCODE'];

  const pad = padding ?? cfg.padding;

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
        padding: pad,
        flexShrink: 0,
      }}
    >
      <img
        src={cfg.src}
        alt={platform}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </span>
  );
}
