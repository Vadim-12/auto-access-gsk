import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useHasAdmin } from '@/hooks/useHasAdmin';

export default function Index() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const { hasAdmin, isLoading: isCheckingAdmin } = useHasAdmin();

	if (isAuthLoading || isCheckingAdmin) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	if (!hasAdmin) {
		return <Redirect href='/(auth)/first-admin' />;
	}

	if (user) {
		return <Redirect href='/(app)/(garages)' />;
	}

	return <Redirect href='/(auth)/sign-in' />;
}
