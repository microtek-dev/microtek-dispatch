// Container.js
import React, { ReactNode } from 'react';
import { View, ViewStyle, StatusBar, Platform } from 'react-native';

interface ContainerProps {
	children: ReactNode;
	style?: ViewStyle;
}

const Container = ({ children, style }: ContainerProps) => {
	const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
	return (
		<View
			style={[
				{
					margin: statusBarHeight,
				},
				style,
			]}>
			{children}
		</View>
	);
};

export default Container;
