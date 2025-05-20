import { useCallback } from 'react';
import { API_CONFIG } from '../config/api';
import { useAuthError } from './useAuthError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface RequestOptions extends RequestInit {
	retry?: boolean;
}

export const useApi = () => {
	const { handleAuthError } = useAuthError();

	const request = useCallback(
		async (endpoint: string, options: RequestOptions = {}) => {
			const { retry = true, ...fetchOptions } = options;
			const accessToken = await AsyncStorage.getItem('access_token');

			const headers = {
				'Content-Type': 'application/json',
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				...options.headers,
			};

			// Добавляем refreshToken только для эндпоинта refresh
			let body = options.body;
			if (endpoint === '/auth/refresh') {
				const refreshToken = await SecureStore.getItemAsync('refresh_token');
				if (refreshToken) {
					body = JSON.stringify({ refreshToken });
				}
			}

			try {
				const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
					...fetchOptions,
					headers,
					body,
				});

				if (!response.ok) {
					const error = await response.json().catch(() => ({}));
					error.status = response.status;

					// Если получили 401 и это первая попытка, пробуем обновить токен
					if (response.status === 401 && retry) {
						const refreshed = await handleAuthError(error);
						if (refreshed) {
							// Повторяем запрос с новым токеном
							return request(endpoint, { ...options, retry: false });
						}
					}

					throw error;
				}

				return response.json();
			} catch (error) {
				throw error;
			}
		},
		[handleAuthError]
	);

	return { request };
};
