import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import axios from 'axios';
import { API_HTTP_URL } from '@/constants/config';

export default function FirstAdminScreen() {
	const { colors } = useTheme();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		phoneNumber: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		middleName: '',
	});

	const handleSubmit = async () => {
		if (
			!formData.phoneNumber ||
			!formData.password ||
			!formData.firstName ||
			!formData.lastName
		) {
			Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			Alert.alert('Ошибка', 'Пароли не совпадают');
			return;
		}

		setIsSubmitting(true);
		try {
			await axios.post(`${API_HTTP_URL}/users/first-admin`, formData);
			Alert.alert('Успех', 'Первый администратор успешно создан', [
				{
					text: 'OK',
					onPress: () => router.replace('/(auth)/sign-in'),
				},
			]);
		} catch (err) {
			console.error('Error creating first admin:', err);
			Alert.alert(
				'Ошибка',
				'Не удалось создать первого администратора. Возможно, администратор уже существует.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
			contentContainerStyle={styles.contentContainer}
		>
			<View style={styles.header}>
				<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
					Заполните форму для создания первого администратора системы
				</Text>
			</View>

			<View>
				<Text style={[styles.label, { color: colors.text }]}>Фамилия *</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.lastName}
					onChangeText={(text) => setFormData({ ...formData, lastName: text })}
					placeholder='Введите фамилию'
					autoCapitalize='sentences'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Имя *</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.firstName}
					onChangeText={(text) => setFormData({ ...formData, firstName: text })}
					placeholder='Введите имя'
					placeholderTextColor={colors.textSecondary}
					autoCapitalize='sentences'
				/>

				<Text style={[styles.label, { color: colors.text }]}>Отчество</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.middleName}
					onChangeText={(text) =>
						setFormData({ ...formData, middleName: text })
					}
					placeholder='Введите отчество (необязательно)'
					placeholderTextColor={colors.textSecondary}
					autoCapitalize='sentences'
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					Номер телефона *
				</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.phoneNumber}
					onChangeText={(text) =>
						setFormData({ ...formData, phoneNumber: text })
					}
					placeholder='89999999999'
					placeholderTextColor={colors.textSecondary}
					keyboardType='phone-pad'
				/>

				<Text style={[styles.label, { color: colors.text }]}>Пароль *</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.password}
					onChangeText={(text) => setFormData({ ...formData, password: text })}
					placeholder='Введите пароль'
					placeholderTextColor={colors.textSecondary}
					secureTextEntry
					textContentType='none'
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					Повтор пароля *
				</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.confirmPassword}
					onChangeText={(text) =>
						setFormData({ ...formData, confirmPassword: text })
					}
					placeholder='Повтор пароль'
					placeholderTextColor={colors.textSecondary}
					secureTextEntry
					textContentType='none'
				/>

				<TouchableOpacity
					style={[
						styles.submitButton,
						{ backgroundColor: colors.primary },
						isSubmitting && styles.buttonDisabled,
					]}
					onPress={handleSubmit}
					disabled={isSubmitting}
				>
					<Text style={styles.submitButtonText}>
						{isSubmitting ? 'Создание...' : 'Создать администратора'}
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		paddingTop: 60,
	},
	header: {
		marginBottom: 24,
	},
	subtitle: {
		fontSize: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
		marginBottom: 16,
	},
	submitButton: {
		height: 48,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
