import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useDeleteGarage } from '@/hooks/garages/useDeleteGarage';
import { useGarages } from '@/contexts/GaragesContext';
import { useRemoveUserFromGarage } from '@/hooks/garages/useRemoveUserFromGarage';
import { useAuth } from '@/contexts/AuthContext';
import { UserRoleEnum } from '@/constants/user-role';
import CameraView from '@/components/CameraView';
import { useToggleGate } from '@/hooks/garages/useToggleGate';
import { GarageGateStatusEnum } from '@/constants/statuses';

export default function GarageDetailsScreen() {
	const { garageId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { deleteGarage, isLoading: isDeleting } = useDeleteGarage();
	const { garages, fetchGarages } = useGarages();
	const { user } = useAuth();
	const { removeUser, isLoading: isRemoving } = useRemoveUserFromGarage();
	const { toggleGate, isLoading: isToggling } = useToggleGate();

	const garage = garages.find((g) => g.garageId === garageId);
	const isAdmin = user?.role === UserRoleEnum.ADMIN;

	console.log('Полная информация о гараже:', JSON.stringify(garage, null, 2));

	if (!garage) {
		return (
			<View style={[styles.container, styles.loadingContainer]}>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	const handleDelete = () => {
		Alert.alert(
			'Удаление гаража',
			`Вы уверены, что хотите удалить гараж №${garage?.number}?`,
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
							await deleteGarage(garageId as string);
							await fetchGarages();
							router.back();
						} catch (err) {
							console.log('Error deleting garage:', err);
							Alert.alert('Ошибка', 'Не удалось удалить гараж');
						}
					},
				},
			]
		);
	};

	const handleRemoveUser = (userId: string) => {
		Alert.alert(
			'Отвязка пользователя',
			'Вы уверены, что хотите отвязать пользователя от гаража?',
			[
				{
					text: 'Отмена',
					style: 'cancel',
				},
				{
					text: 'Отвязать',
					style: 'destructive',
					onPress: async () => {
						try {
							await removeUser(garageId as string, userId);
							await fetchGarages();
							router.replace('/(app)/(garages)');
						} catch (err) {
							console.log('Error removing user:', err);
							Alert.alert('Ошибка', 'Не удалось удалить пользователя');
						}
					},
				},
			]
		);
	};

	const renderCameraSection = () => (
		<View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Камера</Text>
			{garage?.camera ? (
				<View style={styles.cameraWrapper}>
					<CameraView
						cameraIp={garage.camera.ip}
						cameraPort={garage.camera.streamPort}
					/>
				</View>
			) : (
				<View style={styles.noCameraContainer}>
					<Text style={[styles.noCameraText, { color: colors.textSecondary }]}>
						Камера не настроена
					</Text>
				</View>
			)}
		</View>
	);

	const renderUsersSection = () => (
		<View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>
				Пользователи
			</Text>
			{garage.users && garage.users.length > 0 ? (
				<View>
					{garage.users.map((user) => (
						<View
							key={user.userId}
							style={[
								styles.userCard,
								{ backgroundColor: colors.cardBackground },
							]}
						>
							<View style={styles.userInfo}>
								<Text style={[styles.userName, { color: colors.text }]}>
									{user.firstName} {user.lastName}
								</Text>
								<Text
									style={[styles.userPhone, { color: colors.textSecondary }]}
								>
									{user.phoneNumber}
								</Text>
							</View>
							{isAdmin && (
								<TouchableOpacity
									style={[
										styles.removeButton,
										{ backgroundColor: colors.error },
									]}
									onPress={() => handleRemoveUser(user.userId)}
									disabled={isRemoving}
								>
									<Text style={styles.removeButtonText}>Отвязать</Text>
								</TouchableOpacity>
							)}
						</View>
					))}
				</View>
			) : (
				<Text style={[styles.noUsersText, { color: colors.textSecondary }]}>
					Нет привязанных пользователей
				</Text>
			)}
		</View>
	);

	const renderButtonsSection = () => {
		console.log('Gate info:', garage.gate);
		return (
			<View
				style={[styles.section, { backgroundColor: colors.cardBackground }]}
			>
				{garage.gate ? (
					<>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: colors.primary }]}
							onPress={async () => {
								try {
									await toggleGate(garageId as string);
									await fetchGarages();
								} catch (err) {
									console.log('Error toggling gate:', err);
									Alert.alert('Ошибка', 'Не удалось управлять шлагбаумом');
								}
							}}
							disabled={isToggling}
						>
							<Text style={styles.buttonText}>
								{isToggling
									? 'Изменение статуса...'
									: garage.gate.status === GarageGateStatusEnum.OPENED
									? 'Закрыть ворота'
									: 'Открыть ворота'}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: colors.warning }]}
							onPress={() => {
								router.push(`/(app)/(garages)/${garageId}/edit`);
							}}
						>
							<Text style={styles.buttonText}>Изменить настройки</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: colors.success }]}
							onPress={() =>
								router.push(`/(app)/(garages)/${garageId}/access-logs`)
							}
						>
							<Text style={styles.buttonText}>Журнал доступа</Text>
						</TouchableOpacity>
					</>
				) : (
					<Text style={[styles.noGateText, { color: colors.textSecondary }]}>
						Ворота не настроены
					</Text>
				)}
				{isAdmin && (
					<TouchableOpacity
						style={[styles.deleteButton, { backgroundColor: colors.error }]}
						onPress={handleDelete}
						disabled={isDeleting}
					>
						<Text style={styles.deleteButtonText}>
							{isDeleting ? 'Удаление...' : 'Удалить гараж'}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View
				style={[styles.section, { backgroundColor: colors.cardBackground }]}
			>
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					Информация
				</Text>

				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Наименование
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{garage.number}
					</Text>
				</View>

				{garage.description && (
					<View style={styles.infoRow}>
						<Text style={[styles.label, { color: colors.textSecondary }]}>
							Описание
						</Text>
						<Text style={[styles.value, { color: colors.text }]}>
							{garage.description}
						</Text>
					</View>
				)}

				{garage.gate && (
					<>
						<View style={styles.infoRow}>
							<Text style={[styles.label, { color: colors.textSecondary }]}>
								Шлагбаум
							</Text>
							<Text style={[styles.value, { color: colors.text }]}>
								{garage.gate.ip}:{garage.gate.port}
							</Text>
						</View>

						<View style={styles.infoRow}>
							<Text style={[styles.label, { color: colors.textSecondary }]}>
								Статус ворот
							</Text>
							<Text
								style={[
									styles.value,
									{
										color:
											garage.gate.status === GarageGateStatusEnum.OPENED
												? colors.success || 'green'
												: colors.error || 'red',
									},
								]}
							>
								{garage.gate.status === GarageGateStatusEnum.OPENED
									? 'Открыты'
									: 'Закрыты'}
							</Text>
						</View>
					</>
				)}

				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Камера
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{garage.camera ? (
							`${garage.camera.ip}:${garage.camera.streamPort}`
						) : (
							<Text style={{ color: 'lightgray' }}>Не настроена</Text>
						)}
					</Text>
				</View>

				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Дата создания
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{new Date(garage.createdAt).toLocaleDateString()}
					</Text>
				</View>

				{garage.admin && (
					<View style={styles.infoRow}>
						<Text style={[styles.label, { color: colors.textSecondary }]}>
							Администратор
						</Text>
						<View style={styles.valueContainer}>
							<Text style={[styles.value, { color: colors.text }]}>
								{garage.admin.firstName} {garage.admin.lastName}
							</Text>
							<Text style={[styles.value, { color: colors.textSecondary }]}>
								{garage.admin.phoneNumber}
							</Text>
						</View>
					</View>
				)}

				{garage.users && garage.users.length > 0 ? (
					<View style={styles.infoRow}>
						<Text style={[styles.label, { color: colors.textSecondary }]}>
							Владельцы
						</Text>
						<View style={styles.valueContainer}>
							{garage.users.map((user, index) => (
								<View key={user.userId} style={index > 0 && styles.userSpacing}>
									<Text style={[styles.value, { color: colors.text }]}>
										{user.firstName} {user.lastName}
									</Text>
									<Text style={[styles.value, { color: colors.textSecondary }]}>
										{user.phoneNumber}
									</Text>
								</View>
							))}
						</View>
					</View>
				) : (
					<View style={styles.infoRow}>
						<Text style={[styles.label, { color: colors.textSecondary }]}>
							Владельцы
						</Text>
						<Text style={[styles.value, { color: colors.textSecondary }]}>
							Не назначены
						</Text>
					</View>
				)}
			</View>
			{renderCameraSection()}
			{renderUsersSection()}
			{(() => {
				console.log('Rendering buttons section');
				return renderButtonsSection();
			})()}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	section: {
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	label: {
		fontSize: 16,
	},
	value: {
		fontSize: 16,
		fontWeight: '500',
	},
	valueContainer: {
		alignItems: 'flex-end',
	},
	userSpacing: {
		marginTop: 8,
	},
	cameraWrapper: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		overflow: 'hidden',
	},
	noCameraContainer: {
		padding: 16,
		alignItems: 'center',
	},
	noCameraText: {
		fontSize: 16,
	},
	userCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4,
	},
	userPhone: {
		fontSize: 14,
	},
	removeButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 4,
	},
	removeButtonText: {
		color: '#fff',
		fontWeight: '600',
	},
	noUsersText: {
		fontSize: 16,
		textAlign: 'center',
	},
	button: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	deleteButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	deleteButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
	noGateText: {
		fontSize: 16,
		textAlign: 'center',
	},
});
