export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshResult {
  accessToken: string;
  idToken: string;
  expiresIn: number;
}

export interface AuthContext {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  isAdmin: boolean;
}
