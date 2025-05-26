import { useCallback } from 'react';
import { UserRoleEnum } from '../constants/user-role';
import { API_HTTP_URL } from '@/constants/config';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { api } from '../lib/api';

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
			const { data } = await api.post<AuthResponse>(`/auth/sign-in`, {
				phoneNumber,
				password,
			});
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
			const { data, status, statusText } = await api.post<AuthResponse>(
				`/auth/sign-up`,
				{
					phoneNumber,
					password,
					firstName,
					lastName,
					middleName,
				}
			);
			console.log('useAuthApi data signUp', data, status, statusText);
			return data;
		},
		[]
	);

	const refreshTokens = useCallback(async (): Promise<RefreshResponse> => {
		const { data } = await api.put<RefreshResponse>(`/auth/refresh`, {
			refreshToken: await SecureStore.getItemAsync('refresh_token'),
		});
		return data;
	}, []);

	const logout = useCallback(async (): Promise<void> => {
		await api.post(`/auth/logout`, {
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
