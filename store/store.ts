import { create } from "zustand";

interface AppState {
    clientID: string;
    setClientID: (clientId: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
    clientID: "",
    setClientID: (clientID: string) => set((state) => ({ clientID }))
}))

interface FinanceState {
    client: string;
    setClient: (client: string) => void;
}

export const useFinanceStore = create<FinanceState>()((set) => ({
    client: "",
    setClient: (client: string) => set((state) => ({ client }))
}))