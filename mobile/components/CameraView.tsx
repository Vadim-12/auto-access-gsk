import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { API_WS_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CameraViewProps {
	cameraIp: string;
	cameraPort: number;
}

export default function CameraView({ cameraIp, cameraPort }: CameraViewProps) {
	const socketRef = useRef<Socket | null>(null);
	const [imageData, setImageData] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isConnecting, setIsConnecting] = useState(true);

	useEffect(() => {
		const connect = async () => {
			setIsConnecting(true);
			setError(null);
			console.log('Connecting to WebSocket server:', API_WS_URL);

			try {
				const token = await AsyncStorage.getItem('access_token');
				if (!token) {
					throw new Error('No access token found');
				}

				// Подключаемся к WebSocket серверу
				socketRef.current = io(API_WS_URL, {
					auth: { token },
					transports: ['websocket'],
					reconnection: true,
					reconnectionAttempts: 5,
					reconnectionDelay: 1000,
				});

				// Обработчик подключения
				socketRef.current.on('connect', () => {
					console.log('Connected to WebSocket server');
					setIsConnecting(false);
					// Запрашиваем начало стрима
					console.log('Requesting stream start:', { cameraIp, cameraPort });
					socketRef.current?.emit('start-stream', {
						cameraIp,
						cameraPort,
					});
				});

				// Обработчик получения кадра
				socketRef.current.on('camera-frame', (frame: Buffer) => {
					console.log('Received camera frame:', frame.length, 'bytes');
					const base64Image = `data:image/jpeg;base64,${frame.toString(
						'base64'
					)}`;
					setImageData(base64Image);
					setError(null);
				});

				// Обработчик остановки стрима
				socketRef.current.on('stop-stream', (reason: string) => {
					console.log('Stream stopped:', reason);
					setError(`Стрим остановлен: ${reason}`);
					setImageData(null);
				});

				// Обработчик ошибок
				socketRef.current.on('error', (error) => {
					console.error('WebSocket error:', error);
					setError(`Ошибка WebSocket: ${error.message}`);
				});

				// Обработчик отключения
				socketRef.current.on('disconnect', (reason) => {
					console.log('WebSocket disconnected:', reason);
					setError(`Соединение разорвано: ${reason}`);
					setImageData(null);
				});

				// Обработчик переподключения
				socketRef.current.on('reconnect', (attemptNumber) => {
					console.log('WebSocket reconnected after', attemptNumber, 'attempts');
					setError(null);
				});

				// Обработчик ошибки переподключения
				socketRef.current.on('reconnect_error', (error) => {
					console.error('WebSocket reconnection error:', error);
					setError(`Ошибка переподключения: ${error.message}`);
				});
			} catch (err: unknown) {
				console.error('Error connecting to WebSocket:', err);
				setError(
					`Ошибка подключения: ${
						err instanceof Error ? err.message : 'Неизвестная ошибка'
					}`
				);
				setIsConnecting(false);
			}
		};

		connect();

		// Очистка при размонтировании
		return () => {
			if (socketRef.current) {
				console.log('Disconnecting WebSocket');
				socketRef.current.disconnect();
			}
		};
	}, [cameraIp, cameraPort]);

	return (
		<View style={styles.container}>
			{isConnecting ? (
				<View style={styles.placeholder}>
					<Text style={styles.placeholderText}>Подключение...</Text>
				</View>
			) : error ? (
				<View style={styles.placeholder}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			) : imageData ? (
				<Image
					source={{ uri: imageData }}
					style={styles.image}
					resizeMode='contain'
				/>
			) : (
				<View style={styles.placeholder}>
					<Text style={styles.placeholderText}>Нет изображения</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		aspectRatio: 16 / 9,
		backgroundColor: '#000',
		borderRadius: 8,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	placeholder: {
		width: '100%',
		height: '100%',
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholderText: {
		color: '#fff',
		fontSize: 16,
	},
	errorText: {
		color: '#ff4444',
		fontSize: 14,
		textAlign: 'center',
		padding: 16,
	},
});
