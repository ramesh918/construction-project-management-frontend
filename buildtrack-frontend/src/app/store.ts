import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectStatus } from '../shared/types/project';


interface AuthState {
  accessToken: string | null; idToken: string | null; refreshToken: string | null;
  email: string | null; role: 'admin' | 'user' | null;
}

const initialState: AuthState = { accessToken: null, idToken: null, refreshToken: null, email: null, role: null };
const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    setTokens: (s, a: PayloadAction<{ accessToken: string; idToken: string; refreshToken: string }>) => ({ ...s, ...a.payload }),
    setIdentity: (s, a: PayloadAction<{ email: string; role: 'admin' | 'user' }>) => ({ ...s, ...a.payload }),
    clearAuth: () => initialState,
  },
});
interface UiState {
  projectStatusFilter: ProjectStatus | undefined;
}

const uiInitialState: UiState = { projectStatusFilter: undefined };
const uiSlice = createSlice({
  name: 'ui',
  initialState: uiInitialState,
  reducers: {
    setProjectStatusFilter: (s, a: PayloadAction<ProjectStatus | undefined>) => {
      s.projectStatusFilter = a.payload;
    },
  },
});

export const store = configureStore({
  reducer: { auth: authSlice.reducer, ui: uiSlice.reducer },
});
export type RootState = ReturnType<typeof store.getState>;

export const { setTokens, setIdentity, clearAuth } = authSlice.actions;
export const { setProjectStatusFilter } = uiSlice.actions;