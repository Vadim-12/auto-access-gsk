import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createSocket } from '@/lib/websocket';
import { Socket } from 'socket.io-client';

interface CameraViewProps {
	cameraIp: string;
	cameraPort: number;
}

export default function CameraView({ cameraIp, cameraPort }: CameraViewProps) {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [nextImageUrl, setNextImageUrl] = useState<string | null>(null);
	const { colors } = useTheme();
	const socketRef = useRef<Socket | null>(null);
	const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isConnectingRef = useRef(false);
	const startStreamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const connectionStatusRef = useRef<string | null>(null);
	const isFirstFrameRef = useRef(true);

	const handleError = useCallback(
		(errorMessage: string) => {
			console.log('[Camera] Error:', {
				message: errorMessage,
				retryCount,
			});

			setError(errorMessage);
			setIsLoading(false);

			if (retryCount < 5 && !isConnectingRef.current) {
				const delay = Math.min(1000 * (retryCount + 1), 5000);
				console.log(`[Camera] Retry ${retryCount + 1} in ${delay}ms`);

				if (retryTimeoutRef.current) {
					clearTimeout(retryTimeoutRef.current);
				}

				retryTimeoutRef.current = setTimeout(() => {
					console.log('[Camera] Executing retry', retryCount + 1);
					setRetryCount((prev) => prev + 1);
					setError(null);
					setIsLoading(true);
					connectToCamera();
				}, delay);
			} else {
				console.log('[Camera] Max retries reached');
			}
		},
		[retryCount]
	);

	const connectToCamera = useCallback(async () => {
		if (isConnectingRef.current) {
			console.log('[Camera] Already connecting');
			return;
		}

		isConnectingRef.current = true;
		isFirstFrameRef.current = true;
		console.log('[Camera] Connecting...');

		try {
			if (socketRef.current) {
				console.log('[Camera] Cleaning up previous connection');
				socketRef.current.disconnect();
				socketRef.current = null;
			}

			const socket = await createSocket();
			socketRef.current = socket;

			socket.on('connect', () => {
				console.log('[Camera] Connected');
				connectionStatusRef.current = 'connected';
				setError(null);

				setTimeout(() => {
					if (socket.connected) {
						console.log('[Camera] Starting stream');
						socket.emit('start-stream', {
							cameraIp: cameraIp,
							cameraPort: cameraPort,
						});
					}
				}, 1000);
			});

			socket.on('camera-frame', (frame: string) => {
				const newImageUrl = `data:image/jpeg;base64,${frame}`;

				if (isFirstFrameRef.current) {
					setImageUrl(newImageUrl);
					isFirstFrameRef.current = false;
					setIsLoading(false);
				} else {
					setNextImageUrl(newImageUrl);
				}

				setError(null);
			});

			socket.on('camera-error', (error: string) => {
				console.log('[Camera] Stream error:', error);
				setError(error);
				handleError(error);
			});

			socket.on('connect_error', (error: Error) => {
				console.log('[Camera] Connection error:', error.message);
				connectionStatusRef.current = 'error';
				handleError('Ошибка подключения к серверу');
			});

			socket.on('disconnect', (reason: string) => {
				console.log('[Camera] Disconnected:', reason);
				connectionStatusRef.current = 'disconnected';
				handleError('Соединение закрыто');
			});

			socket.on('stream-started', () => {
				console.log('[Camera] Stream started');
				setError(null);
			});

			socket.on('stream-stopped', () => {
				console.log('[Camera] Stream stopped');
			});
		} catch (error) {
			console.error('[Camera] Connection error:', {
				error: error instanceof Error ? error.message : error,
			});
			handleError('Ошибка подключения к камере');
		} finally {
			isConnectingRef.current = false;
		}
	}, [cameraIp, cameraPort, handleError]);

	useEffect(() => {
		connectToCamera();

		return () => {
			console.log('[Camera] Cleaning up');
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
			if (startStreamTimeoutRef.current) {
				clearTimeout(startStreamTimeoutRef.current);
			}
		};
	}, [connectToCamera]);

	useEffect(() => {
		const timeoutId = startStreamTimeoutRef.current;
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, []);

	return (
		<View style={styles.container}>
			{error ? (
				<View style={styles.placeholder}>
					<Text style={[styles.errorText, { color: colors.error }]}>
						{error}
						{retryCount > 0 && ` (Попытка ${retryCount}/5)`}
					</Text>
					<TouchableOpacity
						style={[styles.retryButton, { backgroundColor: colors.primary }]}
						onPress={() => {
							console.log('[Camera] Manual retry');
							setError(null);
							setIsLoading(true);
							setRetryCount(0);
							if (socketRef.current) {
								socketRef.current.disconnect();
							}
							connectToCamera();
						}}
					>
						<Text style={styles.retryButtonText}>Повторить</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.imageContainer}>
					{imageUrl && (
						<Image
							source={{ uri: imageUrl }}
							style={styles.image}
							onLoadStart={() => {
								if (isFirstFrameRef.current) {
									console.log('[Camera] First frame loading');
								}
							}}
							onLoadEnd={() => {
								if (isFirstFrameRef.current) {
									console.log('[Camera] First frame loaded');
									setIsLoading(false);
								}
							}}
							onError={(e) => {
								console.error('[Camera] Image error:', e.nativeEvent.error);
								handleError('Ошибка загрузки изображения');
							}}
						/>
					)}
					{nextImageUrl && (
						<Image
							source={{ uri: nextImageUrl }}
							style={[styles.image, styles.nextImage]}
							onLoadEnd={() => {
								setImageUrl(nextImageUrl);
								setNextImageUrl(null);
							}}
						/>
					)}
					{isLoading && (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size='large' color={colors.primary} />
						</View>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	placeholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
	},
	imageContainer: {
		flex: 1,
		position: 'relative',
	},
	image: {
		flex: 1,
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	loadingContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	retryButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	retryButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	nextImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		opacity: 0,
	},
});
