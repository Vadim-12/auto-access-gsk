import React, { useCallback, useMemo } from 'react';
import {
	View,
	Text,
	SectionList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { useRequests } from '@/contexts/RequestsContext';

interface GarageRequest {
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

interface Section {
	title: string;
	data: GarageRequest[];
}

export default function AdminRequestsScreen() {
	const { colors } = useTheme();
	const { requests, isLoading, error, fetchRequests } = useRequests();
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			fetchRequests();
		}, [])
	);

	const sections = useMemo(() => {
		if (!requests.length) return [];

		const pendingRequests = requests.filter((req) => req.status === 'PENDING');
		const otherRequests = requests.filter((req) => req.status !== 'PENDING');

		const result: Section[] = [];

		if (pendingRequests.length > 0) {
			result.push({
				title: 'На рассмотрении',
				data: pendingRequests,
			});
		}

		if (otherRequests.length > 0) {
			result.push({
				title: 'Обработанные заявки',
				data: otherRequests,
			});
		}

		return result;
	}, [requests]);

	const renderSectionHeader = ({ section }: { section: Section }) => (
		<View
			style={[styles.sectionHeader, { backgroundColor: colors.background }]}
		>
			<Text style={[styles.sectionHeaderText, { color: colors.text }]}>
				{section.title}
			</Text>
		</View>
	);

	const renderItem = ({ item }: { item: GarageRequest }) => (
		<View style={styles.cardWrapper}>
			<View
				style={[styles.requestCard, { backgroundColor: colors.cardBackground }]}
			>
				<View style={styles.requestInfoContainer}>
					<View style={styles.requestInfo}>
						<Text style={[styles.requestNumber, { color: colors.text }]}>
							Гараж {item.garage.number}
						</Text>
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
					</View>

					<Text
						style={[styles.requestDescription, { color: colors.textSecondary }]}
					>
						{item.description}
					</Text>

					<Text
						style={[styles.requestDateText, { color: colors.textSecondary }]}
					>
						{new Date(item.createdAt).toLocaleDateString()}
					</Text>
				</View>

				<View style={styles.userInfo}>
					<Text style={[styles.userName, { color: colors.text }]}>
						{item.user.firstName} {item.user.lastName}
					</Text>
					<Text style={[styles.userPhone, { color: colors.textSecondary }]}>
						{item.user.phoneNumber}
					</Text>
				</View>

				{item.status === 'PENDING' && (
					<TouchableOpacity
						style={[styles.viewButton, { backgroundColor: colors.primary }]}
						onPress={() => {
							router.push(
								`/(app)/(requests)/request?requestId=${item.requestId}`
							);
						}}
					>
						<Text style={styles.viewButtonText}>Рассмотреть заявку</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);

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

	if (requests.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
					Нет заявок на рассмотрение
				</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<SectionList
				sections={sections}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
				keyExtractor={(item) => item.requestId}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={true}
				bounces={true}
				stickySectionHeadersEnabled={true}
			/>
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
	listContainer: {
		paddingBottom: 100,
	},
	sectionHeader: {
		padding: 16,
		paddingBottom: 8,
	},
	sectionHeaderText: {
		fontSize: 18,
		fontWeight: '600',
	},
	cardWrapper: {
		width: '100%',
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	requestCard: {
		width: '100%',
		padding: 16,
		borderWidth: 1,
		borderRadius: 12,
		borderColor: '#DDDDDD',
	},
	requestInfoContainer: {
		flex: 1,
	},
	requestInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	requestNumber: {
		fontSize: 18,
		fontWeight: '600',
	},
	requestDescription: {
		fontSize: 14,
		marginBottom: 8,
	},
	requestDateText: {
		fontSize: 14,
	},
	requestStatus: {
		fontSize: 14,
		fontWeight: '500',
	},
	userInfo: {
		marginBottom: 8,
	},
	userName: {
		fontSize: 16,
		fontWeight: '500',
	},
	userPhone: {
		fontSize: 14,
	},
	viewButton: {
		marginTop: 12,
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	viewButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 32,
	},
	emptyText: {
		fontSize: 16,
		textAlign: 'center',
	},
});
