import { useState } from 'react';
import { api } from '@/lib/api';

export function useRemoveUserFromGarage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const removeUser = async (
		garageId: string,
		userId: string,
		adminComment?: string
	) => {
		setIsLoading(true);
		setError(null);
		try {
			await api.delete(`/garage-requests/garage/${garageId}/user/${userId}`, {
				data: { adminComment },
			});
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error('Не удалось отвязать пользователя')
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return { removeUser, isLoading, error };
}
