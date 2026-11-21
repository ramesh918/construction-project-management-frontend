import { store, setTokens, clearAuth } from '../../app/store';
import { saveTokens } from './sessionStorage';
import type { RefreshResult } from '../types/auth';
import type { PaginatedResponse } from '../types/common';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = 'https://5ns51ou29g.execute-api.us-east-1.amazonaws.com/v1';

// Every BuildTrack endpoint except /auth/health wraps its JSON body in this
// envelope (see the backend's shared/types/common.types.ts ApiResponse<T>).
interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function isEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return typeof body === 'object' && body !== null && 'success' in body;
}

// Carries the HTTP status alongside the message so callers (withAuthRetry)
// can tell "unauthorized, try a refresh" apart from every other failure.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// The one place that actually calls fetch() and attaches auth headers.
// Returns the raw Response plus its parsed JSON body — callers decide how
// to interpret/unwrap that body (plain envelope vs. paginated envelope).
async function rawRequest(path: string, init: RequestInit = {}): Promise<{ res: Response; body: unknown }> {
  const { accessToken } = store.getState().auth;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => null);
  return { res, body };
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { res, body } = await rawRequest(path, init);

  if (isEnvelope(body)) {
    if (!res.ok || !body.success) {
      throw new ApiError(body.error ?? `Request failed: ${res.status}`, res.status);
    }
    return body.data as T;
  }

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }
  return body as T;
}

// Some endpoints (list/paginated ones, e.g. GET /projects) put `count` and
// `lastEvaluatedKey` as siblings of `data` in the envelope, not inside it.
// apiFetch's `return body.data as T` would silently throw those two fields
// away, so paginated endpoints go through this sibling function instead,
// which keeps the envelope intact and just type-checks/throws on it.
async function apiFetchPaginated<T>(path: string, init: RequestInit = {}): Promise<PaginatedResponse<T>> {
  const { res, body } = await rawRequest(path, init);

  if (!isEnvelope(body) || !res.ok || !body.success) {
    const message = isEnvelope(body) ? body.error : undefined;
    throw new ApiError(message ?? `Request failed: ${res.status}`, res.status);
  }
  return body as PaginatedResponse<T>;
}

function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401;
}

// Shared "try once, silently refresh on 401, try exactly once more" logic.
// Step 4 originally wrote this inline inside apiFetchAuthed; it's pulled out
// here so Step 5's paginated variant can reuse it instead of copy-pasting it.
async function withAuthRetry<T>(attempt: () => Promise<T>): Promise<T> {
  try {
    return await attempt();
  } catch (err) {
    if (!isUnauthorized(err)) throw err;

    const { refreshToken } = store.getState().auth;
    if (!refreshToken) {
      store.dispatch(clearAuth());
      throw err;
    }

    let refreshed: RefreshResult;
    try {
      refreshed = await apiFetch<RefreshResult>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (refreshErr) {
      // The refresh token itself is dead (expired/revoked) — there is no
      // path back to a valid session, so log out instead of looping.
      store.dispatch(clearAuth());
      throw refreshErr;
    }

    const nextTokens = { ...refreshed, refreshToken };
    store.dispatch(setTokens(nextTokens));
    saveTokens(nextTokens);

    return attempt(); // retry once, now with the fresh accessToken
  }
}

// Wraps apiFetch with silent token refresh: on a 401, spend the stored
// refreshToken to get a new accessToken/idToken, then retry the original
// call exactly once. Use this (not apiFetch) for any call that must survive
// the access token expiring mid-session.
export function apiFetchAuthed<T>(path: string, init: RequestInit = {}): Promise<T> {
  return withAuthRetry(() => apiFetch<T>(path, init));
}

// Same silent-refresh behavior as apiFetchAuthed, for paginated endpoints.
export function apiFetchPaginatedAuthed<T>(path: string, init: RequestInit = {}): Promise<PaginatedResponse<T>> {
  return withAuthRetry(() => apiFetchPaginated<T>(path, init));
}
