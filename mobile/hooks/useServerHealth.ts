import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_HTTP_URL } from '@/constants/config';

export const useServerHealth = () => {
	const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [lastCheck, setLastCheck] = useState<Date | null>(null);

	const checkHealth = async () => {
		try {
			const response = await axios.get(`${API_HTTP_URL}/health`);
			setIsHealthy(response.data.status === 'ok');
			setError(null);
			setLastCheck(new Date());
		} catch (err) {
			setIsHealthy(false);
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
			setLastCheck(new Date());
		}
	};

	useEffect(() => {
		checkHealth();
		const interval = setInterval(checkHealth, 5000); // Проверяем каждые 5 секунд
		return () => clearInterval(interval);
	}, []);

	return { isHealthy, error, lastCheck, checkHealth };
};
