import { Stack } from 'expo-router';

export default function AuthLayout() {
	console.log('AuthLayout');
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: 'slide_from_right',
			}}
			initialRouteName='sign-in'
		>
			<Stack.Screen
				name='sign-in'
				options={{
					title: 'Вход',
				}}
			/>
			<Stack.Screen
				name='sign-up'
				options={{
					title: 'Регистрация',
				}}
			/>
		</Stack>
	);
}
