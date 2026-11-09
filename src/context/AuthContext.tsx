import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, ApiEnvironmentOption, AuthContextType, StoredSession } from '../types/auth';

const AUTH_STORAGE_KEY = 'sueldoshub_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedEnvId, setSelectedEnvId] = useState<string>('rpi-prod');
  const [selectedEnvNombre, setSelectedEnvNombre] = useState<string>('Producción (Raspberry Pi)');
  const [environments, setEnvironments] = useState<ApiEnvironmentOption[]>([
    { id: 'rpi-prod', nombre: 'Producción (Raspberry Pi)' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch available public environments from backend proxy
  useEffect(() => {
    fetch('/api/environments')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener lista de entornos');
        return res.json();
      })
      .then((data: ApiEnvironmentOption[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setEnvironments(data);
          // Keep current selection if valid, or default to first
          setSelectedEnvId(prev => {
            const exists = data.some(e => e.id === prev);
            return exists ? prev : data[0].id;
          });
        }
      })
      .catch(err => {
        console.warn('Usando entornos por defecto:', err);
      });
  }, []);

  // Update selectedEnvNombre when selectedEnvId or environments change
  useEffect(() => {
    const env = environments.find(e => e.id === selectedEnvId);
    if (env) {
      setSelectedEnvNombre(env.nombre);
    }
  }, [selectedEnvId, environments]);

  // 2. Restore existing session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const session: StoredSession = JSON.parse(saved);
        // Verify expiration
        if (session.expiresAt && Date.now() < session.expiresAt && session.token && session.user) {
          setUser(session.user);
          setToken(session.token);
          if (session.selectedEnvId) setSelectedEnvId(session.selectedEnvId);
          if (session.selectedEnvNombre) setSelectedEnvNombre(session.selectedEnvNombre);
        } else {
          // Expired
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Error restaurando sesión:', e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // 3. Login method
  const login = async (usr: string, pws: string, envId?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const targetEnvId = envId || selectedEnvId;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          envId: targetEnvId,
          usr: usr.trim(),
          pws: pws.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        const errorMsg = data.error || data.hint || 'Usuario o contraseña incorrectos.';
        setError(errorMsg);
        setIsLoading(false);
        return false;
      }

      if (data.token) {
        const userObj: AuthUser = data.user || {
          id: 0,
          usr: usr.trim(),
          userName: usr.trim()
        };

        const envObj = environments.find(e => e.id === targetEnvId);
        const envNombre = envObj?.nombre || 'Producción';

        const expiresIn = data.expiresInSeconds || 28800; // 8 hours default
        const expiresAt = Date.now() + expiresIn * 1000;

        setUser(userObj);
        setToken(data.token);
        setSelectedEnvId(targetEnvId);
        setSelectedEnvNombre(envNombre);

        const session: StoredSession = {
          user: userObj,
          token: data.token,
          selectedEnvId: targetEnvId,
          selectedEnvNombre: envNombre,
          expiresAt
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setIsLoading(false);
        return true;
      } else {
        setError('Respuesta del servidor inválida: no se recibió token.');
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('Error durante login:', err);
      setError('Error de comunicación con el servicio de autenticación.');
      setIsLoading(false);
      return false;
    }
  };

  // 4. Logout method
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedEnvId,
        selectedEnvNombre,
        environments,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        logout,
        setSelectedEnvId,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
