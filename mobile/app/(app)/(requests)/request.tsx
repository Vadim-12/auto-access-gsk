import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/lib/api';
import { useGarages } from '@/contexts/GaragesContext';
import { useRequests } from '@/contexts/RequestsContext';

interface RequestDetails {
	requestId: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	description?: string;
	createdAt: string;
	user: {
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	garage: {
		number: string;
		description?: string;
	};
}

export default function RequestScreen() {
	const { requestId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { fetchGarages } = useGarages();
	const { fetchRequests } = useRequests();
	const [comment, setComment] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(
		null
	);
	const [isLoadingDetails, setIsLoadingDetails] = useState(true);

	useEffect(() => {
		const fetchRequestDetails = async () => {
			try {
				setIsLoadingDetails(true);
				const response = await api.get<RequestDetails>(
					`/garage-requests/${requestId}`
				);
				setRequestDetails(response.data);
			} catch (err) {
				console.log('Error fetching request details:', err);
				Alert.alert('Ошибка', 'Не удалось загрузить детали запроса');
			} finally {
				setIsLoadingDetails(false);
			}
		};

		fetchRequestDetails();
	}, [requestId]);

	const handleRequest = async (status: 'APPROVED' | 'REJECTED') => {
		try {
			setIsLoading(true);
			await api.patch(`/garage-requests/${requestId}/status`, {
				status,
				description: comment,
			});
			await fetchRequests();
			await fetchGarages();
			router.back();
		} catch (err) {
			console.log('Error handling request:', err);
			Alert.alert('Ошибка', 'Не удалось обработать запрос');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoadingDetails) {
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

	if (!requestDetails) {
		return (
			<View
				style={[
					styles.container,
					styles.loadingContainer,
					{ backgroundColor: colors.background },
				]}
			>
				<Text style={[styles.errorText, { color: colors.text }]}>
					Не удалось загрузить информацию о заявке
				</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
			contentContainerStyle={styles.contentContainer}
		>
			<View style={styles.form}>
				<View
					style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}
				>
					<Text style={[styles.infoTitle, { color: colors.text }]}>
						Информация о заявке
					</Text>

					<View style={styles.infoSection}>
						<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
							Гараж
						</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>
							{requestDetails.garage.number}
						</Text>
					</View>

					<View style={styles.infoSection}>
						<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
							Заявитель
						</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>
							{requestDetails.user.firstName} {requestDetails.user.lastName}
						</Text>
						<Text style={[styles.infoValue, { color: colors.textSecondary }]}>
							{requestDetails.user.phoneNumber}
						</Text>
					</View>

					<View style={styles.infoSection}>
						<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
							Комментарий заявителя
						</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>
							{requestDetails.description || 'Комментарий отсутствует'}
						</Text>
					</View>

					<View style={styles.infoSection}>
						<Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
							Дата создания
						</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>
							{new Date(requestDetails.createdAt).toLocaleDateString()}
						</Text>
					</View>
				</View>

				<Text style={[styles.label, { color: colors.text }]}>
					Комментарий к решению
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
					value={comment}
					onChangeText={setComment}
					placeholder='Введите комментарий...'
					placeholderTextColor={colors.textSecondary}
					multiline
					numberOfLines={4}
				/>

				<View style={styles.actions}>
					<TouchableOpacity
						style={[
							styles.button,
							{ backgroundColor: colors.primary },
							isLoading && styles.buttonDisabled,
						]}
						onPress={() => handleRequest('APPROVED')}
						disabled={isLoading}
					>
						<Text style={styles.buttonText}>
							{isLoading ? 'Обработка...' : 'Одобрить'}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.button,
							{ backgroundColor: colors.error },
							isLoading && styles.buttonDisabled,
						]}
						onPress={() => handleRequest('REJECTED')}
						disabled={isLoading}
					>
						<Text style={styles.buttonText}>
							{isLoading ? 'Обработка...' : 'Отклонить'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
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
	contentContainer: {
		padding: 20,
	},
	form: {
		gap: 12,
	},
	infoCard: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 20,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	infoSection: {
		marginBottom: 16,
	},
	infoLabel: {
		fontSize: 14,
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		minHeight: 120,
		textAlignVertical: 'top',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
		marginTop: 20,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 32,
	},
});
