import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	colors: {
		background: string;
		text: string;
		primary: string;
		border: string;
		inputBackground: string;
		error: string;
	};
}

const lightColors = {
	background: '#FFFFFF',
	text: '#000000',
	primary: '#007AFF',
	border: '#DDDDDD',
	inputBackground: '#FFFFFF',
	error: '#FF3B30',
};

const darkColors = {
	background: '#000000',
	text: '#FFFFFF',
	primary: '#0A84FF',
	border: '#333333',
	inputBackground: '#1C1C1E',
	error: '#FF453A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const colorScheme = useColorScheme();
	const theme = colorScheme || 'light';
	const colors = theme === 'light' ? lightColors : darkColors;

	return (
		<ThemeContext.Provider value={{ theme, colors }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
