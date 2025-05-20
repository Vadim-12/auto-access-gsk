export const API_CONFIG = {
	baseURL: process.env.EXPO_PUBLIC_API_HTTP_URL,
	endpoints: {
		auth: {
			signIn: '/auth/sign-in',
			signUp: '/auth/sign-up',
			refresh: '/auth/refresh',
		},
	},
} as const;
