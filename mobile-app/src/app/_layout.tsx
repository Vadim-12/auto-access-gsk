import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { KeyboardDismissView } from '@/components/KeyboardDismissView';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
	console.log('RootLayout');
	const { colors } = useTheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	if (!loaded) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.background,
				}}
			>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	return (
		<AuthProvider>
			<ThemeProvider>
				<KeyboardDismissView>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name='index' />
						<Stack.Screen name='(auth)' />
						<Stack.Screen name='(app)' />
						<Stack.Screen name='+not-found' />
					</Stack>
					<StatusBar style='auto' />
				</KeyboardDismissView>
			</ThemeProvider>
		</AuthProvider>
	);
}
