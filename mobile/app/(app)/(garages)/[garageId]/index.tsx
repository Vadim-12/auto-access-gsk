import React, { useEffect, useState } from 'react';
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

export default function GarageDetailsScreen() {
	const { garageId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { deleteGarage, isLoading: isDeleting } = useDeleteGarage();
	const { garages, fetchGarages } = useGarages();
	const { user } = useAuth();
	const { removeUser, isLoading: isRemoving } = useRemoveUserFromGarage();

	const garage = garages.find((g) => g.garageId === garageId);
	const isAdmin = user?.role === UserRoleEnum.ADMIN;

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
							console.error('Error deleting garage:', err);
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
							console.error('Error removing user:', err);
						}
					},
				},
			]
		);
	};

	const renderInfoSection = () => (
		<View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>
				Информация
			</Text>

			<View style={styles.infoRow}>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Номер гаража
				</Text>
				<Text style={[styles.value, { color: colors.text }]}>
					№{garage.number}
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

			<View style={styles.infoRow}>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Шлагбаум
				</Text>
				<Text style={[styles.value, { color: colors.text }]}>
					{garage.gateIp}:{garage.gatePort}
				</Text>
			</View>

			<View style={styles.infoRow}>
				<Text style={[styles.label, { color: colors.textSecondary }]}>
					Камера
				</Text>
				<Text style={[styles.value, { color: colors.text }]}>
					{garage.camera
						? `${garage.camera.ip}:${garage.camera.port}`
						: 'Не настроена'}
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
	);

	const renderCameraSection = () => (
		<View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Камера</Text>
			{garage?.camera ? (
				<View style={styles.cameraWrapper}>
					<CameraView
						cameraIp={garage.camera.ip}
						cameraPort={garage.camera.port}
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
						<View key={user.userId} style={styles.userItem}>
							<Text style={[styles.userName, { color: colors.text }]}>
								{user.firstName} {user.lastName}
							</Text>
							{isAdmin && (
								<TouchableOpacity
									style={[
										styles.removeButton,
										{ backgroundColor: colors.error },
										isRemoving && styles.buttonDisabled,
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

	const renderButtonsSection = () => (
		<View style={styles.buttonsContainer}>
			{isAdmin && (
				<TouchableOpacity
					style={[styles.editButton, { backgroundColor: colors.primary }]}
					onPress={() => router.push(`/(app)/(garages)/${garageId}/edit`)}
				>
					<Text style={styles.editButtonText}>Изменить настройки</Text>
				</TouchableOpacity>
			)}

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
					{isDeleting ? 'Удаление...' : 'Удалить гараж'}
				</Text>
			</TouchableOpacity>

			{garage.users && garage.users.length > 0 && isAdmin && (
				<TouchableOpacity
					style={[
						styles.removeButton,
						{ backgroundColor: colors.error },
						isRemoving && styles.buttonDisabled,
					]}
					onPress={() => handleRemoveUser(garage.users[0].userId)}
					disabled={isRemoving}
				>
					<Text style={styles.removeButtonText}>
						{isRemoving ? 'Отвязка...' : 'Отвязать пользователя'}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	const sections = [
		{ id: 'info', render: renderInfoSection },
		{ id: 'camera', render: renderCameraSection },
		{ id: 'users', render: renderUsersSection },
		{ id: 'buttons', render: renderButtonsSection },
	];

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				showsVerticalScrollIndicator={true}
				bounces={true}
				scrollEnabled={true}
				alwaysBounceVertical={true}
				scrollEventThrottle={16}
			>
				{sections.map((section) => (
					<View key={section.id}>{section.render()}</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	scrollViewContent: {
		padding: 16,
		paddingBottom: 32,
		flexGrow: 1,
	},
	section: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		width: '100%',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 12,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#DDDDDD',
	},
	label: {
		fontSize: 14,
		flex: 0.4,
	},
	valueContainer: {
		flex: 0.6,
		alignItems: 'flex-end',
	},
	value: {
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'right',
	},
	cameraWrapper: {
		width: '100%',
		aspectRatio: 16 / 9,
		borderRadius: 8,
		overflow: 'hidden',
	},
	noCameraContainer: {
		width: '100%',
		aspectRatio: 16 / 9,
		borderRadius: 8,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
	},
	noCameraText: {
		fontSize: 16,
	},
	buttonsContainer: {
		marginTop: 20,
	},
	editButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 20,
	},
	editButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	deleteButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 20,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	removeButton: {
		marginTop: 12,
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	removeButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500',
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	userSpacing: {
		marginTop: 8,
	},
	userItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
	},
	userName: {
		fontSize: 14,
		fontWeight: '600',
	},
	noUsersText: {
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
	},
});
