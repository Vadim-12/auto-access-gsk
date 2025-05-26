import { useState } from 'react';
import { api } from '../../lib/api';
import { useCars } from '../../contexts/CarsContext';

interface CreateCarDto {
	brand: string;
	model: string;
	licensePlate: string;
	color: string;
	year: number;
	vin: string;
}

interface Car {
	carId: string;
	brand: string;
	model: string;
	licensePlate: string;
	color: string;
	year: number;
	vin: string;
}

export function useCreateCar() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { fetchCars } = useCars();

	const createCar = async (data: CreateCarDto) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await api.post<Car>('/cars', data);
			await fetchCars();
			return response.data;
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error('Не удалось добавить автомобиль');
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return { createCar, isLoading, error };
}
