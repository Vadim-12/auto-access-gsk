import { useState } from 'react';
import { api } from '../../lib/api';

export function useDeleteCar() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const deleteCar = async (carId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			await api.delete(`/cars/${carId}`);
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error('Не удалось удалить автомобиль');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { deleteCar, isLoading, error };
}
