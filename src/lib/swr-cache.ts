// SWR localStorage cache provider for instant 0ms renders on page reload
export function localStorageProvider() {
  if (typeof window === 'undefined') return new Map();

  let initialEntries: [string, any][] = [];
  try {
    const raw = localStorage.getItem('recall_swr_cache');
    if (raw) {
      initialEntries = JSON.parse(raw);
    }
  } catch {}

  const map = new Map<string, any>(initialEntries);

  // Persist /api/ cache entries to localStorage
  const saveCache = () => {
    try {
      const apiCache = Array.from(map.entries()).filter(
        ([key]) => typeof key === 'string' && key.includes('/api/')
      );
      localStorage.setItem('recall_swr_cache', JSON.stringify(apiCache));
    } catch {}
  };

  // Intercept set & delete so EVERY mutate() immediately syncs to localStorage (0ms)
  const originalSet = map.set.bind(map);
  const originalDelete = map.delete.bind(map);

  map.set = (key: any, value: any) => {
    const res = originalSet(key, value);
    if (typeof key === 'string' && key.includes('/api/')) {
      saveCache();
    }
    return res;
  };

  map.delete = (key: any) => {
    const res = originalDelete(key);
    if (typeof key === 'string' && key.includes('/api/')) {
      saveCache();
    }
    return res;
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', saveCache);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveCache();
    });
  }

  return map;
}

