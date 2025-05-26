import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { api } from '../../../../lib/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AccessLog {
	logId: string;
	createdAt: string;
	aiDescription: string;
	confidence: number;
	detectedCar: {
		brand: string;
		model: string;
		year: number;
		color: string;
		licensePlate: string;
	} | null;
}

export default function GarageAccessLogsScreen() {
	const { garageId } = useLocalSearchParams<{ garageId: string }>();
	const [logs, setLogs] = useState<AccessLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const fetchLogs = async (pageNum: number, shouldRefresh = false) => {
		if (!garageId) {
			console.error('GarageId is undefined');
			return;
		}

		try {
			const response = await api.get(`/garages/${garageId}/access-logs`, {
				params: {
					page: pageNum,
					limit: 10,
				},
			});

			const { logs: newLogs, totalPages } = response.data;

			if (shouldRefresh) {
				setLogs(newLogs);
			} else {
				setLogs((prev) => [...prev, ...newLogs]);
			}

			setHasMore(pageNum < totalPages);
		} catch (error) {
			console.error('Ошибка при получении журнала доступа:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLogs(1, true);
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		setPage(1);
		fetchLogs(1, true);
	};

	const loadMore = () => {
		if (!loading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchLogs(nextPage);
		}
	};

	const renderLogItem = ({ item }: { item: AccessLog }) => (
		<View style={styles.logItem}>
			<Text style={styles.timestamp}>
				{format(new Date(item.createdAt), 'dd MMMM yyyy, HH:mm', {
					locale: ru,
				})}
			</Text>
			<Text style={styles.description}>{item.aiDescription}</Text>
			<Text style={styles.confidence}>Уверенность: {item.confidence}%</Text>
			{item.detectedCar && (
				<View style={styles.carInfo}>
					<Text style={styles.carTitle}>Обнаруженный автомобиль:</Text>
					<Text>Марка: {item.detectedCar.brand}</Text>
					<Text>Модель: {item.detectedCar.model}</Text>
					<Text>Год: {item.detectedCar.year}</Text>
					<Text>Цвет: {item.detectedCar.color}</Text>
					<Text>Номер: {item.detectedCar.licensePlate}</Text>
				</View>
			)}
		</View>
	);

	if (loading && !refreshing) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Журнал доступа',
					headerBackTitle: 'Назад',
				}}
			/>
			<View style={styles.container}>
				<FlatList
					data={logs}
					renderItem={renderLogItem}
					keyExtractor={(item) => item.logId}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					onEndReached={loadMore}
					onEndReachedThreshold={0.5}
					ListEmptyComponent={
						<Text style={styles.emptyText}>Журнал доступа пуст</Text>
					}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logItem: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	timestamp: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	description: {
		fontSize: 16,
		marginBottom: 8,
	},
	confidence: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	carInfo: {
		marginTop: 8,
		padding: 8,
		backgroundColor: '#f5f5f5',
		borderRadius: 4,
	},
	carTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	emptyText: {
		textAlign: 'center',
		marginTop: 20,
		color: '#666',
	},
});
