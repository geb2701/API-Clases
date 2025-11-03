import { User } from "@/types/user";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/features/auth/services/auth-service";
import { validateAndCleanAuthStorage } from "@/utils/clear-auth-storage";

type SignupValues = { name: string; surname?: string; email: string; password: string };

export interface AuthState {
  isLogged: boolean;
  user: User | null;
  token: string | null;
  registeredUsers: Array<SignupValues & { id: number }>;
  signup: (values: SignupValues) => Promise<boolean>;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetToTestUser: () => void;
  setUser: (updater: Partial<User> | ((prev: User) => User)) => void;
}

const testUser = new User(1, "Usuario", "Prueba", "test@example.com");

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial: no logueado (se valida desde localStorage si existe)
      isLogged: false,
      user: null,
      token: null,
      registeredUsers: [],

      signup: async (values) => {
        try {
          // Llamar a la API para registrar
          const response = await authService.register({
            name: values.name.trim(),
            surname: values.surname?.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password
          });

          if (response.success && response.user && response.token) {
            // Crear usuario y guardar en estado
            const newUser = new User(
              response.user.id,
              response.user.name,
              response.user.surname || "",
              response.user.email
            );
            set({ isLogged: true, user: newUser, token: response.token });
            return true;
          }

          // Si la respuesta indica error, lanzar excepción con el mensaje para que la UI pueda manejarlo
          if (!response.success) {
            const errorMessage = response.message || "Error al registrar";
            console.error("Error en signup:", errorMessage);
            throw new Error(errorMessage);
          }

          return false;
        } catch (error) {
          // Re-lanzar el error para que la UI pueda manejarlo
          if (error instanceof Error) {
            throw error;
          }
          console.error("Error en signup:", error);
          throw new Error("Error desconocido al registrar");
        }
      },

      login: async (usernameOrEmail, password) => {
        try {
          // Usuario demo local para testing (sin token JWT)
          if (usernameOrEmail.trim() === "demo" && password === "demo123") {
            set({ isLogged: true, user: testUser, token: null });
            return true;
          }

          // Llamar a la API para login
          const response = await authService.login({
            email: usernameOrEmail.trim().toLowerCase(),
            password: password
          });

          if (response.success && response.user && response.token) {
            // Crear usuario y guardar en estado con token
            const loggedUser = new User(
              response.user.id,
              response.user.name,
              response.user.surname || "",
              response.user.email
            );
            set({ isLogged: true, user: loggedUser, token: response.token });
            return true;
          }

          // Si la respuesta indica error, loguear el mensaje
          if (!response.success) {
            console.error("Error en login:", response.message || "Credenciales inválidas");
          }

          return false;
        } catch (error) {
          console.error("Error en login:", error);
          return false;
        }
      },

      logout: async () => {
        try {
          // Llamar a la API para logout
          await authService.logout();
        } catch (error) {
          console.error("Error en logout:", error);
        } finally {
          // Siempre limpiar estado local (incluyendo token)
          set({ isLogged: false, user: null, token: null });
        }
      },
      resetToTestUser: () => {
        // Limpiar todo y resetear al usuario de prueba
        set({ isLogged: true, user: testUser, token: null });
      },

      setUser: (updater) =>
        set((state) => {
          if (!state.user) return {};
          const current = state.user;
          const next =
            typeof updater === "function"
              ? (updater as (prev: User) => User)(current)
              : new User(
                current.id,
                updater.name ?? current.name,
                updater.surname ?? current.surname,
                updater.email ?? current.email
              );
          return { user: next };
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        // Solo persistir si hay un token válido y usuario válido
        isLogged: state.isLogged && state.token != null && state.user != null,
        user: state.user,
        token: state.token,
        registeredUsers: state.registeredUsers,
      }),
      // Función para validar los datos al cargar desde localStorage
      onRehydrateStorage: () => (state) => {
        // Si no hay token o usuario válido, limpiar el estado
        if (state) {
          if (!state.token || !state.user) {
            state.isLogged = false;
            state.user = null;
            state.token = null;
          }
        }
      },
    }
  )
);

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();

  // Validar y limpiar datos inválidos al montar el provider
  useEffect(() => {
    validateAndCleanAuthStorage();
  }, []);

  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
