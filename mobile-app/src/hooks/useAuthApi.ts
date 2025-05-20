import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const useAuthApi = () => {
	const signIn = async (phoneNumber: string, password: string) => {
		const response = await fetch(`${API_CONFIG.baseURL}/auth/sign-in`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phoneNumber, password }),
		});
		console.log('sign-in response', response);

		if (!response.ok) {
			throw response;
		}

		return response.json();
	};

	const signUp = async (
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		middleName?: string
	) => {
		const response = await fetch(`${API_CONFIG.baseURL}/auth/sign-up`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phoneNumber,
				password,
				firstName,
				lastName,
				middleName,
			}),
		});
		console.log('sign-up response', response);

		if (!response.ok) {
			throw response;
		}

		return response.json();
	};

	const refreshTokens = async () => {
		const refreshToken = await SecureStore.getItemAsync('refresh_token');
		if (!refreshToken) throw new Error('No refresh token');

		const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken }),
		});
		console.log('refresh-tokens response', response);
		if (!response.ok) {
			throw response;
		}

		return response.json();
	};

	const logout = async () => {
		const token = await AsyncStorage.getItem('access_token');
		if (!token) return;

		await fetch(`${API_CONFIG.baseURL}/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};

	return {
		signIn,
		signUp,
		refreshTokens,
		logout,
	};
};
