import { useState, useRef, useEffect } from 'react';

import { getTopicColor } from '@/lib/topic-colors';
export { getTopicColor };

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

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

export function DifficultyPickerCell({
  difficulty,
  onSave,
}: {
  difficulty: string;
  onSave: (val: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = async (newDiff: string) => {
    setOpen(false);
    if (newDiff === difficulty) return;
    setSaving(true);
    try {
      await onSave(newDiff);
    } catch {
      // Revert handled by parent/SWR
    } finally {
      setSaving(false);
    }
  };

  const diffStyle = getDifficultyStyle(difficulty);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        title="Change difficulty"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          outline: 'none',
          opacity: saving ? 0.6 : 1,
          transition: 'opacity 0.15s ease',
          display: 'inline-flex',
        }}
      >
        <Pill bg={diffStyle.bg} text={diffStyle.text} border={diffStyle.border}>
          {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
        </Pill>
      </button>

      {open && (
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            zIndex: 100,
            background: '#1a1a1c',
            border: '1px solid #2a2a2e',
            borderRadius: 6,
            padding: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 120,
          }}
        >
          {DIFFICULTIES.map((d) => {
            const st = getDifficultyStyle(d);
            const isSelected = d === difficulty;
            const isHovered = hoveredOpt === d;
            return (
              <button
                key={d}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(d);
                }}
                onMouseEnter={() => setHoveredOpt(d)}
                onMouseLeave={() => setHoveredOpt(null)}
                style={{
                  background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'none',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                <Pill bg={st.bg} text={st.text} border={st.border}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </Pill>
                {isSelected && <span style={{ color: '#ffffff', fontSize: 12, marginLeft: 8 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DEFAULT_TOPICS = [
  'Array',
  'String',
  'Hash Table',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Binary Tree',
  'Binary Search Tree',
  'Graph',
  'Heap / Priority Queue',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Trie',
  'Bit Manipulation',
  'Union Find',
  'Matrix',
  'Math',
  'Recursion',
  'Sorting',
];

export function TopicPickerCell({
  topic,
  onSave,
}: {
  topic: string;
  onSave: (val: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 20);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = async (newTopic: string) => {
    setOpen(false);
    if (newTopic === topic) return;
    setSaving(true);
    try {
      await onSave(newTopic);
    } catch {
      // Revert handled by parent/SWR
    } finally {
      setSaving(false);
    }
  };

  const topicColor = getTopicColor(topic || 'General');

  // Filter topics
  const query = search.trim().toLowerCase();
  const filtered = DEFAULT_TOPICS.filter((t) => t.toLowerCase().includes(query));
  const hasExactMatch = DEFAULT_TOPICS.some((t) => t.toLowerCase() === query) || (topic && topic.toLowerCase() === query);
  const showCreateOption = query.length > 0 && !hasExactMatch;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        title="Change topic"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          outline: 'none',
          opacity: saving ? 0.6 : 1,
          transition: 'opacity 0.15s ease',
          display: 'inline-flex',
        }}
      >
        <Pill bg={topicColor.bg} text={topicColor.text} border={topicColor.border}>
          {topic || 'General'}
        </Pill>
      </button>

      {open && (
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            zIndex: 100,
            background: '#1a1a1c',
            border: '1px solid #2a2a2e',
            borderRadius: 6,
            padding: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: 220,
          }}
        >
          {/* Search / Create Input */}
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                e.preventDefault();
                handleSelect(search.trim());
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder="Search or add topic..."
            style={{
              background: '#111',
              border: '1px solid #2a2a2e',
              borderRadius: 4,
              color: '#fff',
              fontSize: 12,
              padding: '5px 8px',
              width: '100%',
              outline: 'none',
              boxSizing: 'border-box',
              caretColor: '#ffffff',
            }}
          />

          {/* Topics List */}
          <div
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingRight: 2,
            }}
          >
            {/* Create new option */}
            {showCreateOption && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(search.trim());
                }}
                onMouseEnter={() => setHoveredOpt('CREATE_NEW')}
                onMouseLeave={() => setHoveredOpt(null)}
                style={{
                  background: hoveredOpt === 'CREATE_NEW' ? 'rgba(255, 255, 255, 0.15)' : 'none',
                  border: '1px dashed #ffffff',
                  borderRadius: 4,
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  textAlign: 'left',
                  width: '100%',
                  outline: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>+ Create</span>
                <Pill bg={getTopicColor(search.trim()).bg} text={getTopicColor(search.trim()).text} border={getTopicColor(search.trim()).border}>
                  {search.trim()}
                </Pill>
              </button>
            )}

            {filtered.map((t) => {
              const tc = getTopicColor(t);
              const isSelected = t === topic;
              const isHovered = hoveredOpt === t;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(t);
                  }}
                  onMouseEnter={() => setHoveredOpt(t)}
                  onMouseLeave={() => setHoveredOpt(null)}
                  style={{
                    background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'none',
                    border: 'none',
                    borderRadius: 4,
                    padding: '5px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    outline: 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <Pill bg={tc.bg} text={tc.text} border={tc.border}>
                    {t}
                  </Pill>
                  {isSelected && <span style={{ color: '#ffffff', fontSize: 12, marginLeft: 8 }}>✓</span>}
                </button>
              );
            })}

            {/* Current topic if custom and not in default list */}
            {topic && !DEFAULT_TOPICS.includes(topic) && !showCreateOption && (
              <button
                key={topic}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(topic);
                }}
                onMouseEnter={() => setHoveredOpt(topic)}
                onMouseLeave={() => setHoveredOpt(null)}
                style={{
                  background: hoveredOpt === topic ? 'rgba(255, 255, 255, 0.08)' : 'none',
                  border: 'none',
                  borderRadius: 4,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                <Pill bg={topicColor.bg} text={topicColor.text} border={topicColor.border}>
                  {topic}
                </Pill>
                <span style={{ color: '#ffffff', fontSize: 12, marginLeft: 8 }}>✓</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
