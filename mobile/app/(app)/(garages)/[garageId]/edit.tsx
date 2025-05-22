import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	TextInput,
	ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateGarageSettings } from '@/hooks/garages/useUpdateGarageSettings';
import { useGarages } from '@/contexts/GaragesContext';

export default function EditGarageScreen() {
	const { garageId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { garages, fetchGarages } = useGarages();
	const {
		updateCameraSettings,
		updateGateSettings,
		isLoading: isUpdating,
	} = useUpdateGarageSettings();

	const [cameraIp, setCameraIp] = useState('');
	const [cameraPort, setCameraPort] = useState('');
	const [gateIp, setGateIp] = useState('');
	const [gatePort, setGatePort] = useState('');

	const garage = garages.find((g) => g.garageId === garageId);

	const handleUpdateCameraSettings = async () => {
		try {
			await updateCameraSettings(garageId as string, {
				ip: cameraIp,
				port: parseInt(cameraPort, 10),
			});
			Alert.alert('Успех', 'Настройки камеры обновлены');
			fetchGarages();
			router.back();
		} catch (err) {
			Alert.alert('Ошибка', 'Не удалось обновить настройки камеры');
		}
	};

	const handleUpdateGateSettings = async () => {
		try {
			await updateGateSettings(garageId as string, {
				ip: gateIp,
				port: parseInt(gatePort, 10),
			});
			Alert.alert('Успех', 'Настройки шлагбаума обновлены');
			fetchGarages();
			router.back();
		} catch (err) {
			Alert.alert('Ошибка', 'Не удалось обновить настройки шлагбаума');
		}
	};

	if (!garage) {
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

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={styles.content}>
				<View
					style={[
						styles.settingsContainer,
						{ backgroundColor: colors.cardBackground },
					]}
				>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Настройки камеры
					</Text>
					<TextInput
						style={[
							styles.input,
							{ borderColor: colors.border, color: colors.text },
						]}
						value={cameraIp}
						onChangeText={setCameraIp}
						placeholder='IP камеры'
						placeholderTextColor={colors.textSecondary}
					/>
					<TextInput
						style={[
							styles.input,
							{ borderColor: colors.border, color: colors.text },
						]}
						value={cameraPort}
						onChangeText={setCameraPort}
						placeholder='Порт камеры'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numeric'
					/>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: colors.primary }]}
						onPress={handleUpdateCameraSettings}
						disabled={isUpdating}
					>
						<Text style={styles.buttonText}>
							{isUpdating ? 'Обновление...' : 'Обновить настройки камеры'}
						</Text>
					</TouchableOpacity>
				</View>

				<View
					style={[
						styles.settingsContainer,
						{ backgroundColor: colors.cardBackground },
					]}
				>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						Настройки шлагбаума
					</Text>
					<TextInput
						style={[
							styles.input,
							{ borderColor: colors.border, color: colors.text },
						]}
						value={gateIp}
						onChangeText={setGateIp}
						placeholder='IP шлагбаума'
						placeholderTextColor={colors.textSecondary}
					/>
					<TextInput
						style={[
							styles.input,
							{ borderColor: colors.border, color: colors.text },
						]}
						value={gatePort}
						onChangeText={setGatePort}
						placeholder='Порт шлагбаума'
						placeholderTextColor={colors.textSecondary}
						keyboardType='numeric'
					/>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: colors.primary }]}
						onPress={handleUpdateGateSettings}
						disabled={isUpdating}
					>
						<Text style={styles.buttonText}>
							{isUpdating ? 'Обновление...' : 'Обновить настройки шлагбаума'}
						</Text>
					</TouchableOpacity>
				</View>
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
	content: {
		padding: 16,
	},
	settingsContainer: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		marginBottom: 16,
	},
	button: {
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
