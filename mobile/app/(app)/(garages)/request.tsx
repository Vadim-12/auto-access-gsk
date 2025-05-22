import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAvailableGarages } from '@/hooks/garages/useAvailableGarages';
import { useGarages } from '@/contexts/GaragesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

export default function RequestAccessScreen() {
	const {
		garages,
		isLoading: isLoadingAvailable,
		error: availableError,
		setGarages,
	} = useAvailableGarages();
	const {
		accessRequests,
		isLoading: isLoadingRequests,
		error: requestsError,
		fetchAccessRequests,
		createAccessRequest,
	} = useGarages();
	const { colors } = useTheme();
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		fetchAccessRequests();
	}, [fetchAccessRequests]);

	useEffect(() => {
		if (accessRequests.length > 0) {
			// Обновляем статус заявки для каждого гаража
			const updatedGarages = garages.map((garage) => {
				const request = accessRequests.find(
					(r) => r.garage?.garageId === garage.garageId
				);
				if (request?.status !== garage.requestStatus) {
					return {
						...garage,
						requestStatus: request?.status,
					};
				}
				return garage;
			});

			// Проверяем, есть ли реальные изменения перед обновлением
			const hasChanges = updatedGarages.some(
				(garage, index) => garage.requestStatus !== garages[index].requestStatus
			);

			if (hasChanges) {
				setGarages(updatedGarages);
			}
		}
	}, [accessRequests]);

	const handleRequestAccess = async (garageId: string) => {
		setIsSubmitting(true);
		try {
			// Находим все заявки пользователя для этого гаража
			const userRequests = accessRequests.filter(
				(r) => r.garage?.garageId === garageId
			);

			// Получаем последнюю заявку
			const lastRequest = userRequests.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)[0];

			// Если есть активная заявка, отзываем её
			if (lastRequest?.status === 'PENDING') {
				console.log('Cancelling request:', lastRequest);
				try {
					const response = await api.delete(
						`/garage-requests/${lastRequest.requestId}`
					);
					console.log('Delete response:', response);
					await fetchAccessRequests();
					// Обновляем список доступных гаражей
					const updatedGarages = garages.map((g) =>
						g.garageId === garageId ? { ...g, requestStatus: undefined } : g
					);
					setGarages(updatedGarages);
				} catch (deleteError: unknown) {
					if (deleteError instanceof AxiosError) {
						console.error('Error details:', {
							url: `/garage-requests/${lastRequest.requestId}`,
							status: deleteError.response?.status,
							data: deleteError.response?.data,
							message: deleteError.message,
							requestId: lastRequest.requestId,
							config: deleteError.config,
						});
					}
					throw deleteError;
				}
			} else {
				// Если нет активной заявки, создаем новую
				console.log('Creating new request for garage:', garageId);
				await createAccessRequest(garageId);
				await fetchAccessRequests();
			}
			router.back();
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				console.error('Error handling request:', {
					error: err,
					response: err.response?.data,
					status: err.response?.status,
				});
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoadingAvailable || isLoadingRequests) {
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

	if (availableError || requestsError) {
		return (
			<View
				style={[
					styles.container,
					styles.loadingContainer,
					{ backgroundColor: colors.background },
				]}
			>
				<Text style={{ color: colors.text }}>
					Ошибка: {availableError?.message || requestsError?.message}
				</Text>
			</View>
		);
	}

	const renderGarageStatus = (item: any) => {
		// Находим все заявки текущего пользователя для этого гаража
		const userRequests = accessRequests.filter(
			(r) => r.garage?.garageId === item.garageId
		);

		// Получаем последнюю заявку
		const lastRequest = userRequests.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0];

		// Если гараж занят, показываем информацию о владельце
		if (!item.isAvailable) {
			return (
				<View style={styles.statusContainer}>
					<View>
						<Text style={[styles.statusText, { color: colors.error }]}>
							Гараж занят
						</Text>
						{item.occupant && (
							<Text
								style={[styles.occupantText, { color: colors.textSecondary }]}
							>
								Владелец: {item.occupant.firstName} {item.occupant.lastName}
							</Text>
						)}
					</View>
				</View>
			);
		}

		// Если есть заявка текущего пользователя, показываем её статус
		if (lastRequest) {
			if (lastRequest.status === 'PENDING') {
				return (
					<View style={styles.statusContainer}>
						<View>
							<Text style={[styles.statusText, { color: colors.warning }]}>
								Заявка на рассмотрении
							</Text>
						</View>
						<TouchableOpacity
							style={[
								styles.requestButton,
								{ backgroundColor: colors.error },
								isSubmitting && styles.buttonDisabled,
							]}
							onPress={() => handleRequestAccess(item.garageId)}
							disabled={isSubmitting}
						>
							<Text style={styles.requestButtonText}>
								{isSubmitting ? 'Отзыв...' : 'Отозвать заявку'}
							</Text>
						</TouchableOpacity>
					</View>
				);
			}

			if (lastRequest.status === 'APPROVED') {
				return (
					<View style={styles.statusContainer}>
						<Text style={[styles.statusText, { color: colors.success }]}>
							Заявка одобрена
						</Text>
					</View>
				);
			}

			if (lastRequest.status === 'REJECTED') {
				return (
					<View style={styles.statusContainer}>
						<View>
							<Text style={[styles.statusText, { color: colors.error }]}>
								Заявка отклонена
							</Text>
						</View>
						<TouchableOpacity
							style={[
								styles.requestButton,
								{ backgroundColor: colors.primary },
								isSubmitting && styles.buttonDisabled,
							]}
							onPress={() => handleRequestAccess(item.garageId)}
							disabled={isSubmitting}
						>
							<Text style={styles.requestButtonText}>
								{isSubmitting ? 'Отправка...' : 'Подать заявку повторно'}
							</Text>
						</TouchableOpacity>
					</View>
				);
			}
		}

		// Если гараж свободен и нет заявки, показываем кнопку подачи заявки
		return (
			<TouchableOpacity
				style={[
					styles.requestButton,
					{ backgroundColor: colors.primary },
					isSubmitting && styles.buttonDisabled,
				]}
				onPress={() => handleRequestAccess(item.garageId)}
				disabled={isSubmitting}
			>
				<Text style={styles.requestButtonText}>
					{isSubmitting ? 'Отправка...' : 'Подать заявку'}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={[styles.section, { paddingHorizontal: 16 }]}>
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Доступные гаражи
				</Text>
				<FlatList
					data={garages}
					keyExtractor={(item) => item.garageId}
					contentContainerStyle={[
						styles.listContainer,
						{ paddingHorizontal: 0 },
					]}
					renderItem={({ item }) => (
						<View style={styles.cardWrapper}>
							<View
								style={[
									styles.garageCard,
									{
										backgroundColor: colors.cardBackground,
										borderColor: colors.border,
									},
								]}
							>
								<View style={styles.garageInfo}>
									<Text style={[styles.garageName, { color: colors.text }]}>
										Гараж {item.number}
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
								<View style={styles.garageDetails}>
									<Text
										style={[
											styles.garageDetail,
											{ color: colors.textSecondary },
										]}
									>
										Шлагбаум: {item.gateIp}:{item.gatePort}
									</Text>
									{item.cameraIp && item.cameraPort && (
										<Text
											style={[
												styles.garageDetail,
												{ color: colors.textSecondary },
											]}
										>
											Камера: {item.cameraIp}:{item.cameraPort}
										</Text>
									)}
									{item.admin && (
										<Text
											style={[
												styles.garageDetail,
												{ color: colors.textSecondary },
											]}
										>
											Администратор: {item.admin.phoneNumber}
										</Text>
									)}
									{!item.isAvailable && item.occupant && (
										<Text
											style={[
												styles.garageDetail,
												{ color: colors.textSecondary },
											]}
										>
											Занят: {item.occupant.firstName} {item.occupant.lastName}{' '}
											({item.occupant.phoneNumber})
										</Text>
									)}
								</View>
								{renderGarageStatus(item)}
							</View>
						</View>
					)}
					ListEmptyComponent={
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							Нет доступных гаражей
						</Text>
					}
				/>
			</View>

			<View style={[styles.section, { paddingHorizontal: 16 }]}>
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Мои заявки
				</Text>
				<FlatList
					data={accessRequests}
					keyExtractor={(item) => item.requestId}
					contentContainerStyle={[
						styles.listContainer,
						{ paddingHorizontal: 0 },
					]}
					renderItem={({ item }) => (
						<View style={styles.cardWrapper}>
							<View
								style={[
									styles.requestCard,
									{
										backgroundColor: colors.cardBackground,
										borderColor: colors.border,
									},
								]}
							>
								<Text
									style={[styles.requestGarageName, { color: colors.text }]}
								>
									Гараж {item.garage?.number}
								</Text>
								<View style={styles.requestInfo}>
									<Text
										style={[
											styles.requestStatus,
											{
												color:
													item.status === 'APPROVED'
														? colors.success
														: item.status === 'REJECTED'
														? colors.error
														: colors.textSecondary,
											},
										]}
									>
										{item.status === 'PENDING'
											? 'На рассмотрении'
											: item.status === 'APPROVED'
											? 'Одобрено'
											: 'Отклонено'}
									</Text>
									<Text
										style={[
											styles.requestDate,
											{ color: colors.textSecondary },
										]}
									>
										{new Date(item.createdAt).toLocaleDateString()}
									</Text>
								</View>
							</View>
						</View>
					)}
					ListEmptyComponent={
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							У вас пока нет заявок
						</Text>
					}
				/>
			</View>
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
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 16,
	},
	listContainer: {
		paddingBottom: 16,
	},
	cardWrapper: {
		marginBottom: 16,
	},
	garageCard: {
		padding: 16,
		borderWidth: 1,
		borderRadius: 12,
	},
	garageInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	garageName: {
		fontSize: 18,
		fontWeight: '600',
	},
	garageDate: {
		fontSize: 14,
	},
	garageDescription: {
		fontSize: 14,
		marginBottom: 12,
	},
	garageDetails: {
		marginBottom: 16,
	},
	garageDetail: {
		fontSize: 14,
		marginBottom: 4,
	},
	statusContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statusText: {
		fontSize: 14,
		fontWeight: '500',
	},
	requestButton: {
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		minWidth: 120,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	requestButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	requestCard: {
		padding: 16,
		borderWidth: 1,
		borderRadius: 12,
	},
	requestGarageName: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
	},
	requestInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	requestStatus: {
		fontSize: 14,
		fontWeight: '500',
	},
	requestDate: {
		fontSize: 14,
	},
	emptyText: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 16,
	},
	occupantText: {
		fontSize: 12,
		marginTop: 4,
	},
});
