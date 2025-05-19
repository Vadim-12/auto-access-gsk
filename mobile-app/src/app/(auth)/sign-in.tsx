import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo, useState } from 'react';
import { API_CONFIG } from '@/config/api';

export default function SignIn() {
	const { signIn } = useAuth();
	const { colors } = useTheme();

	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const isDisabled = useMemo(
		() => phoneNumber.length !== 11 || password.length < 8,
		[phoneNumber, password]
	);

	const handleSubmit = async () => {
		// TODO: Реализовать реальную авторизацию
		try {
			setIsLoading(true);
			console.log('API_CONFIG.baseURL', API_CONFIG.baseURL);
			const response = await fetch(
				`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						phoneNumber,
						password,
					}),
				}
			);
			console.log('response', response);
			if (!response.ok) {
				throw new Error('Не удалось авторизоваться');
			}
			const data = await response.json();
			signIn(data.access_token, data.refresh_token);
		} catch (error) {
			console.error('Ошибка при авторизации:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = () => {
		router.push('/sign-up');
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Text style={[styles.title, { color: colors.text }]}>Вход в аккаунт</Text>

			<TextInput
				style={[
					styles.input,
					{
						borderColor: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholder='Номер телефона'
				placeholderTextColor={colors.text + '80'}
				keyboardType='phone-pad'
				autoCapitalize='none'
				value={phoneNumber}
				onChangeText={(newValue) => setPhoneNumber(newValue)}
			/>

			<TextInput
				style={[
					styles.input,
					{
						borderColor: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholder='Пароль'
				placeholderTextColor={colors.text + '80'}
				secureTextEntry
				value={password}
				onChangeText={(newValue) => setPassword(newValue)}
			/>

			<TouchableOpacity
				style={[
					styles.button,
					{
						backgroundColor: colors.primary,
						opacity: isDisabled ? 0.5 : 1,
					},
				]}
				onPress={handleSubmit}
				disabled={isDisabled || isLoading}
			>
				<Text style={styles.buttonText}>
					{isLoading ? 'Загрузка...' : 'Войти'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={handleSignUp} style={styles.link}>
				<Text style={[styles.linkText, { color: colors.primary }]}>
					Нет аккаунта? Зарегистрироваться
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		padding: 15,
		borderRadius: 8,
		marginBottom: 15,
	},
	button: {
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	link: {
		marginTop: 15,
		alignItems: 'center',
	},
	linkText: {
		textAlign: 'center',
	},
});
