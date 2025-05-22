import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';

interface Car {
	carId: string;
	brand: string;
	model: string;
	licensePlate: string;
	color: string;
	year: number;
}

interface CarsContextType {
	cars: Car[];
	isLoading: boolean;
	error: Error | null;
	fetchCars: () => Promise<void>;
}

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export function CarsProvider({ children }: { children: React.ReactNode }) {
	const [cars, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchCars = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await api.get<Car[]>('/cars');
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
	}, []);

	return (
		<CarsContext.Provider value={{ cars, isLoading, error, fetchCars }}>
			{children}
		</CarsContext.Provider>
	);
}

export function useCars() {
	const context = useContext(CarsContext);
	if (context === undefined) {
		throw new Error('useCars must be used within a CarsProvider');
	}
	return context;
}
