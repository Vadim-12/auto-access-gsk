import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function GarageLayout() {
	const { colors } = useTheme();

	return (
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
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='edit'
				options={{
					title: 'Редактирование настроек',
					headerShown: true,
					animation: 'slide_from_right',
				}}
			/>
		</Stack>
	);
}
