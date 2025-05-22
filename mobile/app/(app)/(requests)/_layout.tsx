import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { GaragesProvider } from '@/contexts/GaragesContext';
import { RequestsProvider } from '@/contexts/RequestsContext';

export default function RequestsLayout() {
	const { colors } = useTheme();

	return (
		<RequestsProvider>
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
						gestureEnabled: false,
					}}
				>
					<Stack.Screen
						name='index'
						options={{
							title: 'Заявки',
							gestureEnabled: false,
						}}
					/>
					<Stack.Screen
						name='request'
						options={{
							title: 'Рассмотрение заявки',
							presentation: 'modal',
						}}
					/>
				</Stack>
			</GaragesProvider>
		</RequestsProvider>
	);
}
