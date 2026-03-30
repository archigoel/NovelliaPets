import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    userName: string;
    setUserName: (name: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            userName: '',
            setUserName: (name: string) => set({ userName: name }),
            logout: () => set({ userName: '' }),
        }),
        {
            name: "auth-store", // This is the key in AsyncStorage
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);
