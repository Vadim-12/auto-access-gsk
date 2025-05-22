import { useState } from 'react';
import { api } from '../../lib/api';

export function useDeleteGarage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const deleteGarage = async (garageId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			await api.delete(`/garages/${garageId}`);
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error('Не удалось удалить гараж');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { deleteGarage, isLoading, error };
}
