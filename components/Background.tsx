import React, { memo } from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';

type Props = {
	children: React.ReactNode;
};

const Background = ({ children }: Props) => (
	<KeyboardAvoidingView
		style={styles.container}
		behavior="padding">
		{children}
	</KeyboardAvoidingView>
);

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: '100%',
	},
	container: {
		flex: 1,
		padding: 20,
		width: '100%',
		maxWidth: 340,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default memo(Background);
