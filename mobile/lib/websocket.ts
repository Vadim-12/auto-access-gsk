import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_WS_URL } from '@/constants/config';

console.log('WebSocket URL:', API_WS_URL);

export const createSocket = async () => {
	const token = await AsyncStorage.getItem('access_token');
	if (!token) {
		throw new Error('No access token found');
	}

	console.log(
		'Creating WebSocket connection with token:',
		token.substring(0, 10) + '...'
	);

	const socket = io(API_WS_URL, {
		auth: { token },
		transports: ['websocket'],
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
		timeout: 20000,
		forceNew: true,
		upgrade: false,
		rememberUpgrade: false,
		rejectUnauthorized: false,
		path: '/socket.io',
		extraHeaders: {
			'Access-Control-Allow-Origin': '*',
		},
	});

	// Добавляем обработчики для отладки
	socket.on('connect', () => {
		console.log('WebSocket connected, ID:', socket.id);
		console.log('Connection state:', {
			connected: socket.connected,
			disconnected: socket.disconnected,
			transport: socket.io.engine.transport.name,
		});
	});

	socket.on('connect_error', (error) => {
		console.error('WebSocket connection error:', error);
		console.error('Connection state on error:', {
			connected: socket.connected,
			disconnected: socket.disconnected,
			transport: socket.io.engine?.transport?.name,
		});
	});

	socket.on('error', (error) => {
		console.error('WebSocket error:', error);
	});

	socket.on('disconnect', (reason) => {
		console.log('WebSocket disconnected:', reason);
		console.log('Connection state on disconnect:', {
			connected: socket.connected,
			disconnected: socket.disconnected,
			transport: socket.io.engine?.transport?.name,
		});
	});

	socket.on('reconnect', (attemptNumber) => {
		console.log('WebSocket reconnected after', attemptNumber, 'attempts');
	});

	socket.on('reconnect_error', (error) => {
		console.error('WebSocket reconnection error:', error);
	});

	return socket;
};
