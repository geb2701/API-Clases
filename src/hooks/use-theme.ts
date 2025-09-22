import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import cookieStorage from "../storage/cookie-storage";

export type Theme = "dark" | "light" | "system";

export interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const useThemeStore = create(
	persist<ThemeStore>(
		(set) => ({
			theme: "system",
			setTheme: (theme) => {
				set({ theme });
			},
		}),
		{
			name: `react-theme-ui${process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ""}`,
			storage: createJSONStorage(() => cookieStorage),
		},
	),
);

/**
 * Custom hook to sync theme with root element class and system preference.
 */
function useTheme() {
	const { theme, setTheme } = useThemeStore();

	useEffect(() => {
		const root = window.document.documentElement;

		const applyTheme = (currentTheme: Theme) => {
			let resolvedTheme: "dark" | "light";
			if (currentTheme === "system") {
				resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
					.matches
					? "dark"
					: "light";
			} else {
				resolvedTheme = currentTheme;
			}
			root.classList.remove("light", "dark");
			root.classList.add(resolvedTheme);
		};

		applyTheme(theme);

		let mediaQuery: MediaQueryList | null = null;
		const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
			if (theme === "system") {
				applyTheme("system");
			}
		};

		if (theme === "system") {
			mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			mediaQuery.addEventListener("change", handleSystemThemeChange);
		}

		return () => {
			if (mediaQuery) {
				mediaQuery.removeEventListener("change", handleSystemThemeChange);
			}
		};
	}, [theme]);

	return { theme, setTheme };
}

export default useTheme;
