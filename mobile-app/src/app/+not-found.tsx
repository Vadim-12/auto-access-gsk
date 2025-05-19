import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';

export default function NotFoundScreen() {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<ThemedView style={styles.container}>
				<ThemedText type='title'>Этот экран не существует.</ThemedText>

				<Link
					href={isAuthenticated ? '/(app)' : '/sign-in'}
					style={styles.link}
				>
					<ThemedText type='link'>
						{isAuthenticated
							? 'Перейти на главный экран'
							: 'Перейти на страницу входа'}
					</ThemedText>
				</Link>
			</ThemedView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
});
