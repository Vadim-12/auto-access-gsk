import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	signIn: (accessToken: string, refreshToken: string) => Promise<void>;
	logout: () => Promise<void>;
	initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
	isAuthenticated: false,
	token: null,
	signIn: async (accessToken: string, refreshToken: string) => {
		try {
			await AsyncStorage.setItem('auth_token', accessToken);
			await SecureStore.setItemAsync('refresh_token', refreshToken);
			set({ isAuthenticated: true, token: accessToken });
			console.log('signed in with token', accessToken);
		} catch (error) {
			console.error('Ошибка при сохранении Access-токена:', error);
		}
	},

	logout: async () => {
		try {
			await AsyncStorage.removeItem('auth_token');
			await SecureStore.deleteItemAsync('refresh_token');
			set({ isAuthenticated: false, token: null });
			console.log('signed out');
		} catch (error) {
			console.error('Ошибка при удалении Access-токена:', error);
		}
	},
	initialize: async () => {
		try {
			const accessToken = await AsyncStorage.getItem('auth_token');
			if (accessToken) {
				set({ isAuthenticated: true, token: accessToken });
			}
		} catch (error) {
			console.error('Ошибка при инициализации авторизации:', error);
		}
	},
}));

// Хук для инициализации состояния при запуске приложения
export function useInitializeAuth() {
	const initialize = useAuth((state) => state.initialize);
	const isAuthenticated = useAuth((state) => state.isAuthenticated);

	useEffect(() => {
		initialize().then(() => {
			console.log('checked auth:', isAuthenticated);
		});
	}, []);
}
