import { useState } from 'react';
import { api } from '../../lib/api';

interface UpdateSettingsDto {
	ip: string;
	port: number;
}

export function useUpdateGarageSettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateCameraSettings = async (
		garageId: string,
		settings: UpdateSettingsDto
	) => {
		console.log('Frontend: updateCameraSettings called with:', {
			garageId,
			settings,
		});

		setIsLoading(true);
		setError(null);

		try {
			console.log(
				'Frontend: Sending request to:',
				`/garages/${garageId}/camera`
			);
			const response = await api.patch(`/garages/${garageId}/camera`, settings);
			console.log('Frontend: Response received:', response.data);
			return response.data;
		} catch (err) {
			console.error('Frontend: Error updating camera settings:', err);
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось обновить настройки камеры');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const updateGateSettings = async (
		garageId: string,
		settings: UpdateSettingsDto
	) => {
		console.log('Frontend: updateGateSettings called with:', {
			garageId,
			settings,
		});

		setIsLoading(true);
		setError(null);

		try {
			console.log('Frontend: Sending request to:', `/garages/${garageId}/gate`);
			const response = await api.patch(`/garages/${garageId}/gate`, settings);
			console.log('Frontend: Response received:', response.data);
			return response.data;
		} catch (err) {
			console.error('Frontend: Error updating gate settings:', err);
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось обновить настройки шлагбаума');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		updateCameraSettings,
		updateGateSettings,
		isLoading,
		error,
	};
}
