import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCar } from '@/hooks/cars/useCar';
import { useDeleteCar } from '@/hooks/cars/useDeleteCar';
import { useTheme } from '@/contexts/ThemeContext';
import { useCars } from '@/contexts/CarsContext';

export default function CarDetailsScreen() {
	const { carId } = useLocalSearchParams();
	const { colors } = useTheme();
	const {
		car,
		isLoading: isLoadingCar,
		error: carError,
	} = useCar(carId as string);
	const { deleteCar, isLoading: isDeleting } = useDeleteCar();
	const { fetchCars } = useCars();

	// Проверяем, что carId является валидным UUID
	const isValidCarId =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
			carId as string
		);

	if (!isValidCarId) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text style={{ color: colors.text }}>Неверный ID автомобиля</Text>
			</View>
		);
	}

	const handleDelete = () => {
		Alert.alert(
			'Удаление автомобиля',
			'Вы уверены, что хотите удалить этот автомобиль?',
			[
				{
					text: 'Отмена',
					style: 'cancel',
				},
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteCar(carId as string);
							await fetchCars();
							router.back();
						} catch (err) {
							console.log('Error deleting car:', err);
							Alert.alert('Ошибка', 'Не удалось удалить автомобиль');
						}
					},
				},
			]
		);
	};

	if (isLoadingCar) {
		return (
			<View
				style={[
					styles.container,
					styles.loadingContainer,
					{ backgroundColor: colors.background },
				]}
			>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	if (carError || !car) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text style={{ color: colors.text }}>
					Ошибка: {carError?.message || 'Автомобиль не найден'}
				</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View
				style={[
					styles.infoContainer,
					{ backgroundColor: colors.cardBackground },
				]}
			>
				<View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Марка:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{car.brand}
					</Text>
				</View>
				<View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Модель:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{car.model}
					</Text>
				</View>
				<View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Номер:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{car.licensePlate}
					</Text>
				</View>
				<View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Цвет:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{car.color}
					</Text>
				</View>
				<View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Год выпуска:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>{car.year}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={[
					styles.deleteButton,
					{ backgroundColor: colors.error },
					isDeleting && styles.buttonDisabled,
				]}
				onPress={handleDelete}
				disabled={isDeleting}
			>
				<Text style={styles.deleteButtonText}>
					{isDeleting ? 'Удаление...' : 'Удалить автомобиль'}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoContainer: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		borderBottomWidth: 1,
	},
	label: {
		fontSize: 16,
	},
	value: {
		fontSize: 16,
		fontWeight: '600',
	},
	deleteButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
