import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import { API_CONFIG } from '@/config/api';
import { SIGN_UP_ERROR } from '@/config/errors';

export default function SignUp() {
	const { colors } = useTheme();

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

	useEffect(() => {
		console.log(API_CONFIG);
	}, []);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			if (error) return;
			console.log('API_CONFIG.baseURL', API_CONFIG.baseURL);
			// const response = await fetch(
			// 	API_CONFIG.baseURL + API_CONFIG.endpoints.auth.register,
			// 	{
			// 		method: 'POST',
			// 		body: JSON.stringify({
			// 			phoneNumber: phoneNumber,
			// 			password: password,
			// 			firstName: firstName,
			// 			lastName: lastName,
			// 			middleName: middleName,
			// 		}),
			// 	}
			// );
			// console.log('response', response);
			// if (!response.ok) {
			// 	throw new Error('Не удалось зарегистрироваться');
			// }
			// router.push('/(app)');
		} catch (error) {
			console.error('Ошибка при регистрации:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = () => {
		router.back();
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Text style={[styles.title, { color: colors.text }]}>Регистрация</Text>

			{errorMessage === SIGN_UP_ERROR.EMPTY_LAST_NAME && (
				<Text style={{ color: 'red' }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					styles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.EMPTY_LAST_NAME
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Фамилия *'
				value={lastName}
				onChangeText={(newValue) => setLastName(newValue)}
			/>

			{errorMessage === SIGN_UP_ERROR.EMPTY_FIRST_NAME && (
				<Text style={{ color: 'red' }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					styles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.EMPTY_FIRST_NAME
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Имя *'
				value={firstName}
				onChangeText={(newValue) => setFirstName(newValue)}
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
				placeholderTextColor={colors.text + '70'}
				placeholder='Отчество'
				value={middleName}
				onChangeText={(newValue) => setMiddleName(newValue)}
			/>

			{errorMessage === SIGN_UP_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH && (
				<Text style={{ color: 'red' }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					styles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.NOT_VALID_PHONE_NUMBER_LENGTH
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Номер телефона *'
				keyboardType='phone-pad'
				value={phoneNumber}
				onChangeText={(newValue) => setPhoneNumber(newValue)}
			/>

			{errorMessage === SIGN_UP_ERROR.PASSWORD_LENGTH_MIN && (
				<Text style={{ color: 'red' }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					styles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.PASSWORD_LENGTH_MIN
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Пароль *'
				secureTextEntry
				autoComplete='off'
				textContentType='oneTimeCode'
				importantForAutofill='no'
				value={password}
				onChangeText={(newValue) => setPassword(newValue)}
			/>

			{errorMessage === SIGN_UP_ERROR.PASSWORDS_DO_NOT_MATCH && (
				<Text style={{ color: 'red' }}>{errorMessage}</Text>
			)}
			<TextInput
				style={[
					styles.input,
					{
						borderColor:
							errorMessage === SIGN_UP_ERROR.PASSWORDS_DO_NOT_MATCH
								? 'red'
								: colors.border,
						backgroundColor: colors.inputBackground,
						color: colors.text,
					},
				]}
				placeholderTextColor={colors.text + '70'}
				placeholder='Повтор пароля *'
				secureTextEntry
				autoComplete='off'
				textContentType='oneTimeCode'
				importantForAutofill='no'
				value={confirmPassword}
				onChangeText={(newValue) => setConfirmPassword(newValue)}
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
				disabled={isDisabled}
			>
				<Text style={styles.buttonText}>
					{isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={handleSignIn} style={styles.link}>
				<Text style={[styles.linkText, { color: colors.primary }]}>
					Уже есть аккаунт? Войти
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
