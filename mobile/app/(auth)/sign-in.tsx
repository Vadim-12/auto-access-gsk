import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo, useState } from 'react';
import { SIGN_IN_ERROR } from '@/constants/errors';
import { authStyles } from '@/styles/auth';
import { useHasAdmin } from '@/hooks/useHasAdmin';

export default function SignInScreen() {
	const { signIn } = useAuth();
	const { colors } = useTheme();
	const { hasAdmin, isLoading: isCheckingAdmin } = useHasAdmin();

	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [apiError, setApiError] = useState('');

	const isDisabled = useMemo(
		() => phoneNumber.length !== 11 || password.length < 6,
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
			setApiError('');
			setErrorMessage('');
			router.replace('/(app)/(garages)');
		} catch (error) {
			setApiError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = () => {
		router.push('/(auth)/sign-up');
	};

	return (
		<View
			style={[authStyles.container, { backgroundColor: colors.background }]}
		>
			<Text style={[authStyles.title, { color: colors.text }]}>
				Авторизация
			</Text>

			{apiError && (
				<Text
					style={{ color: colors.error, marginBottom: 20, textAlign: 'center' }}
				>
					{apiError}
				</Text>
			)}

			<Text style={[styles.label, { color: colors.text }]}>
				Номер телефона *
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
				placeholder='89999999999'
				keyboardType='phone-pad'
				autoCapitalize='none'
				value={phoneNumber}
				onChangeText={(newValue) => setPhoneNumber(newValue)}
			/>

			<Text style={[styles.label, { color: colors.text }]}>Пароль *</Text>
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
				placeholder='Введите пароль'
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
				{isLoading ? (
					<ActivityIndicator color='white' />
				) : (
					<Text style={authStyles.buttonText}>Войти</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity onPress={handleSignUp} style={authStyles.link}>
				<Text style={[authStyles.linkText, { color: colors.primary }]}>
					Нет аккаунта? Зарегистрироваться
				</Text>
			</TouchableOpacity>

			{!isCheckingAdmin && !hasAdmin && (
				<TouchableOpacity
					style={styles.createAdminButton}
					onPress={() => router.push('/(auth)/first-admin')}
				>
					<Text style={[styles.createAdminText, { color: colors.primary }]}>
						Создать первого администратора
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	createAdminButton: {
		marginTop: 16,
		padding: 12,
		alignItems: 'center',
	},
	createAdminText: {
		fontSize: 16,
		fontWeight: '500',
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
		marginTop: 16,
	},
});
