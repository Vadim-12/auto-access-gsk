import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';

export interface Garage {
	garageId: string;
	number: string;
	description?: string;
	gateIp: string;
	gatePort: number;
	camera?: {
		cameraId: string;
		ip: string;
		port: number;
		status: string;
		name: string;
		description?: string;
	};
	createdAt: Date;
	updatedAt: Date;
	admin?: {
		userId: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		role: string;
	};
	users?: {
		userId: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		role: string;
	}[];
}

interface GarageAccessRequest {
	requestId: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	description?: string;
	createdAt: string;
	updatedAt: string;
	user: {
		userId: string;
		firstName: string;
		lastName: string;
		middleName?: string;
		phoneNumber: string;
		role: string;
	};
	garage: {
		garageId: string;
		number: string;
		description?: string;
		gateIp: string;
		gatePort: number;
		createdAt: string;
		updatedAt: string;
		admin: {
			userId: string;
			firstName: string;
			lastName: string;
			middleName?: string;
			phoneNumber: string;
			role: string;
		};
	};
}

interface GaragesContextType {
	garages: Garage[];
	accessRequests: GarageAccessRequest[];
	isLoading: boolean;
	error: Error | null;
	fetchGarages: () => Promise<void>;
	fetchAccessRequests: () => Promise<void>;
	createAccessRequest: (garageId: string) => Promise<void>;
	createGarage: (garage: {
		name: string;
		address: string;
		totalSpaces: number;
		gateIp: string;
		gatePort: number;
		description?: string;
		cameraIp: string;
		cameraPort: number;
	}) => Promise<void>;
}

const GaragesContext = createContext<GaragesContextType | undefined>(undefined);

export function GaragesProvider({ children }: { children: React.ReactNode }) {
	const [garages, setGarages] = useState<Garage[]>([]);
	const [accessRequests, setAccessRequests] = useState<GarageAccessRequest[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchGarages = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await api.get<Garage[]>('/garages/my');
			setGarages(response.data);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error('Не удалось загрузить список гаражей')
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchAccessRequests = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await api.get<GarageAccessRequest[]>(
				'/garages/access-requests'
			);
			setAccessRequests(response.data);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error('Не удалось загрузить заявки на доступ')
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createAccessRequest = useCallback(
		async (garageId: string) => {
			setIsLoading(true);
			setError(null);
			try {
				await api.post('/garages/access-requests', { garageId });
				await fetchAccessRequests();
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error('Не удалось создать заявку на доступ')
				);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[fetchAccessRequests]
	);

	const createGarage = useCallback(
		async (garage: {
			name: string;
			address: string;
			totalSpaces: number;
			gateIp: string;
			gatePort: number;
			description?: string;
			cameraIp: string;
			cameraPort: number;
		}) => {
			setIsLoading(true);
			setError(null);
			try {
				await api.post('/garages', garage);
				await fetchGarages();
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error('Не удалось создать гараж')
				);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[fetchGarages]
	);

	return (
		<GaragesContext.Provider
			value={{
				garages,
				accessRequests,
				isLoading,
				error,
				fetchGarages,
				fetchAccessRequests,
				createAccessRequest,
				createGarage,
			}}
		>
			{children}
		</GaragesContext.Provider>
	);
}

export function useGarages() {
	const context = useContext(GaragesContext);
	if (context === undefined) {
		throw new Error('useGarages must be used within a GaragesProvider');
	}
	return context;
}
