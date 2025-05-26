import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	LayoutChangeEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useGarages } from '@/contexts/GaragesContext';

export default function CreateGarageScreen() {
	const { colors } = useTheme();
	const { createGarage } = useGarages();
	const scrollViewRef = useRef<ScrollView>(null);
	const inputRefs = useRef<{ [key: string]: number }>({});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		totalSpaces: '',
		gateIp: '',
		gatePort: '',
		description: '',
		cameraIp: '',
		cameraStreamPort: '',
		cameraSnapshotPort: '',
	});

	const validateIpInput = (text: string) => {
		// Разрешаем только цифры и точки
		const ipRegex = /^[0-9.]*$/;
		if (!ipRegex.test(text)) {
			return false;
		}

		// Проверяем, что точки не идут подряд
		if (text.includes('..')) {
			return false;
		}

		// Проверяем, что число не начинается с точки
		if (text.startsWith('.')) {
			return false;
		}

		// Разбиваем на октеты
		const octets = text.split('.').filter((octet) => octet !== '');

		// Проверяем, что октетов не больше 4
		if (octets.length > 4) {
			return false;
		}

		// Если это последний символ и это точка, проверяем количество октетов
		if (text.endsWith('.')) {
			// Если уже есть 3 октета, запрещаем добавлять точку
			if (octets.length >= 4) {
				return false;
			}
			return true;
		}

		// Проверяем каждый октет
		for (const octet of octets) {
			// Пропускаем пустые октеты
			if (!octet) continue;

			// Проверяем, что октет не превышает 255
			const num = parseInt(octet);
			if (isNaN(num) || num > 255) {
				return false;
			}
		}

		return true;
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

	const handleSubmit = async () => {
		if (
			!formData.name ||
			!formData.address ||
			!formData.totalSpaces ||
			!formData.gateIp ||
			!formData.gatePort
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
				cameraStreamPort: formData.cameraStreamPort
					? parseInt(formData.cameraStreamPort)
					: undefined,
				cameraSnapshotPort: formData.cameraSnapshotPort
					? parseInt(formData.cameraSnapshotPort)
					: undefined,
			});
			router.back();
		} catch (err) {
			console.log('Error creating garage:', err);
			Alert.alert('Ошибка', 'Не удалось создать гараж');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
		>
			<ScrollView
				ref={scrollViewRef}
				style={[styles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={styles.contentContainer}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={false}
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
						keyboardType='numeric'
						onFocus={() => scrollToInput('name')}
						onLayout={handleInputLayout('name')}
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
						autoCapitalize='sentences'
						autoCorrect={false}
						onFocus={() => scrollToInput('address')}
						onLayout={handleInputLayout('address')}
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
						onFocus={() => scrollToInput('totalSpaces')}
						onLayout={handleInputLayout('totalSpaces')}
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
						onFocus={() => scrollToInput('description')}
						onLayout={handleInputLayout('description')}
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
						onChangeText={(text) => {
							if (validateIpInput(text)) {
								setFormData({ ...formData, gateIp: text });
							}
						}}
						placeholder='Введите IP адрес шлагбаума'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numbers-and-punctuation'
						onFocus={() => scrollToInput('gateIp')}
						onLayout={handleInputLayout('gateIp')}
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
						onChangeText={(text) =>
							setFormData({ ...formData, gatePort: text })
						}
						placeholder='Введите порт шлагбаума'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numeric'
						onFocus={() => scrollToInput('gatePort')}
						onLayout={handleInputLayout('gatePort')}
					/>

					<Text style={[styles.label, { color: colors.text }]}>IP камеры</Text>
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
						onChangeText={(text) => {
							if (validateIpInput(text)) {
								setFormData({ ...formData, cameraIp: text });
							}
						}}
						placeholder='Введите IP адрес камеры (необязательно)'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numbers-and-punctuation'
						onFocus={() => scrollToInput('cameraIp')}
						onLayout={handleInputLayout('cameraIp')}
					/>

					<Text style={[styles.label, { color: colors.text }]}>
						Порт камеры для стрима
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
						value={formData.cameraStreamPort}
						onChangeText={(text) =>
							setFormData({ ...formData, cameraStreamPort: text })
						}
						placeholder='Введите порт камеры для стрима'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numeric'
						onFocus={() => scrollToInput('cameraStreamPort')}
						onLayout={handleInputLayout('cameraStreamPort')}
					/>

					<Text style={[styles.label, { color: colors.text }]}>
						Порт камеры для снимков
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
						value={formData.cameraSnapshotPort}
						onChangeText={(text) =>
							setFormData({ ...formData, cameraSnapshotPort: text })
						}
						placeholder='Введите порт камеры для снимков'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numeric'
						onFocus={() => scrollToInput('cameraSnapshotPort')}
						onLayout={handleInputLayout('cameraSnapshotPort')}
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
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 20,
		paddingBottom: 140,
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
