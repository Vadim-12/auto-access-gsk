import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
	const { user, isLoading } = useAuth();

	console.log('Index', { user, isLoading });

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	if (user) {
		return <Redirect href='/(app)' />;
	}

	return <Redirect href='/(auth)' />;
}
