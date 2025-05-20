import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { authStyles } from '@/styles/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthIndex() {
	const { user, isLoading } = useAuth();
	const { colors } = useTheme();

	console.log('AuthIndex');

	if (isLoading) {
		return (
			<View
				style={[authStyles.container, { backgroundColor: colors.background }]}
			>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	if (user) {
		return <Redirect href='/(app)' />;
	}

	return <Redirect href='/(auth)/sign-in' />;
}
