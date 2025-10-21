import { User } from "@/types/user";
import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/features/auth/services/auth-service";
import { toast } from "sonner";

type SignupValues = { name: string; surname?: string; email: string; password: string };

export interface AuthState {
  isLogged: boolean;
  user: User | null;
  signup: (values: SignupValues) => Promise<boolean>;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (updater: Partial<User> | ((prev: User) => User)) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogged: false,
      user: null,

      /**
       * Registrar usuario usando la API
       * POST /api/auth/register
       */
      signup: async (values) => {
        try {
          const user = await authService.register({
            name: values.name,
            surname: values.surname,
            email: values.email,
            password: values.password,
          });

          set({ isLogged: true, user });
          toast.success("¡Registro exitoso!", {
            description: `Bienvenido/a ${user.name}`,
          });
          return true;
        } catch (error: any) {
          console.error("Error en registro:", error);

          // Manejar errores específicos
          if (error?.response?.status === 400) {
            toast.error("Error en el registro", {
              description: "El email ya está registrado",
            });
          } else {
            toast.error("Error en el registro", {
              description: "No se pudo completar el registro. Intenta de nuevo.",
            });
          }
          return false;
        }
      },

      /**
       * Login usando la API
       * POST /api/auth/login
       */
      login: async (usernameOrEmail, password) => {
        try {
          const user = await authService.login({
            email: usernameOrEmail.trim(),
            password: password,
          });

          set({ isLogged: true, user });
          toast.success("¡Login exitoso!", {
            description: `Bienvenido/a ${user.name}`,
          });
          return true;
        } catch (error: any) {
          console.error("Error en login:", error);

          // Manejar errores específicos
          if (error?.response?.status === 401) {
            toast.error("Error de autenticación", {
              description: "Email o contraseña incorrectos",
            });
          } else {
            toast.error("Error en el login", {
              description: "No se pudo iniciar sesión. Intenta de nuevo.",
            });
          }
          return false;
        }
      },

      /**
       * Logout usando la API
       * POST /api/auth/logout
       */
      logout: async () => {
        try {
          await authService.logout();
          set({ isLogged: false, user: null });
          toast.info("Sesión cerrada", {
            description: "Has cerrado sesión correctamente",
          });
        } catch (error) {
          console.error("Error en logout:", error);
          // Igual cerramos la sesión localmente
          set({ isLogged: false, user: null });
        }
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
        isLogged: state.isLogged,
        user: state.user,
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
