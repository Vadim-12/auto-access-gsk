import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name='sign-in'
				options={{
					title: 'Авторизация',
				}}
			/>
			<Stack.Screen
				name='sign-up'
				options={{
					title: 'Регистрация',
				}}
			/>
			<Stack.Screen
				name='first-admin'
				options={{
					title: 'Создание первого администратора',
				}}
			/>
		</Stack>
	);
}
