import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthError = () => {
	const { refreshTokens, logout } = useAuth();

	const handleAuthError = useCallback(
		async (error: any) => {
			if (error?.status === 401) {
				try {
					await refreshTokens();
					return true; // Успешно обновили токены
				} catch (refreshError) {
					console.error('Failed to refresh tokens:', refreshError);
					await logout();
					return false; // Не удалось обновить токены
				}
			}
			return false; // Не ошибка авторизации
		},
		[refreshTokens, logout]
	);

	return { handleAuthError };
};
