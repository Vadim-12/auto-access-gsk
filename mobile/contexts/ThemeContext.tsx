import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	colors: {
		background: string;
		text: string;
		textSecondary: string;
		primary: string;
		border: string;
		inputBackground: string;
		error: string;
		success: string;
		warning: string;
		cardBorderColor: string;
		cardBackground: string;
		shadowColor: string;
	};
}

const lightColors = {
	background: '#FFFFFF',
	text: '#000000',
	textSecondary: '#666666',
	primary: '#007AFF',
	border: '#E5E5E5',
	inputBackground: '#F5F5F5',
	error: '#FF3B30',
	success: '#34C759',
	warning: '#FF9500',
	cardBorderColor: '#E5E5E5',
	cardBackground: '#FFFFFF',
	shadowColor: 'rgba(0, 0, 0, 0.1)',
};

const darkColors = {
	background: '#000000',
	text: '#FFFFFF',
	textSecondary: '#999999',
	primary: '#0A84FF',
	border: '#333333',
	inputBackground: '#1C1C1E',
	error: '#FF453A',
	success: '#32D74B',
	warning: '#FF9F0A',
	cardBorderColor: '#333333',
	cardBackground: '#1C1C1E',
	shadowColor: 'rgba(255, 255, 255, 0.1)',
};

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	toggleTheme: () => {},
	colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	const colors = theme === 'light' ? lightColors : darkColors;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
			{children}
		</ThemeContext.Provider>
	);
};

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
