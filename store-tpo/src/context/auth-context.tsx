import { User } from "@/types/user";
import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SignupValues = { name: string; surname?: string; email: string; password: string };

export interface AuthState {
  isLogged: boolean;
  user: User | null;
  registeredUsers: Array<SignupValues & { id: number }>;
  signup: (values: SignupValues) => Promise<boolean>;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetToTestUser: () => void;
  setUser: (updater: Partial<User> | ((prev: User) => User)) => void;
}

const testUser = new User(1, "Usuario", "Prueba", "test@example.com");
const newId = () => Date.now();

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogged: true,
      user: testUser,
      registeredUsers: [],

      signup: async (values) => {
        await new Promise((r) => setTimeout(r, 400));
        const email = values.email.trim().toLowerCase();
        const exists = get().registeredUsers.some((u) => u.email === email);
        if (exists) return false;

        const id = newId();
        const toSave = {
          id,
          name: values.name.trim(),
          surname: (values.surname ?? "").trim(),
          email,
          password: values.password, // demo
        };

        set((state) => ({ registeredUsers: [...state.registeredUsers, toSave] }));
        const newUser = new User(id, toSave.name, toSave.surname, toSave.email);
        set({ isLogged: true, user: newUser });
        return true;
      },

      login: async (usernameOrEmail, password) => {
        await new Promise((r) => setTimeout(r, 400));
        const u = usernameOrEmail.trim();

        if (u === "demo" && password === "demo123") {
          set({ isLogged: true, user: testUser });
          return true;
        }

        const email = u.toLowerCase();
        const found = get().registeredUsers.find(
          (ru) => ru.email === email && ru.password === password
        );
        if (!found) return false;

        const logged = new User(found.id, found.name, found.surname, found.email);
        set({ isLogged: true, user: logged });
        return true;
      },

      logout: () => set({ isLogged: false, user: null }),
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
