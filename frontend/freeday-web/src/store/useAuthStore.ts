
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  token: string | null;
  user: User | null;
  setUser: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setUser: (token: string, user: User) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null });
        // Optionally, you can clear other related storage here
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);
