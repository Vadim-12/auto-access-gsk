import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo, useState } from 'react';
import { SIGN_UP_ERROR } from '@/constants/errors';
import { useAuth } from '@/contexts/AuthContext';
import { authStyles } from '@/styles/auth';

export default function SignUpScreen() {
	const { colors } = useTheme();
	const { signUp } = useAuth();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const error = useMemo(() => {
		if (!firstName) {
			return SIGN_UP_ERROR.EMPTY_FIRST_NAME;
		} else if (!lastName) {
			return SIGN_UP_ERROR.EMPTY_LAST_NAME;
		} else if (phoneNumber.length !== 11) {
			return SIGN_UP_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH;
		} else if (password.length < 6) {
			return SIGN_UP_ERROR.PASSWORD_LENGTH_MIN;
		} else if (password !== confirmPassword) {
			return SIGN_UP_ERROR.PASSWORDS_DO_NOT_MATCH;
		}
	}, [firstName, lastName, phoneNumber, password, confirmPassword]);

	const isDisabled = useMemo(
		() =>
			!firstName ||
			!lastName ||
			!phoneNumber ||
			!password ||
			password !== confirmPassword ||
			!!error ||
			isLoading,
		[
			firstName,
			lastName,
			phoneNumber,
			password,
			confirmPassword,
			error,
			isLoading,
		]
	);

	const handleSubmit = async () => {
		try {
			if (error) {
				setErrorMessage(error);
				return;
			}
			setIsLoading(true);
			await signUp(phoneNumber, password, firstName, lastName, middleName);
			router.push('/(app)/(garages)');
		} catch (error) {
			console.log('Ошибка при регистрации:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = () => {
		router.back();
	};

	return (
		<View
			style={[authStyles.container, { backgroundColor: colors.background }]}
		>
			<Text style={[authStyles.title, { color: colors.text }]}>
				Регистрация
			</Text>

			<Text style={[styles.label, { color: colors.text }]}>Фамилия *</Text>
			{errorMessage === SIGN_UP_ERROR.EMPTY_LAST_NAME && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.EMPTY_LAST_NAME
								? colors.error
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Введите фамилию'
				value={lastName}
				onChangeText={(newValue) => setLastName(newValue)}
				autoCapitalize='sentences'
			/>

			<Text style={[styles.label, { color: colors.text }]}>Имя *</Text>
			{errorMessage === SIGN_UP_ERROR.EMPTY_FIRST_NAME && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.EMPTY_FIRST_NAME
								? colors.error
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Введите имя'
				value={firstName}
				onChangeText={(newValue) => setFirstName(newValue)}
				autoCapitalize='sentences'
			/>

			<Text style={[styles.label, { color: colors.text }]}>Отчество</Text>
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Введите отчество (необязательно)'
				value={middleName}
				onChangeText={(newValue) => setMiddleName(newValue)}
				autoCapitalize='sentences'
			/>

			<Text style={[styles.label, { color: colors.text }]}>
				Номер телефона *
			</Text>
			{errorMessage === SIGN_UP_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH
								? colors.error
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='89999999999'
				keyboardType='phone-pad'
				value={phoneNumber}
				onChangeText={(newValue) => setPhoneNumber(newValue)}
			/>

			<Text style={[styles.label, { color: colors.text }]}>Пароль *</Text>
			{errorMessage === SIGN_UP_ERROR.PASSWORD_LENGTH_MIN && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.PASSWORD_LENGTH_MIN
								? colors.error
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Введите пароль'
				secureTextEntry
				autoComplete='off'
				textContentType='oneTimeCode'
				importantForAutofill='no'
				value={password}
				onChangeText={(newValue) => setPassword(newValue)}
			/>

			<Text style={[styles.label, { color: colors.text }]}>
				Повтор пароля *
			</Text>
			{errorMessage === SIGN_UP_ERROR.PASSWORDS_DO_NOT_MATCH && (
				<Text style={{ color: colors.error }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					authStyles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.PASSWORDS_DO_NOT_MATCH
								? colors.error
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Повтор пароль'
				secureTextEntry
				autoComplete='off'
				textContentType='oneTimeCode'
				importantForAutofill='no'
				value={confirmPassword}
				onChangeText={(newValue) => setConfirmPassword(newValue)}
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
					<Text style={authStyles.buttonText}>Зарегистрироваться</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity onPress={handleSignIn} style={authStyles.link}>
				<Text style={[authStyles.linkText, { color: colors.primary }]}>
					Уже есть аккаунт? Войти
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
		marginTop: 5,
	},
});
