import {
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	LayoutChangeEvent,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	View,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo, useState, useRef } from 'react';
import { SIGN_UP_ERROR } from '@/constants/errors';
import { useAuth } from '@/contexts/AuthContext';
import { authStyles } from '@/styles/auth';
import { AxiosError } from 'axios';

export default function SignUpScreen() {
	const { colors } = useTheme();
	const { signUp } = useAuth();
	const scrollViewRef = useRef<ScrollView>(null);
	const inputRefs = useRef<{ [key: string]: number }>({});

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
			const result = await signUp(
				phoneNumber,
				password,
				firstName,
				lastName,
				middleName
			);
			console.log('result', result);
			router.replace('/(app)/(garages)');
		} catch (error) {
			const errorMessage = (error as AxiosError)?.response?.data as {
				message: string;
			};
			console.log('errorMessage', errorMessage.message);
			setErrorMessage(errorMessage.message);
			console.log('Ошибка при регистрации:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = () => {
		router.back();
	};

	const handleInputLayout =
		(fieldName: string) => (event: LayoutChangeEvent) => {
			const { y } = event.nativeEvent.layout;
			inputRefs.current[fieldName] = y;
		};

	const scrollToInput = (fieldName: string) => {
		const y = inputRefs.current[fieldName];
		if (y !== undefined) {
			scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
		>
			<ScrollView
				ref={scrollViewRef}
				style={[authStyles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={styles.contentContainer}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={false}
				onScrollBeginDrag={Keyboard.dismiss}
			>
				<Text style={[authStyles.title, { color: colors.text }]}>
					Регистрация
				</Text>

				{errorMessage && (
					<Text
						style={{
							color: colors.error,
							marginBottom: 10,
							textAlign: 'center',
						}}
					>
						{errorMessage}
					</Text>
				)}

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('lastName')}
						onLayout={handleInputLayout('lastName')}
					/>
				</View>

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('firstName')}
						onLayout={handleInputLayout('firstName')}
					/>
				</View>

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('middleName')}
						onLayout={handleInputLayout('middleName')}
					/>
				</View>

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('phoneNumber')}
						onLayout={handleInputLayout('phoneNumber')}
					/>
				</View>

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('password')}
						onLayout={handleInputLayout('password')}
					/>
				</View>

				<View style={{ width: '100%' }}>
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
						onFocus={() => scrollToInput('confirmPassword')}
						onLayout={handleInputLayout('confirmPassword')}
					/>
				</View>

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
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
		marginTop: 5,
	},
	contentContainer: {
		padding: 20,
		paddingBottom: 150,
	},
});
