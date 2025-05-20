import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo, useState } from 'react';
import { SIGN_IN_ERROR } from '@/constants/errors';
import { authStyles } from '@/styles/auth';

export default function SignIn() {
	const { signIn } = useAuth();
	const { colors } = useTheme();

	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const isDisabled = useMemo(
		() => phoneNumber.length !== 11 || password.length < 8,
		[phoneNumber, password]
	);

	const error = useMemo(() => {
		if (phoneNumber.length !== 11) {
			return SIGN_IN_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH;
		} else if (!password.length) {
			return SIGN_IN_ERROR.EMPTY_PASSWORD;
		} else if (password.length < 6) {
			return SIGN_IN_ERROR.INVALID_CREDENTIALS;
		}
	}, [phoneNumber, password]);

	const handleSubmit = async () => {
		try {
			if (error) {
				setErrorMessage(error);
				return;
			}
			setIsLoading(true);
			await signIn(phoneNumber, password);
			router.push('/(app)');
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
		<View
			style={[authStyles.container, { backgroundColor: colors.background }]}
		>
			<Text style={[authStyles.title, { color: colors.text }]}>
				Вход в аккаунт
			</Text>

			{errorMessage === SIGN_IN_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_IN_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Номер телефона'
				keyboardType='phone-pad'
				autoCapitalize='none'
				value={phoneNumber}
				onChangeText={(newValue) => setPhoneNumber(newValue)}
			/>

			{errorMessage === SIGN_IN_ERROR.EMPTY_PASSWORD && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_IN_ERROR.EMPTY_PASSWORD
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Пароль'
				secureTextEntry
				value={password}
				onChangeText={(newValue) => setPassword(newValue)}
			/>

			<TouchableOpacity
				style={[
					authStyles.button,
					{
						backgroundColor: colors.primary,
						opacity: isDisabled ? 0.5 : 1,
					},
				]}
				onPress={handleSubmit}
				disabled={isDisabled || isLoading}
			>
				<Text style={authStyles.buttonText}>
					{isLoading ? 'Загрузка...' : 'Войти'}
				</Text>
			</TouchableOpacity>

			{errorMessage === SIGN_IN_ERROR.INVALID_CREDENTIALS && (
				<Text style={{ color: colors.error, marginTop: 20 }}>
					{errorMessage}
				</Text>
			)}

			<TouchableOpacity onPress={handleSignUp} style={authStyles.link}>
				<Text style={[authStyles.linkText, { color: colors.primary }]}>
					Нет аккаунта? Зарегистрироваться
				</Text>
			</TouchableOpacity>
		</View>
	);
}
