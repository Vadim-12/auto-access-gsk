import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Profile() {
	const { logout } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			// Здесь можно добавить очистку других данных приложения
			await logout();
		} catch (error) {
			console.error('Ошибка при выходе из аккаунта:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Профиль</Text>

			<TouchableOpacity
				style={[styles.button, isLoading && styles.buttonDisabled]}
				onPress={handleLogout}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator color='white' />
				) : (
					<Text style={styles.buttonText}>Выйти из аккаунта</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	button: {
		backgroundColor: '#FF3B30',
		padding: 15,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
