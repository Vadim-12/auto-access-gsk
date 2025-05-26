import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useCreateCar } from '../../../hooks/cars/useCreateCar';
import { useTheme } from '@/contexts/ThemeContext';
import { useCars } from '@/hooks/cars/useCars';

export default function AddCarScreen() {
	const [brand, setBrand] = useState('');
	const [model, setModel] = useState('');
	const [licensePlate, setLicensePlate] = useState('');
	const [color, setColor] = useState('');
	const [year, setYear] = useState('');
	const [vin, setVin] = useState('');

	const { fetchCars } = useCars();
	const { createCar, isLoading, error } = useCreateCar();
	const { colors } = useTheme();

	const handleSubmit = async () => {
		try {
			await createCar({
				brand,
				model,
				licensePlate,
				color,
				year: parseInt(year, 10),
				vin,
			});
			await fetchCars();
			router.back();
		} catch (err) {
			console.log('Error adding car:', err);
			Alert.alert('Ошибка', 'Не удалось добавить автомобиль');
		}
	};

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={styles.form}>
				<Text style={[styles.label, { color: colors.text }]}>Марка</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={brand}
					onChangeText={setBrand}
					placeholder='Например: Toyota'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Модель</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={model}
					onChangeText={setModel}
					placeholder='Например: Camry'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Номер</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={licensePlate}
					onChangeText={setLicensePlate}
					placeholder='Например: А123БВ777'
					placeholderTextColor={colors.textSecondary}
					autoCapitalize='characters'
				/>

				<Text style={[styles.label, { color: colors.text }]}>VIN-код</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={vin}
					onChangeText={setVin}
					placeholder='Например: XTA210999Y1234567'
					placeholderTextColor={colors.textSecondary}
					autoCapitalize='characters'
					maxLength={17}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Цвет</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={color}
					onChangeText={setColor}
					placeholder='Например: Черный'
					placeholderTextColor={colors.textSecondary}
				/>

				<Text style={[styles.label, { color: colors.text }]}>Год выпуска</Text>
				<TextInput
					style={[
						styles.input,
						{
							borderColor: colors.border,
							color: colors.text,
							backgroundColor: colors.cardBackground,
						},
					]}
					value={year}
					onChangeText={setYear}
					placeholder='Например: 2020'
					placeholderTextColor={colors.textSecondary}
					keyboardType='numeric'
				/>

				{error && (
					<Text style={[styles.error, { color: colors.error }]}>
						{error.message}
					</Text>
				)}

				<TouchableOpacity
					style={[
						styles.button,
						{ backgroundColor: colors.primary },
						isLoading && styles.buttonDisabled,
					]}
					onPress={handleSubmit}
					disabled={isLoading}
				>
					<Text style={styles.buttonText}>
						{isLoading ? 'Добавление...' : 'Добавить автомобиль'}
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
	form: {
		padding: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		marginBottom: 16,
	},
	button: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	error: {
		marginTop: 10,
		textAlign: 'center',
	},
});
