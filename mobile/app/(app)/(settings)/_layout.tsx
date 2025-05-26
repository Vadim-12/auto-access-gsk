import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsLayout() {
	const { colors } = useTheme();

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerShadowVisible: false,
				headerTitleStyle: {
					fontSize: 20,
					fontWeight: '600',
				},
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen
				name='index'
				options={{
					title: 'Настройки',
				}}
			/>
		</Stack>
	);
}
