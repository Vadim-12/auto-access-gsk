import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useServerHealth } from '@/hooks/useServerHealth';
import { MaterialIcons } from '@expo/vector-icons';

export const ServerStatus = () => {
	const { isHealthy, error, lastCheck } = useServerHealth();

	return (
		<View style={styles.container}>
			<View style={styles.statusContainer}>
				<MaterialIcons
					name={isHealthy ? 'cloud-done' : 'cloud-off'}
					size={24}
					color={isHealthy ? '#4CAF50' : '#F44336'}
				/>
				<Text style={styles.statusText}>
					{isHealthy === null
						? 'Проверка...'
						: isHealthy
						? 'Сервер доступен'
						: 'Сервер недоступен'}
				</Text>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
			{lastCheck && (
				<Text style={styles.lastCheckText}>
					Последняя проверка:{' '}
					{lastCheck.toLocaleTimeString('ru-RU', {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		margin: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	statusText: {
		marginLeft: 8,
		fontSize: 16,
		fontWeight: '500',
	},
	errorText: {
		color: '#F44336',
		fontSize: 14,
		marginBottom: 8,
	},
	lastCheckText: {
		color: '#757575',
		fontSize: 12,
		marginBottom: 8,
	},
	refreshButton: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		padding: 8,
	},
	refreshText: {
		color: '#2196F3',
		marginLeft: 4,
		fontSize: 14,
	},
});
