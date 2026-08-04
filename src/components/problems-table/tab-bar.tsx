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

const TABS: { key: TabKey; label: string; platform?: string; size?: number; padding?: number }[] = [
  { key: 'all', label: 'All Problems' },
  { key: 'status', label: 'By Status' },
  { key: 'topic', label: 'By Topic' },
  { key: 'LEETCODE', label: 'LeetCode', platform: 'LEETCODE', size: 21, padding: 2 },
  { key: 'CODEFORCES', label: 'Codeforces', platform: 'CODEFORCES', size: 21, padding: 2 },
  { key: 'CODECHEF', label: 'CodeChef', platform: 'CODECHEF', size: 18, padding: 2 },
  { key: 'GFG', label: 'GeeksForGeeks', platform: 'GFG', size: 21, padding: 2 },
  { key: 'HACKERRANK', label: 'HackerRank', platform: 'HACKERRANK', size: 18, padding: 0 },
];

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        borderBottom: '1px solid #1e1e1e',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
      }}
    >
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
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              boxShadow: isActive ? 'inset 0 -2px 0 #ffffff' : 'none',
              color: isActive ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              padding: isPlatformTab ? '8px 10px' : '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, box-shadow 0.15s, opacity 0.15s',
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
              <PlatformLogo platform={tab.platform!} size={tab.size ?? 18} padding={tab.padding} />
            ) : (
              <span>{tab.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
