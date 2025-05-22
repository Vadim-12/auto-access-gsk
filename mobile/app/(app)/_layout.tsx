import { Redirect, Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserRoleEnum } from '@/constants/user-role';

export default function AppLayout() {
	const { user } = useAuth();
	const { colors } = useTheme();

	if (!user) {
		return <Redirect href='/(auth)/sign-in' />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				headerShown: true,
				tabBarStyle: {
					backgroundColor: colors.background,
				},
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerShadowVisible: false,
				headerTitleStyle: {
					fontSize: 20,
					fontWeight: '600' as const,
				},
				headerTitleAlign: 'center' as const,
			}}
		>
			<Tabs.Screen
				name='(cars)'
				options={{
					headerShown: false,
					title: 'Автомобили',
					tabBarIcon: ({ color }: { color: string }) => (
						<FontAwesome name='car' size={24} color={color} />
					),
					href: user.role === UserRoleEnum.USER ? undefined : null,
				}}
			/>
			<Tabs.Screen
				name='(garages)'
				options={{
					headerShown: false,
					title: 'Гаражи',
					tabBarIcon: ({ color }: { color: string }) => (
						<FontAwesome name='building' size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='(requests)'
				options={{
					headerShown: false,
					title: 'Заявки',
					tabBarIcon: ({ color }: { color: string }) => (
						<FontAwesome name='file-text-o' size={24} color={color} />
					),
					href: user.role === UserRoleEnum.ADMIN ? undefined : null,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color }: { color: string }) => (
						<FontAwesome name='user' size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
