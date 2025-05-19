import { Redirect, Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Redirect href='/(auth)' />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#007AFF',
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Главная',
					tabBarIcon: ({ color }) => (
						<FontAwesome name='home' size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
					tabBarIcon: ({ color }) => (
						<FontAwesome name='user' size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
