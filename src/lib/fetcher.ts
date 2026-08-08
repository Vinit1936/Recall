export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?error=SessionRequired';
    }
    return null;
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
};
