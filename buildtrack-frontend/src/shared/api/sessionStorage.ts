const STORAGE_KEY = 'buildtrack.session';

interface StoredSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export function saveTokens(tokens: StoredSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function loadTokens(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEY);
}
