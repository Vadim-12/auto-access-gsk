import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { UserRoleEnum } from '@/constants/user-role';

export default function ProfileScreen() {
	const { logout, user } = useAuth();
	const { colors } = useTheme();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			await logout();
		} catch (error) {
			console.error('Ошибка при выходе из аккаунта:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const getRoleText = (role: UserRoleEnum) => {
		switch (role) {
			case UserRoleEnum.ADMIN:
				return 'Администратор';
			case UserRoleEnum.USER:
				return 'Пользователь';
			default:
				return 'Неизвестная роль';
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View
				style={[styles.profileInfo, { backgroundColor: colors.cardBackground }]}
			>
				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						ФИО:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{`${user?.lastName} ${user?.firstName} ${user?.middleName || ''}`}
					</Text>
				</View>

				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Телефон:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{user?.phoneNumber}
					</Text>
				</View>

				<View style={styles.infoRow}>
					<Text style={[styles.label, { color: colors.textSecondary }]}>
						Роль:
					</Text>
					<Text style={[styles.value, { color: colors.text }]}>
						{user?.role ? getRoleText(user.role) : 'Не определена'}
					</Text>
				</View>
			</View>

			<TouchableOpacity
				style={[styles.button, { backgroundColor: colors.error }]}
				onPress={handleLogout}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator color='white' />
				) : (
					<Text style={styles.buttonText}>Выйти</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	profileInfo: {
		padding: 20,
		borderRadius: 12,
		marginBottom: 20,
	},
	infoRow: {
		flexDirection: 'row',
		marginBottom: 12,
		alignItems: 'center',
	},
	label: {
		fontSize: 16,
		width: 80,
	},
	value: {
		fontSize: 16,
		flex: 1,
	},
	button: {
		backgroundColor: '#FF3B30',
		padding: 15,
		borderRadius: 8,
		margin: 20,
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
