import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { UserRoleEnum } from '../constants/user-role';
import { useAuthApi } from '../hooks/auth';

interface User {
	userId: string;
	phoneNumber: string;
	role: UserRoleEnum;
	firstName: string;
	lastName: string;
	middleName?: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	signIn: (phoneNumber: string, password: string) => Promise<void>;
	signUp: (
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		middleName?: string
	) => Promise<void>;
	logout: () => Promise<void>;
	refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const {
		signIn: apiSignIn,
		signUp: apiSignUp,
		refreshTokens: apiRefreshTokens,
		logout: apiLogout,
	} = useAuthApi();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const accessToken = await AsyncStorage.getItem('access_token');
			const refreshToken = await SecureStore.getItemAsync('refresh_token');

			if (accessToken && refreshToken) {
				try {
					await refreshTokens();
				} catch (error) {
					console.log('Token refresh failed:', error);
					await logout();
				}
			} else {
				await logout();
			}
		} catch (error) {
			console.log('Auth check failed:', error);
			await logout();
		} finally {
			setIsLoading(false);
		}
	};

	const refreshTokens = async () => {
		try {
			const data = await apiRefreshTokens();
			await AsyncStorage.setItem('access_token', data.access);
			await SecureStore.setItemAsync('refresh_token', data.refresh);
		} catch (error) {
			console.log('Token refresh failed:', error);
			await logout();
		}
	};

	const signIn = async (phoneNumber: string, password: string) => {
		const data = await apiSignIn(phoneNumber, password);
		await AsyncStorage.setItem('access_token', data.tokens.access);
		await SecureStore.setItemAsync('refresh_token', data.tokens.refresh);
		setUser(data.user);
	};

	const signUp = async (
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		middleName?: string
	) => {
		const data = await apiSignUp(
			phoneNumber,
			password,
			firstName,
			lastName,
			middleName
		);
		await AsyncStorage.setItem('access_token', data.tokens.access);
		await SecureStore.setItemAsync('refresh_token', data.tokens.refresh);
		setUser(data.user);
	};

	const logout = async () => {
		try {
			await apiLogout();
		} catch (error) {
			console.log('Logout failed:', error);
		} finally {
			await AsyncStorage.removeItem('access_token');
			await SecureStore.deleteItemAsync('refresh_token');
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				signIn,
				signUp,
				logout,
				refreshTokens,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
