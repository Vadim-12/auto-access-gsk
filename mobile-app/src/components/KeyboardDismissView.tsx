import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export function KeyboardDismissView({ children }: Props) {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={{ flex: 1 }}>{children}</View>
		</TouchableWithoutFeedback>
	);
}
