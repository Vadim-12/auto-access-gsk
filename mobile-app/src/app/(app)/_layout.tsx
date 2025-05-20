import { Tabs } from 'expo-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FontAwesome } from '@expo/vector-icons';

export default function AppLayout() {
	console.log('AppLayout');
	return (
		<ProtectedRoute>
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
					name='my-cars'
					options={{
						title: 'Мои авто',
						tabBarIcon: ({ color }) => (
							<FontAwesome name='car' size={24} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='my-garages'
					options={{
						title: 'Мои гаражи',
						tabBarIcon: ({ color }) => (
							<FontAwesome name='building' size={24} color={color} />
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
		</ProtectedRoute>
	);
}
