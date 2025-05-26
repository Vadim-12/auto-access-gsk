import { useState } from 'react';
import { api } from '@/lib/api';
import { GarageGateStatusEnum } from '@/constants/statuses';

export function useToggleGate() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const toggleGate = async (garageId: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.patch(`/garages/${garageId}/gate/toggle`);
			return response.data;
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось изменить состояние ворот');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { toggleGate, isLoading, error };
}
