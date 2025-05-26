import React, { useCallback } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCars } from '@/contexts/CarsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteCar } from '@/hooks/cars/useDeleteCar';

export default function CarsScreen() {
	const { cars, isLoading, error, fetchCars } = useCars();
	const { colors } = useTheme();
	const { deleteCar, isLoading: isDeleting } = useDeleteCar();

	useFocusEffect(
		useCallback(() => {
			fetchCars();
		}, [fetchCars])
	);

	const handleDelete = (carId: string, brand: string, model: string) => {
		Alert.alert(
			'Удаление автомобиля',
			`Вы уверены, что хотите удалить ${brand} ${model}?`,
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
							await deleteCar(carId);
							fetchCars();
						} catch (err) {
							console.log('Error deleting car:', err);
							Alert.alert('Ошибка', 'Не удалось удалить автомобиль');
						}
					},
				},
			]
		);
	};

	const renderContent = () => {
		if (isLoading) {
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

		if (error) {
			return (
				<View
					style={[
						styles.container,
						styles.loadingContainer,
						{ backgroundColor: colors.background },
					]}
				>
					<Text style={{ color: colors.text }}>Ошибка: {error.message}</Text>
				</View>
			);
		}

		return (
			<FlatList
				data={cars}
				keyExtractor={(item) => item.carId}
				contentContainerStyle={styles.listContainer}
				style={styles.list}
				renderItem={({ item }) => (
					<View style={styles.cardWrapper}>
						<TouchableOpacity
							style={[
								styles.carCard,
								{
									backgroundColor: colors.cardBackground,
									borderColor: colors.border,
									borderWidth: 1,
									borderRadius: 12,
									shadowColor: colors.shadowColor,
									shadowOffset: {
										width: 0,
										height: 2,
									},
									shadowOpacity: 0.1,
									shadowRadius: 3.84,
									elevation: 5,
								},
							]}
						>
							<Link href={`/(app)/(cars)/${item.carId}`} asChild>
								<TouchableOpacity style={styles.carInfoContainer}>
									<View style={styles.carInfo}>
										<Text style={[styles.carBrand, { color: colors.text }]}>
											{item.brand} {item.model}
										</Text>
										<Text
											style={[styles.carYear, { color: colors.textSecondary }]}
										>
											{item.year}
										</Text>
									</View>
									<View style={styles.carDetails}>
										<Text
											style={[styles.carPlate, { color: colors.textSecondary }]}
										>
											{item.licensePlate}
										</Text>
										<Text
											style={[styles.carColor, { color: colors.textSecondary }]}
										>
											{item.color}
										</Text>
									</View>
								</TouchableOpacity>
							</Link>
							<TouchableOpacity
								style={[
									styles.deleteButton,
									{ backgroundColor: colors.textSecondary },
									isDeleting && styles.buttonDisabled,
								]}
								onPress={(e) => {
									e.stopPropagation();
									handleDelete(item.carId, item.brand, item.model);
								}}
								disabled={isDeleting}
							>
								<Text style={styles.deleteButtonText}>
									{isDeleting ? 'Удаление...' : 'Удалить'}
								</Text>
							</TouchableOpacity>
						</TouchableOpacity>
					</View>
				)}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							У вас пока нет автомобилей
						</Text>
					</View>
				}
			/>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			{renderContent()}
			<Link
				href='/(app)/(cars)/create'
				asChild
				style={[styles.createButton, { backgroundColor: colors.primary }]}
			>
				<TouchableOpacity>
					<Text style={styles.addButtonText}>Добавить автомобиль</Text>
				</TouchableOpacity>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	list: {
		flex: 1,
		width: '100%',
	},
	listContainer: {
		paddingVertical: 16,
		paddingHorizontal: 16,
		paddingBottom: 100,
	},
	cardWrapper: {
		width: '100%',
		marginBottom: 16,
	},
	carCard: {
		width: '100%',
		padding: 16,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderRadius: 12,
		borderColor: '#DDDDDD',
	},
	carInfoContainer: {
		flex: 1,
	},
	carInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	carBrand: {
		fontSize: 18,
		fontWeight: '600',
	},
	carYear: {
		fontSize: 16,
	},
	carDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	carPlate: {
		fontSize: 16,
		fontWeight: '500',
	},
	carColor: {
		fontSize: 14,
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	emptyText: {
		fontSize: 16,
		textAlign: 'center',
	},
	createButton: {
		position: 'absolute',
		bottom: 40,
		left: '50%',
		transform: [{ translateX: '-50%' }],
		width: '80%',
		height: 50,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
		elevation: 3,
		alignItems: 'center',
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	deleteButton: {
		marginTop: 12,
		padding: 8,
		borderRadius: 8,
		alignItems: 'center',
		opacity: 0.8,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
});
