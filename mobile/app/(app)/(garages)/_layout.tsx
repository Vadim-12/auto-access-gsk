import { Stack } from 'expo-router';
import { GaragesProvider } from '@/contexts/GaragesContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function GaragesLayout() {
	const { colors } = useTheme();

	return (
		<GaragesProvider>
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
					contentStyle: {
						backgroundColor: colors.background,
					},
				}}
			>
				<Stack.Screen
					name='index'
					options={{
						title: 'Мои гаражи',
					}}
				/>
				<Stack.Screen
					name='request'
					options={{
						title: 'Подать заявку',
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name='create'
					options={{
						title: 'Создать гараж',
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name='[garageId]'
					options={{
						title: 'Информация о гараже',
						presentation: 'modal',
					}}
				/>
			</Stack>
		</GaragesProvider>
	);
}
