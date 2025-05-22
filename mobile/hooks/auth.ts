import { useCallback } from 'react';
import axios from 'axios';
import { UserRoleEnum } from '../constants/user-role';
import { API_HTTP_URL } from '@/constants/config';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
	userId: string;
	phoneNumber: string;
	role: UserRoleEnum;
	firstName: string;
	lastName: string;
	middleName?: string;
}

interface AuthResponse {
	tokens: {
		access: string;
		refresh: string;
	};
	user: User;
}

interface RefreshResponse {
	access: string;
	refresh: string;
}

export const useAuthApi = () => {
	const signIn = useCallback(
		async (phoneNumber: string, password: string): Promise<AuthResponse> => {
			const { data } = await axios.post<AuthResponse>(
				`${API_HTTP_URL}/auth/sign-in`,
				{
					phoneNumber,
					password,
				}
			);
			return data;
		},
		[]
	);

	const signUp = useCallback(
		async (
			phoneNumber: string,
			password: string,
			firstName: string,
			lastName: string,
			middleName?: string
		): Promise<AuthResponse> => {
			const { data } = await axios.post<AuthResponse>(
				`${API_HTTP_URL}/auth/sign-up`,
				{
					phoneNumber,
					password,
					firstName,
					lastName,
					middleName,
				}
			);
			return data;
		},
		[]
	);

	const refreshTokens = useCallback(async (): Promise<RefreshResponse> => {
		const { data } = await axios.put<RefreshResponse>(
			`${API_HTTP_URL}/auth/refresh`,
			{
				refreshToken: await SecureStore.getItemAsync('refresh_token'),
			}
		);
		return data;
	}, []);

	const logout = useCallback(async (): Promise<void> => {
		await axios.post(`${API_HTTP_URL}/auth/logout`, {
			refreshToken: await SecureStore.getItemAsync('refresh_token'),
		});
	}, []);

	return {
		signIn,
		signUp,
		refreshTokens,
		logout,
	};
};
