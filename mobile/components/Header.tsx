import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { View, Text } from 'react-native';

interface HeaderProps {
	title: string;
}

export function Header({ title }: HeaderProps) {
	const { colors } = useTheme();

	return (
		<View
			style={{
				backgroundColor: colors.background,
				padding: 16,
				borderBottomWidth: 1,
				borderBottomColor: colors.border,
			}}
		>
			<Text
				style={{
					fontSize: 20,
					fontWeight: '600',
					color: colors.text,
				}}
			>
				{title}
			</Text>
		</View>
	);
}
