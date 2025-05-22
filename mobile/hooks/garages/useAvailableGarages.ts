import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface AvailableGarage {
	garageId: string;
	number: string;
	description?: string;
	gateIp: string;
	gatePort: number;
	cameraIp?: string;
	cameraPort?: number;
	createdAt: string;
	admin?: {
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	isAvailable: boolean;
	occupant?: {
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	requestStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function useAvailableGarages() {
	const [garages, setGarages] = useState<AvailableGarage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchGarages = async () => {
			try {
				const response = await api.get<AvailableGarage[]>('/garages/available');
				setGarages(response.data);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error('Не удалось загрузить гаражи')
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGarages();
	}, []);

	return { garages, isLoading, error, setGarages };
}
