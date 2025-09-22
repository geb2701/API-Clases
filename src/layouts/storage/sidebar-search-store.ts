import { create } from "zustand";

interface SidebarSearchState {
	filterValue: string;
	setFilter: (filterValue: string) => void;
}

export const SidebarSearchStore = create<SidebarSearchState>((set) => ({
	filterValue: "",
	setFilter: (filterValue) => set({ filterValue }),
}));
