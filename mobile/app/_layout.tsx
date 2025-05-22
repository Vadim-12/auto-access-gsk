import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { KeyboardDismissView } from '@/components/KeyboardDismissView';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
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
				}}
			>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	return (
		<ThemeProvider>
			<AuthProvider>
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
			</AuthProvider>
		</ThemeProvider>
	);
}
