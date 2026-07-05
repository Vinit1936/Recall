'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type TabBarProps = {
  activeTab: 'all' | 'status' | 'topic';
  onChange: (tab: 'all' | 'status' | 'topic') => void;
};

const TABS = [
  { key: 'all' as const, label: 'All Problems' },
  { key: 'status' as const, label: 'By Status' },
  { key: 'topic' as const, label: 'By Topic' },
];

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e1e' }}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
              color: isActive ? '#fff' : '#555',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              padding: '8px 16px',
              marginBottom: -1,
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
