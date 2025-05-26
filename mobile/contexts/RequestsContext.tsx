import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';

interface GarageRequest {
	requestId: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	description?: string;
	createdAt: string;
	user: {
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	garage: {
		number: string;
		description?: string;
	};
}

interface RequestsContextType {
	requests: GarageRequest[];
	isLoading: boolean;
	error: Error | null;
	fetchRequests: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(
	undefined
);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
	const [requests, setRequests] = useState<GarageRequest[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchRequests = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await api.get<GarageRequest[]>(
				'/garage-requests/admin/me'
			);
			setRequests(response.data);
			setError(null);
		} catch (err) {
			console.log('Error fetching requests:', err);
			setError(
				err instanceof Error ? err : new Error('Не удалось загрузить запросы')
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return (
		<RequestsContext.Provider
			value={{
				requests,
				isLoading,
				error,
				fetchRequests,
			}}
		>
			{children}
		</RequestsContext.Provider>
	);
}

export function useRequests() {
	const context = useContext(RequestsContext);
	if (context === undefined) {
		throw new Error('useRequests must be used within a RequestsProvider');
	}
	return context;
}
