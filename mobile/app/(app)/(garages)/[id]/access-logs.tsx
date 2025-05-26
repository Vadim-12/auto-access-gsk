import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	RefreshControl,
	ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface AccessLog {
	id: string;
	createdAt: string;
	aiDescription: string;
	detectedCarNumber?: string;
	detectedCarColor?: string;
	isAccessGranted: boolean;
}

export default function AccessLogsScreen() {
	const { id } = useLocalSearchParams();
	const [logs, setLogs] = useState<AccessLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchLogs = async () => {
		try {
			const response = await api.get(`/garages/${id}/access-logs`);
			setLogs(response.data);
		} catch (error) {
			console.error('Ошибка при загрузке журнала доступа:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, [id]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchLogs();
	};

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{logs.length === 0 ? (
				<View style={styles.centered}>
					<Text style={styles.emptyText}>Нет записей в журнале доступа</Text>
				</View>
			) : (
				logs.map((log) => (
					<View key={log.id} style={styles.logItem}>
						<Text style={styles.logTime}>
							{new Date(log.createdAt).toLocaleString()}
						</Text>
						<Text style={styles.logDescription}>{log.aiDescription}</Text>
						{log.detectedCarNumber && (
							<Text style={styles.logDetails}>
								Номер: {log.detectedCarNumber}
							</Text>
						)}
						{log.detectedCarColor && (
							<Text style={styles.logDetails}>
								Цвет: {log.detectedCarColor}
							</Text>
						)}
						<Text
							style={[
								styles.logStatus,
								{
									color: log.isAccessGranted ? '#4CAF50' : '#F44336',
								},
							]}
						>
							{log.isAccessGranted ? 'Доступ разрешен' : 'Доступ запрещен'}
						</Text>
					</View>
				))
			)}
		</ScrollView>
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
		padding: 16,
	},
	logItem: {
		padding: 16,
		margin: 12,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	logTime: {
		fontSize: 12,
		color: '#666',
		marginBottom: 8,
	},
	logDescription: {
		fontSize: 16,
		marginBottom: 8,
	},
	logDetails: {
		fontSize: 14,
		color: '#333',
		marginBottom: 4,
	},
	logStatus: {
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 8,
	},
	emptyText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
});
