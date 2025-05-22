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

export function useCar(carId: string) {
	const [car, setCar] = useState<Car | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchCar = async () => {
			try {
				const response = await api.get<Car>(`/cars/${carId}`);
				setCar(response.data);
				setError(null);
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error('Не удалось загрузить информацию об автомобиле')
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (carId) {
			fetchCar();
		}
	}, [carId]);

	return { car, isLoading, error };
}
