export interface ApiEnvironmentOption {
  id: string;
  nombre: string;
}

export interface AuthUser {
  id: number;
  usr: string;
  userName: string;
  email?: string;
  role?: number | string;
  app?: string;
  estado?: number;
}

export interface LoginResponse {
  status: 'ok' | 'error';
  token?: string;
  expiresInSeconds?: number;
  user?: AuthUser;
  error?: string;
  hint?: string;
  code?: string;
}

export interface StoredSession {
  user: AuthUser;
  token: string;
  selectedEnvId: string;
  selectedEnvNombre: string;
  expiresAt: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  selectedEnvId: string;
  selectedEnvNombre: string;
  environments: ApiEnvironmentOption[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (usr: string, pws: string, envId?: string) => Promise<boolean>;
  logout: () => void;
  setSelectedEnvId: (id: string) => void;
  clearError: () => void;
}
