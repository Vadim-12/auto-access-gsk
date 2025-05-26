import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ServerStatus } from '@/components/ServerStatus';

export default function SettingsScreen() {
	const { colors } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<ServerStatus />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
