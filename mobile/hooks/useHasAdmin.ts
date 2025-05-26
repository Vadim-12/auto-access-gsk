import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_HTTP_URL } from '@/constants/config';

export const useHasAdmin = () => {
	const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = await axios.get(`${API_HTTP_URL}/users/has-admin`);
				setHasAdmin(response.data.hasAdmin);
			} catch (err) {
				console.log('Error checking admin:', err);
				setError('Не удалось проверить наличие администратора');
			} finally {
				setIsLoading(false);
			}
		};

		checkAdmin();
	}, []);

	return { hasAdmin, isLoading, error };
};
