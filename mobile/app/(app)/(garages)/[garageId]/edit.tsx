import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	TextInput,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useUpdateGarageSettings } from '@/hooks/garages/useUpdateGarageSettings';
import { useGarages } from '@/contexts/GaragesContext';

export default function EditGarageScreen() {
	const { garageId } = useLocalSearchParams();
	const { colors } = useTheme();
	const { garages, fetchGarages } = useGarages();
	const { updateCameraSettings, updateGateSettings, isUpdating } =
		useUpdateGarageSettings();

	const [cameraSettings, setCameraSettings] = useState({
		ip: '',
		streamPort: '',
		snapshotPort: '',
	});

	const [gateSettings, setGateSettings] = useState({
		ip: '',
		port: '',
	});

	const [isGateInputFocused, setIsGateInputFocused] = useState(false);

	const scrollViewRef = useRef<ScrollView>(null);
	const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

	const [scrollPosition, setScrollPosition] = useState(0);

	const garage = useMemo(
		() => garages.find((g) => g.garageId === garageId),
		[garages, garageId]
	);

	useEffect(() => {
		if (garage) {
			setCameraSettings({
				ip: garage.camera?.ip || '',
				streamPort: garage.camera?.streamPort?.toString() || '',
				snapshotPort: garage.camera?.snapshotPort?.toString() || '',
			});

			setGateSettings({
				ip: garage.gate?.ip || '',
				port: garage.gate?.port?.toString() || '',
			});
		}
	}, [garage]);

	const handleUpdateCameraSettings = async () => {
		try {
			await updateCameraSettings(garageId as string, {
				ip: cameraSettings.ip,
				streamPort: parseInt(cameraSettings.streamPort) || 81,
				snapshotPort: parseInt(cameraSettings.snapshotPort) || 80,
			});
			Alert.alert('Успех', 'Настройки камеры обновлены');
			fetchGarages();
			router.back();
		} catch (error) {
			console.error('Ошибка при обновлении настроек камеры:', error);
			Alert.alert('Ошибка', 'Не удалось обновить настройки камеры');
		}
	};

	const handleUpdateGateSettings = async () => {
		try {
			await updateGateSettings(garageId as string, {
				ip: gateSettings.ip,
				port: parseInt(gateSettings.port, 10),
			});
			Alert.alert('Успех', 'Настройки шлагбаума обновлены');
			fetchGarages();
			router.back();
		} catch (error) {
			console.error('Ошибка при обновлении настроек шлагбаума:', error);
			Alert.alert('Ошибка', 'Не удалось обновить настройки шлагбаума');
		}
	};

	const scrollToInput = (inputName: string) => {
		if (inputName.startsWith('gate')) {
			setIsGateInputFocused(true);
			setTimeout(() => {
				inputRefs.current[inputName]?.measure(
					(x, y, width, height, pageX, pageY) => {
						if (pageY > scrollPosition + 300) {
							scrollViewRef.current?.scrollTo({
								y: pageY - 300,
								animated: true,
							});
						}
					}
				);
			}, 100);
		} else {
			setIsGateInputFocused(false);
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
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[styles.container, { backgroundColor: colors.background }]}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
		>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={[
					styles.scrollContent,
					isGateInputFocused && { paddingBottom: 150 },
				]}
				keyboardShouldPersistTaps='handled'
				onScroll={(event) => {
					setScrollPosition(event.nativeEvent.contentOffset.y);
				}}
				scrollEventThrottle={16}
			>
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
							ref={(ref) => {
								inputRefs.current['cameraIp'] = ref;
							}}
							style={[
								styles.input,
								{ borderColor: colors.border, color: colors.text },
							]}
							value={cameraSettings.ip}
							onChangeText={(text) =>
								setCameraSettings({ ...cameraSettings, ip: text })
							}
							placeholder='IP камеры'
							placeholderTextColor={colors.textSecondary}
							onFocus={() => scrollToInput('cameraIp')}
						/>
						<Text style={[styles.label, { color: colors.text }]}>
							Порт камеры для стрима
						</Text>
						<TextInput
							ref={(ref) => {
								inputRefs.current['cameraStreamPort'] = ref;
							}}
							style={[
								styles.input,
								{
									backgroundColor: colors.cardBackground,
									color: colors.text,
									borderColor: colors.border,
								},
							]}
							value={cameraSettings.streamPort}
							onChangeText={(text) =>
								setCameraSettings({ ...cameraSettings, streamPort: text })
							}
							placeholder='Введите порт камеры для стрима'
							placeholderTextColor={colors.textSecondary}
							keyboardType='numeric'
							onFocus={() => scrollToInput('cameraStreamPort')}
						/>

						<Text style={[styles.label, { color: colors.text }]}>
							Порт камеры для снимков
						</Text>
						<TextInput
							ref={(ref) => {
								inputRefs.current['cameraSnapshotPort'] = ref;
							}}
							style={[
								styles.input,
								{
									backgroundColor: colors.cardBackground,
									color: colors.text,
									borderColor: colors.border,
								},
							]}
							value={cameraSettings.snapshotPort}
							onChangeText={(text) =>
								setCameraSettings({ ...cameraSettings, snapshotPort: text })
							}
							placeholder='Введите порт камеры для снимков'
							placeholderTextColor={colors.textSecondary}
							keyboardType='numeric'
							onFocus={() => scrollToInput('cameraSnapshotPort')}
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
							ref={(ref) => {
								inputRefs.current['gateIp'] = ref;
							}}
							style={[
								styles.input,
								{ borderColor: colors.border, color: colors.text },
							]}
							value={gateSettings.ip}
							onChangeText={(text) =>
								setGateSettings({ ...gateSettings, ip: text })
							}
							placeholder='IP шлагбаума'
							placeholderTextColor={colors.textSecondary}
							onFocus={() => scrollToInput('gateIp')}
						/>
						<TextInput
							ref={(ref) => {
								inputRefs.current['gatePort'] = ref;
							}}
							style={[
								styles.input,
								{ borderColor: colors.border, color: colors.text },
							]}
							value={gateSettings.port}
							onChangeText={(text) =>
								setGateSettings({ ...gateSettings, port: text })
							}
							placeholder='Порт шлагбаума'
							placeholderTextColor={colors.textSecondary}
							keyboardType='numeric'
							onFocus={() => scrollToInput('gatePort')}
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
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
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
	label: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
	},
});
