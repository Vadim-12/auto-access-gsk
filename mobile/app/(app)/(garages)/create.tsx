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
import { useGarages } from '@/contexts/GaragesContext';

export default function CreateGarageScreen() {
	const { colors } = useTheme();
	const { createGarage } = useGarages();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		totalSpaces: '',
		gateIp: '',
		gatePort: '',
		description: '',
		cameraIp: '',
		cameraPort: '',
	});

	const handleSubmit = async () => {
		if (
			!formData.name ||
			!formData.address ||
			!formData.totalSpaces ||
			!formData.gateIp ||
			!formData.gatePort ||
			!formData.cameraIp ||
			!formData.cameraPort
		) {
			Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
			return;
		}

		setIsSubmitting(true);
		try {
			await createGarage({
				...formData,
				totalSpaces: parseInt(formData.totalSpaces),
				gatePort: parseInt(formData.gatePort),
				cameraPort: parseInt(formData.cameraPort),
			});
			router.back();
		} catch (err) {
			console.error('Error creating garage:', err);
			Alert.alert('Ошибка', 'Не удалось создать гараж');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
			contentContainerStyle={styles.contentContainer}
		>
			<View style={styles.form}>
				<Text style={[styles.label, { color: colors.text }]}>
					Номер гаража *
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
					value={formData.name}
					onChangeText={(text) => setFormData({ ...formData, name: text })}
					placeholder='Введите номер гаража'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Адрес *</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.address}
					onChangeText={(text) => setFormData({ ...formData, address: text })}
					placeholder='Введите адрес гаража'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					Количество мест *
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
					value={formData.totalSpaces}
					onChangeText={(text) =>
						setFormData({ ...formData, totalSpaces: text })
					}
					placeholder='Введите количество мест'
					placeholderTextColor={colors.textSecondary}
					keyboardType='numeric'
				/>

				<Text style={[styles.label, { color: colors.text }]}>Описание</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
							height: 100,
							textAlignVertical: 'top',
							paddingTop: 12,
						},
					]}
					value={formData.description}
					onChangeText={(text) =>
						setFormData({ ...formData, description: text })
					}
					placeholder='Введите описание гаража (необязательно)'
					placeholderTextColor={colors.textSecondary}
					multiline
					numberOfLines={4}
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					IP шлагбаума *
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
					value={formData.gateIp}
					onChangeText={(text) => setFormData({ ...formData, gateIp: text })}
					placeholder='Введите IP адрес шлагбаума'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					Порт шлагбаума *
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
					value={formData.gatePort}
					onChangeText={(text) => setFormData({ ...formData, gatePort: text })}
					placeholder='Введите порт шлагбаума'
					placeholderTextColor={colors.textSecondary}
					keyboardType='numeric'
				/>

				<Text style={[styles.label, { color: colors.text }]}>IP камеры *</Text>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: colors.cardBackground,
							color: colors.text,
							borderColor: colors.border,
						},
					]}
					value={formData.cameraIp}
					onChangeText={(text) => setFormData({ ...formData, cameraIp: text })}
					placeholder='Введите IP адрес камеры'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>
					Порт камеры *
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
					value={formData.cameraPort}
					onChangeText={(text) =>
						setFormData({ ...formData, cameraPort: text })
					}
					placeholder='Введите порт камеры'
					placeholderTextColor={colors.textSecondary}
					keyboardType='numeric'
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
						{isSubmitting ? 'Создание...' : 'Создать гараж'}
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
		padding: 20,
	},
	form: {
		gap: 12,
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
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
