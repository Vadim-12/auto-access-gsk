import axios, { AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_HTTP_URL } from '@/constants/config';

console.log('API URL:', API_HTTP_URL);

export const api = axios.create({
	baseURL: API_HTTP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Добавляем перехватчик для добавления токена авторизации
api.interceptors.request.use(async (config) => {
	console.log('API Request:', {
		url: config.url,
		method: config.method,
		headers: config.headers,
		data: config.data,
	});

	const accessToken = await AsyncStorage.getItem('access_token');
	console.log(
		'Access Token:',
		accessToken ? `${accessToken.substring(0, 10)}...` : 'not found'
	);

	if (accessToken && config.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`;
		console.log('Added Authorization header:', config.headers.Authorization);
	} else {
		console.log('No Authorization header added - missing token');
	}
	return config;
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
	(response: AxiosResponse) => {
		console.log('API Response:', {
			status: response.status,
			headers: response.headers,
			data: response.data,
		});
		return response;
	},
	async (error: AxiosError) => {
		console.warn('API Error:', {
			status: error.response?.status,
			headers: error.response?.headers,
			data: error.response?.data,
			message: error.message,
			config: {
				url: error.config?.url,
				method: error.config?.method,
				headers: error.config?.headers,
			},
		});

		if (error.response?.status === 401) {
			console.log('Unauthorized error - redirecting to sign in');
			// Если токен истек или недействителен, перенаправляем на страницу входа
			await AsyncStorage.removeItem('access_token');
			router.replace('/(auth)/sign-in');
		}
		return Promise.reject(error);
	}
);
