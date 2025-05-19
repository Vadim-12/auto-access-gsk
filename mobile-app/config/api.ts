import { API_URL, API_WS_URL, NGROK_URL } from '@env';

export const config = {
	apiUrl: __DEV__ ? NGROK_URL || API_URL : API_URL,
	wsUrl: __DEV__ ? NGROK_URL?.replace('http', 'ws') || API_WS_URL : API_WS_URL,
};
