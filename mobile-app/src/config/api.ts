export const API_CONFIG = {
	baseURL: process.env.API_URL,
	endpoints: {
		auth: {
			login: '/auth/login',
			register: '/auth/register',
			refresh: '/auth/refresh',
		},
	},
} as const;
