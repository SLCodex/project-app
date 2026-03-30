import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AuthResponse } from '@project/shared';
import { api } from '../services/api';

type AuthState = {
  token: string | null;
  user: AuthResponse['user'] | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,

  init: async () => {
    const token = await AsyncStorage.getItem('token');
    const userRaw = await AsyncStorage.getItem('user');

    if (token && userRaw) {
      set({ token, user: JSON.parse(userRaw) });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      set({ token: response.data.token, user: response.data.user, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post<AuthResponse>('/auth/register', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      set({ token: response.data.token, user: response.data.user, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    set({ token: null, user: null });
  },
}));
