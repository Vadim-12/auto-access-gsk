import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { CarsProvider } from '@/contexts/CarsContext';

export default function CarsLayout() {
	const { colors } = useTheme();

	return (
		<CarsProvider>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerShadowVisible: false,
					headerTintColor: colors.text,
					headerTitleStyle: {
						fontSize: 20,
						fontWeight: '600',
					},
					headerTitleAlign: 'center',
					contentStyle: {
						backgroundColor: colors.background,
						paddingHorizontal: 16,
					},
				}}
			>
				<Stack.Screen
					name='index'
					options={{
						title: 'Мои автомобили',
					}}
				/>
				<Stack.Screen
					name='create'
					options={{
						title: 'Новый автомобиль',
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name='[carId]'
					options={{
						title: 'Информация об автомобиле',
					}}
				/>
			</Stack>
		</CarsProvider>
	);
}
