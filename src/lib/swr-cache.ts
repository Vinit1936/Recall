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

  // Persist /api/ cache entries to localStorage on page unload or visibility change
  const saveCache = () => {
    try {
      const apiCache = Array.from(map.entries()).filter(
        ([key]) => typeof key === 'string' && key.startsWith('/api/')
      );
      localStorage.setItem('recall_swr_cache', JSON.stringify(apiCache));
    } catch {}
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', saveCache);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveCache();
    });
  }

  return map;
}
