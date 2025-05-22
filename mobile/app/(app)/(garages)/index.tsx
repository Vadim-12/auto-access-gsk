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
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useGarages } from '@/contexts/GaragesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRoleEnum } from '@/constants/user-role';
import { useDeleteGarage } from '@/hooks/garages/useDeleteGarage';

export default function GaragesScreen() {
	const { garages, isLoading, error, fetchGarages } = useGarages();
	const { colors } = useTheme();
	const { user } = useAuth();
	const router = useRouter();
	const { deleteGarage, isLoading: isDeleting } = useDeleteGarage();

	useFocusEffect(
		useCallback(() => {
			fetchGarages();
		}, [fetchGarages])
	);

	const handleGaragePress = (garageId: string) => {
		router.push(`/(app)/(garages)/${garageId}`);
	};

	const handleDelete = (garageId: string, number: string) => {
		Alert.alert(
			'Удаление гаража',
			`Вы уверены, что хотите удалить гараж ${number}?`,
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
							await deleteGarage(garageId);
							fetchGarages();
						} catch (err) {
							console.error('Error deleting garage:', err);
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
				data={garages}
				keyExtractor={(item) => item.garageId}
				contentContainerStyle={styles.listContainer}
				style={styles.list}
				renderItem={({ item }) => (
					<View style={styles.cardWrapper}>
						<TouchableOpacity
							style={[
								styles.garageCard,
								{ backgroundColor: colors.cardBackground },
							]}
							onPress={() => handleGaragePress(item.garageId)}
						>
							<View style={styles.garageInfoContainer}>
								<View style={styles.garageInfo}>
									<Text style={[styles.garageNumber, { color: colors.text }]}>
										{item.number}
									</Text>
									<Text
										style={[styles.garageDate, { color: colors.textSecondary }]}
									>
										{new Date(item.createdAt).toLocaleDateString()}
									</Text>
								</View>
								{item.description && (
									<Text
										style={[
											styles.garageDescription,
											{ color: colors.textSecondary },
										]}
									>
										{item.description}
									</Text>
								)}
								{item.admin && (
									<View style={styles.adminInfo}>
										<Text
											style={[
												styles.adminText,
												{ color: colors.textSecondary },
											]}
										>
											IP шлагбаума: {item.gateIp}
										</Text>
										<Text
											style={[
												styles.adminText,
												{ color: colors.textSecondary },
											]}
										>
											Порт шлагбаума: {item.gatePort}
										</Text>
										<Text
											style={[
												styles.adminText,
												{ color: colors.textSecondary },
											]}
										>
											Администратор: {item.admin.phoneNumber}
										</Text>
									</View>
								)}
								<TouchableOpacity
									style={[
										styles.deleteButton,
										{ backgroundColor: colors.error },
										isDeleting && styles.buttonDisabled,
									]}
									onPress={(e) => {
										e.stopPropagation();
										handleDelete(item.garageId, item.number);
									}}
									disabled={isDeleting}
								>
									<Text style={styles.deleteButtonText}>
										{isDeleting ? 'Удаление...' : 'Удалить'}
									</Text>
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					</View>
				)}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							{user?.role === UserRoleEnum.ADMIN
								? 'У вас пока нет гаражей. Создайте новый гараж, нажав на кнопку ниже.'
								: 'У вас пока нет гаражей. Подайте заявку на доступ к гаражу.'}
						</Text>
					</View>
				}
			/>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			{renderContent()}
			<View style={styles.buttonContainer}>
				{user?.role === UserRoleEnum.ADMIN ? (
					<Link
						href='/(app)/(garages)/create'
						asChild
						style={[styles.button, { backgroundColor: colors.primary }]}
					>
						<TouchableOpacity>
							<Text style={styles.buttonText}>Создать гараж</Text>
						</TouchableOpacity>
					</Link>
				) : (
					<Link
						href='/(app)/(garages)/request'
						asChild
						style={[styles.button, { backgroundColor: colors.primary }]}
					>
						<TouchableOpacity>
							<Text style={styles.buttonText}>Подать заявку</Text>
						</TouchableOpacity>
					</Link>
				)}
			</View>
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
	garageCard: {
		width: '100%',
		padding: 16,
		borderWidth: 1,
		borderRadius: 12,
		borderColor: '#DDDDDD',
	},
	garageInfoContainer: {
		flex: 1,
	},
	garageInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	garageNumber: {
		fontSize: 18,
		fontWeight: '600',
	},
	garageDescription: {
		fontSize: 14,
		marginBottom: 8,
	},
	adminInfo: {
		marginTop: 8,
	},
	adminText: {
		fontSize: 14,
		marginBottom: 4,
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
	buttonContainer: {
		position: 'absolute',
		bottom: 40,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	button: {
		width: '80%',
		height: 50,
		borderRadius: 10,
		elevation: 3,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	deleteButton: {
		marginTop: 12,
		padding: 8,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	garageDate: {
		fontSize: 14,
	},
});
