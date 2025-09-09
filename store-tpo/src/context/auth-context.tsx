import { User } from "@/type/user";
import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLogged: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetToTestUser: () => void;
}

const testUser = new User(1, "Usuario", "Prueba", "test@example.com");

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogged: true,
      user: testUser,

      // Login "fake": valida credenciales hardcodeadas
      // demo / demo123  -> éxito 
      login: async (username, password) => {
        // simulamos latencia
        await new Promise((r) => setTimeout(r, 500));

        const ok = username === "demo" && password === "demo123";
        if (ok) {
          set({
            isLogged: true,
            user: testUser,
          });
          return true;
        }
        return false;
      },

      logout: () => set({ isLogged: false, user: null }),

      // Volver al usuario de prueba (útil para QA)
      resetToTestUser: () => set({ isLogged: true, user: testUser }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ isLogged: state.isLogged, user: state.user }),
    }
  )
);

const AuthContext = createContext<AuthState | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado inicial con un usuario de prueba
  const authStore = useAuthStore();

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
