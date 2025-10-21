import { User } from "@/types/user";
import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/features/auth/services/auth-service";

type SignupValues = { name: string; surname?: string; email: string; password: string };

export interface AuthState {
  isLogged: boolean;
  user: User | null;
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
      isLogged: true,
      user: testUser,
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

          if (response.success && response.user) {
            // Crear usuario y guardar en estado
            const newUser = new User(
              response.user.id,
              response.user.name,
              response.user.surname || "",
              response.user.email
            );
            set({ isLogged: true, user: newUser });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Error en signup:", error);
          return false;
        }
      },

      login: async (usernameOrEmail, password) => {
        try {
          // Usuario demo local para testing
          if (usernameOrEmail.trim() === "demo" && password === "demo123") {
            set({ isLogged: true, user: testUser });
            return true;
          }

          // Llamar a la API para login
          const response = await authService.login({
            email: usernameOrEmail.trim().toLowerCase(),
            password: password
          });

          if (response.success && response.user) {
            // Crear usuario y guardar en estado
            const loggedUser = new User(
              response.user.id,
              response.user.name,
              response.user.surname || "",
              response.user.email
            );
            set({ isLogged: true, user: loggedUser });
            return true;
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
          // Siempre limpiar estado local
          set({ isLogged: false, user: null });
        }
      },
      resetToTestUser: () => set({ isLogged: true, user: testUser }),

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
        isLogged: state.isLogged,
        user: state.user,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();
  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
