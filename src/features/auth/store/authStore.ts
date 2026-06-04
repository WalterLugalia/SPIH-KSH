import { create } from 'zustand';
import { storage } from '../../../services/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    const user = { id: '1', name: 'Constantine', email };
    await storage.set('user', user);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await storage.remove('user');
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const user = await storage.get<User>('user');
    if (user) set({ user, isAuthenticated: true });
  },
}));