import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface Car {
	carId: string;
	brand: string;
	model: string;
	licensePlate: string;
	color: string;
	year: number;
}

export function useCars() {
	const [cars, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchCars = async () => {
		try {
			const response = await api.get<Car[]>('/cars');
			console.log('response', response.data);
			setCars(response.data);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error('Не удалось загрузить список автомобилей')
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCars();
	}, []);

	return { cars, isLoading, error, fetchCars };
}
