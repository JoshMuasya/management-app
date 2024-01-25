import { create } from "zustand";

interface AppState {
    clientID: string;
    setClientID: (clientId: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
    clientID: "",
    setClientID: (clientID: string) => set((state) => ({ clientID }))
}))