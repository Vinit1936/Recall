'use client';

import { PlatformLogo } from '@/lib/platforms/logos';

export type TabKey =
  | 'all'
  | 'status'
  | 'topic'
  | 'LEETCODE'
  | 'CODEFORCES'
  | 'CODECHEF'
  | 'GFG'
  | 'HACKERRANK';

type TabBarProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string; platform?: string; size?: number }[] = [
  { key: 'all', label: 'All Problems' },
  { key: 'status', label: 'By Status' },
  { key: 'topic', label: 'By Topic' },
  { key: 'LEETCODE', label: 'LeetCode', platform: 'LEETCODE', size: 20 },
  { key: 'CODEFORCES', label: 'Codeforces', platform: 'CODEFORCES', size: 20 },
  { key: 'CODECHEF', label: 'CodeChef', platform: 'CODECHEF', size: 18 },
  { key: 'GFG', label: 'GeeksForGeeks', platform: 'GFG', size: 20 },
  { key: 'HACKERRANK', label: 'HackerRank', platform: 'HACKERRANK', size: 18 },
];

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, borderBottom: '1px solid #1e1e1e', overflowX: 'auto' }}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        const isPlatformTab = !!tab.platform;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            title={tab.label}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
              color: isActive ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              padding: isPlatformTab ? '8px 10px' : '8px 14px',
              marginBottom: -1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s, opacity 0.15s',
              opacity: isPlatformTab && !isActive ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (isPlatformTab && !isActive) e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              if (isPlatformTab && !isActive) e.currentTarget.style.opacity = '0.6';
            }}
          >
            {isPlatformTab ? (
              <PlatformLogo platform={tab.platform!} size={tab.size ?? 18} />
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
