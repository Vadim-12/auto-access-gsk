import { useState } from 'react';
import { api } from '@/lib/api';
import { UpdateSettingsDto } from '@/types/garage';

export function useUpdateGarageSettings() {
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateCameraSettings = async (
		garageId: string,
		settings: UpdateSettingsDto
	) => {
		console.log('Frontend: updateCameraSettings called with:', {
			garageId,
			settings,
		});

		setIsUpdating(true);
		setError(null);

		try {
			console.log(
				'Frontend: Sending request to:',
				`/garages/${garageId}/camera`
			);
			console.log('Frontend: Request headers:', api.defaults.headers);
			console.log('Frontend: Request body:', settings);

			const response = await api.patch(`/garages/${garageId}/camera`, settings);
			console.log('Frontend: Response received:', response.data);
			return response.data;
		} catch (err) {
			console.warn('Frontend: Error updating camera settings:', err);
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось обновить настройки камеры');
			setError(error);
			throw error;
		} finally {
			setIsUpdating(false);
		}
	};

	const updateGateSettings = async (
		garageId: string,
		settings: { ip: string; port: number }
	) => {
		console.log('Frontend: updateGateSettings called with:', {
			garageId,
			settings,
		});

		setIsUpdating(true);
		setError(null);

		try {
			console.log('Frontend: Sending request to:', `/garages/${garageId}/gate`);
			console.log('Frontend: Request headers:', api.defaults.headers);
			console.log('Frontend: Request body:', settings);

			const response = await api.patch(`/garages/${garageId}/gate`, settings);
			console.log('Frontend: Response received:', response.data);
			return response.data;
		} catch (err) {
			console.warn('Frontend: Error updating gate settings:', err);
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось обновить настройки ворот');
			setError(error);
			throw error;
		} finally {
			setIsUpdating(false);
		}
	};

	return {
		updateCameraSettings,
		updateGateSettings,
		isUpdating,
		error,
	};
}
