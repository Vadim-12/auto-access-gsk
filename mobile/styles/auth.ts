import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		marginTop: 30,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		padding: 15,
		borderRadius: 8,
		marginBottom: 15,
	},
	button: {
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		width: '100%',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	link: {
		marginTop: 15,
		alignItems: 'center',
	},
	linkText: {
		textAlign: 'center',
	},
});
