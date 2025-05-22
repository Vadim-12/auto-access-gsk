import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { API_CONFIG } from '@/config/api';

interface RequestOptions extends RequestInit {
	skipAuth?: boolean;
}

export const useRequest = () => {
	const { refreshTokens } = useAuth();

	const request = useCallback(
		async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
			const { skipAuth = false, ...fetchOptions } = options;
			const accessToken = !skipAuth
				? await AsyncStorage.getItem('access_token')
				: null;

			const headers = {
				'Content-Type': 'application/json',
				...(accessToken && { Authorization: `Bearer ${accessToken}` }),
				...options.headers,
			};

			const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
				...fetchOptions,
				headers,
			});

			// Если получили 401 и это не запрос на обновление токенов
			if (response.status === 401 && !url.includes('/auth/refresh')) {
				try {
					// Пробуем обновить токены
					await refreshTokens();

					// Повторяем запрос с новым токеном
					const newAccessToken = await AsyncStorage.getItem('access_token');
					const newHeaders = {
						...headers,
						Authorization: `Bearer ${newAccessToken}`,
					};

					const retryResponse = await fetch(`${API_CONFIG.baseURL}${url}`, {
						...fetchOptions,
						headers: newHeaders,
					});

					if (!retryResponse.ok) {
						throw new Error('Failed to retry request after token refresh');
					}

					return retryResponse.json();
				} catch {
					// Если не удалось обновить токены, выбрасываем ошибку
					throw new Error('Token refresh failed');
				}
			}

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Request failed');
			}

			return response.json() as Promise<T>;
		},
		[refreshTokens]
	);

	return { request };
};
